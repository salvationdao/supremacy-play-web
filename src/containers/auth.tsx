import { createContext, Dispatch, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useQuery } from "react-fetching-library"
import { useSupremacy } from "."
import { PASSPORT_WEB } from "../constants"
import { PassportLoginCheck, GetGameServerPlayer } from "../fetching"
import { shadeColor } from "../helpers"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { useInactivity } from "../hooks/useInactivity"
import { GameServerKeys } from "../keys"
import { colors } from "../theme/theme"
import { Faction, FeatureName, User, UserRank, UserStat, UserFromPassport, PunishListItem } from "../types"
import { useTheme } from "./theme"

export const FallbackUser: User = {
    id: "",
    faction_id: "",
    username: "UNKNOWN",
    gid: 0,
    rank: "NEW_RECRUIT",
    features: [],
}

export const FallbackFaction: Faction = {
    id: "",
    label: "",
    logo_url: "",
    background_url: "",
    wallpaper_url: "",
    primary_color: colors.neonBlue,
    secondary_color: "#000000",
    background_color: shadeColor(colors.neonBlue, -95),
    description: "",
}

export interface AuthState {
    isLoggingIn: boolean
    onLogInClick: () => void
    userHasFeature: (featureName: FeatureName) => boolean
    user: User
    userID: string
    factionID: string
    setUser: Dispatch<React.SetStateAction<User>>
    userStat: UserStat
    setUserStat: Dispatch<React.SetStateAction<UserStat>>
    userRank: UserRank
    setUserRank: Dispatch<React.SetStateAction<UserRank>>
    punishments: PunishListItem[]
    setPunishments: Dispatch<React.SetStateAction<PunishListItem[]>>
}

const initialState: AuthState = {
    isLoggingIn: false,
    onLogInClick: () => {
        return
    },
    userHasFeature: () => {
        return false
    },
    user: FallbackUser,
    userID: FallbackUser.id,
    factionID: FallbackUser.faction_id,
    setUser: () => {
        return
    },
    userRank: "NEW_RECRUIT",
    setUserRank: () => {
        return
    },
    userStat: {
        id: "",
        view_battle_count: 0,
        last_seven_days_kills: 0,
        total_ability_triggered: 0,
        ability_kill_count: 0,
        mech_kill_count: 0,
    },
    setUserStat: () => {
        return
    },
    punishments: [],
    setPunishments: () => {
        return
    },
}

export const AuthContext = createContext<AuthState>(initialState)

export const AuthProvider: React.FC = ({ children }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(true)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const popupCheckInterval = useRef<NodeJS.Timer>()

    const [userFromPassport, setUserFromPassport] = useState<UserFromPassport>()
    const [user, setUser] = useState<User>(initialState.user)
    const userID = user.id
    const factionID = user.faction_id

    const [userStat, setUserStat] = useState<UserStat>(initialState.userStat)
    const [userRank, setUserRank] = useState<UserRank>(initialState.userRank)
    const [punishments, setPunishments] = useState<PunishListItem[]>(initialState.punishments)

    const { query: passportLoginCheck } = useQuery(PassportLoginCheck(), false)
    const { query: getGameServerPlayer } = useQuery(GetGameServerPlayer(userFromPassport?.id), false)

    const authCheckCallback = useCallback(
        async (event?: MessageEvent) => {
            if (event && !("token" in event.data)) return
            // Check passport server login
            if (!userFromPassport) {
                try {
                    const resp = await passportLoginCheck()
                    if (resp.error || !resp.payload) {
                        setUserFromPassport(undefined)
                        return
                    }

                    setUserFromPassport(resp.payload)
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [passportLoginCheck, userFromPassport],
    )

    useEffect(() => {
        if (!userFromPassport) {
            setIsLoggingIn(false)
            return
        }

        getGameServerPlayer().then((resp) => {
            if (resp.error || !resp.payload) {
                setUser(initialState.user)
                return
            }

            setUser(resp.payload)
        })
        setIsLoggingIn(false)
    }, [userFromPassport, setIsLoggingIn])

    // Check if login in the iframe has been successful (window closed), if closed then do clean up
    useEffect(() => {
        if (!passportPopup) return

        // Listening for a token coming from the iframe
        window.addEventListener("message", authCheckCallback, false)

        const clearPopupCheckInterval = () => {
            popupCheckInterval.current && clearInterval(popupCheckInterval.current)
        }

        clearPopupCheckInterval()
        popupCheckInterval.current = setInterval(async () => {
            if (!passportPopup) return clearPopupCheckInterval()
            if (passportPopup.closed) {
                clearPopupCheckInterval()
                setPassportPopup(null)
                await authCheckCallback()
                setIsLoggingIn(false)
                window.removeEventListener("message", authCheckCallback)
            }
        }, 1000)

        return clearPopupCheckInterval
    }, [passportPopup, authCheckCallback])

    useEffect(() => {
        authCheckCallback()
    }, [authCheckCallback])

    // Open iframe to passport web to login
    const onLogInClick = useCallback(async () => {
        if (isLoggingIn) return
        setIsLoggingIn(true)

        const width = 520
        const height = 730
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const href = `${PASSPORT_WEB}external/login?tenant=supremacy&redirectURL=${encodeURIComponent(`${window.location.origin}/login-redirect`)}`
        const popup = window.open(href, "Connect with XSYN Passport", `width=${width},height=${height},left=${left},top=${top},popup=1`)

        setPassportPopup(popup)
    }, [isLoggingIn])

    const userHasFeature = useCallback(
        (featureName: FeatureName) => {
            if (!userID || !user.features) return false
            const index = user.features.findIndex((el) => el.name === featureName)
            return index !== -1
        },
        [user.features, userID],
    )
    return (
        <AuthContext.Provider
            value={{
                isLoggingIn,
                onLogInClick,
                userHasFeature,
                user,
                userID,
                factionID,
                setUser,
                punishments,
                setPunishments,
                userStat,
                setUserStat,
                userRank,
                setUserRank,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext<AuthState>(AuthContext)
}

export const UserUpdater = () => {
    const { userID, factionID, setUser, setUserStat, setUserRank, setPunishments } = useAuth()
    const { getFaction } = useSupremacy()
    const { setFactionColors } = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const isActive = useInactivity(120000)
    const activeInterval = useRef<NodeJS.Timer>()

    // Subscribe on the user
    useGameServerSubscriptionUser<User>(
        {
            URI: "",
            key: GameServerKeys.UserSubscribe,
        },
        (payload) => {
            if (!payload) return
            setUser(payload)
            setUserRank(payload.rank)
        },
    )

    // Subscribe user stats
    useGameServerSubscriptionUser<UserStat>(
        {
            URI: "",
            key: GameServerKeys.SubscribeUserStat,
        },
        (payload) => {
            if (!payload) return
            setUserStat(payload)
        },
    )

    // Listen on user ranking
    useGameServerSubscriptionUser<UserRank>(
        {
            URI: "",
            key: GameServerKeys.PlayerRank,
        },
        (payload) => {
            if (!payload) return
            setUserRank(payload)
        },
    )

    // Listen on user punishments
    useGameServerSubscriptionUser<PunishListItem[]>(
        {
            URI: "/punishment_list",
            key: GameServerKeys.ListPunishments,
        },
        (payload) => {
            if (!payload) return
            setPunishments(payload)
        },
    )

    useEffect(() => {
        const faction = getFaction(factionID)

        if (faction) {
            setFactionColors({ primary: faction.primary_color, secondary: faction.secondary_color, background: shadeColor(faction.primary_color, -95) })
        }
    }, [factionID, getFaction, setFactionColors])

    const sendFruit = useCallback(
        async (a: boolean) => {
            try {
                await send<null, { fruit: "APPLE" | "BANANA" }>(GameServerKeys.ToggleGojiBerryTea, {
                    fruit: a ? "APPLE" : "BANANA",
                })
            } catch (e) {
                console.error(e)
            }
        },
        [send],
    )

    useEffect(() => {
        if (!userID || !factionID) return
        sendFruit(isActive)
        activeInterval && activeInterval.current && clearInterval(activeInterval.current)
        activeInterval.current = setInterval(() => sendFruit(isActive), 60000)
    }, [isActive, factionID, sendFruit, userID])

    return null
}
