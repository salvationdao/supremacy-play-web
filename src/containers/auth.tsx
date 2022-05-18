import { createContext, Dispatch, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { Faction, User, UserRank, UserStat } from "../types"
import { GAME_SERVER_HOSTNAME, PASSPORT_WEB } from "../constants"
import { PunishListItem } from "../types/chat"
import { shadeColor } from "../helpers"
import { useInactivity } from "../hooks/useInactivity"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { useTheme } from "./theme"
import { APICheck } from "../fetching"
import { useSupremacy } from "."
import { colors } from "../theme/theme"

export const FallbackUser: User = {
    id: "",
    faction_id: "",
    username: "UNKNOWN",
    gid: 0,
    avatar_id: "",
    rank: "NEW_RECRUIT",
}

export const FallbackFaction: Faction = {
    id: "",
    label: "",
    logo_url: "",
    background_url: "",
    primary_color: colors.neonBlue,
    secondary_color: "#000000",
    background_color: shadeColor(colors.neonBlue, -95),
    description: "",
}

export interface AuthState {
    isLoggingIn: boolean
    onLogInClick: () => void
    token: string

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
    token: "",

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
    const [token, setToken] = useState<string>("")
    const [isLoggingIn, setIsLoggingIn] = useState(true)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)

    const [user, setUser] = useState<User>(initialState.user)
    const userID = user.id
    const factionID = user.faction_id

    const [userStat, setUserStat] = useState<UserStat>(initialState.userStat)
    const [userRank, setUserRank] = useState<UserRank>(initialState.userRank)
    const [punishments, setPunishments] = useState<PunishListItem[]>(initialState.punishments)

    const { query: queryAPICheck } = useParameterizedQuery(APICheck)

    // Open iframe to passport web to login
    const onLogInClick = useCallback(async () => {
        if (isLoggingIn) return
        setIsLoggingIn(true)

        const width = 520
        const height = 730
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const href = `${PASSPORT_WEB}/external/login?omitSideBar=true&&tenant=supremacy&redirectURL=${encodeURIComponent(
            `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/xsyn`,
        )}`
        const popup = window.open(href, "Connect with XSYN Passport", `width=${width},height=${height},left=${left},top=${top},popup=1`)
        if (!popup) {
            setIsLoggingIn(false)
            return
        }

        setPassportPopup(popup)
    }, [isLoggingIn])

    const postMessageCallback = useCallback(
        (event: MessageEvent) => {
            if ("token" in event.data) setToken(event.data.token)
        },
        [setToken],
    )

    // Check if login in the iframe has been successful (window closed), if closed then do clean up
    useEffect(() => {
        if (!passportPopup) return

        const popupCheckInterval = setInterval(() => {
            if (!passportPopup) return

            // Listening for a token coming from the iframe
            window.addEventListener("message", postMessageCallback, false)

            if (passportPopup.closed) {
                popupCheckInterval && clearInterval(popupCheckInterval)
                setIsLoggingIn(false)
                setPassportPopup(null)
                window.removeEventListener("message", postMessageCallback)
            }
        }, 1000)

        return () => clearInterval(popupCheckInterval)
    }, [passportPopup, postMessageCallback])

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoggingIn(true)
                const resp = await queryAPICheck(token)

                if (resp.error || !resp.payload) {
                    setUser(FallbackUser)
                    return
                }

                const user = resp.payload
                setUser(user)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoggingIn(false)
            }
        })()
    }, [queryAPICheck, token])

    return (
        <AuthContext.Provider
            value={{
                isLoggingIn,
                onLogInClick,
                token,
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
            URI: "",
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
                console.debug(e)
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
