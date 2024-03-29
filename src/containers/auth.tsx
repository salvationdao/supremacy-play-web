import { createContext, Dispatch, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "react-fetching-library"
import { useFingerprint, useSupremacy } from "."
import { PASSPORT_WEB } from "../constants"
import { GameServerLoginCheck, GetGlobalFeatures, GameServerTokenLoginCheck } from "../fetching"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { useInactivity } from "../hooks/useInactivity"
import { GameServerKeys } from "../keys"
import { theme } from "../theme/theme"
import { FactionWithPalette, Feature, FeatureName, PunishListItem, RoleType, User, UserFromPassport, UserRank, UserStat } from "../types"
import { useTheme } from "./theme"

export const FallbackUser: User = {
    id: "",
    faction_id: "",
    username: "UNKNOWN",
    gid: 0,
    rank: "NEW_RECRUIT",
    features: [],
    role_type: RoleType.player,
}

export const FallbackFaction: FactionWithPalette = {
    id: "",
    label: "",
    logo_url: "",
    background_url: "",
    wallpaper_url: "",
    description: "",
    palette: theme.factionTheme,
}

export interface AuthState {
    isActive: boolean
    setIsActive: Dispatch<React.SetStateAction<boolean>>
    isHidden: boolean
    isLoggingIn: boolean
    onLogInClick: () => void
    setPassportPopup: Dispatch<React.SetStateAction<Window | null>>
    userHasFeature: (featureName: FeatureName) => boolean
    user: User
    userFromPassport?: UserFromPassport
    userID: string
    factionID: string
    roleType: RoleType
    setUser: Dispatch<React.SetStateAction<User>>
    userStat: UserStat
    setUserStat: Dispatch<React.SetStateAction<UserStat>>
    userRank: UserRank
    setUserRank: Dispatch<React.SetStateAction<UserRank>>
    punishments: PunishListItem[]
    setPunishments: Dispatch<React.SetStateAction<PunishListItem[]>>
    globalFeatures: Feature[]

    setFactionPassExpiryDate: Dispatch<React.SetStateAction<Date | null>>
    factionPassExpiryDate: Date | null
}

const initialState: AuthState = {
    isActive: true,
    setIsActive: () => {
        return
    },
    isHidden: false,
    isLoggingIn: false,
    onLogInClick: () => {
        return
    },
    setPassportPopup: () => {
        return
    },
    userHasFeature: () => {
        return false
    },
    user: FallbackUser,
    userID: FallbackUser.id,
    factionID: FallbackUser.faction_id,
    roleType: FallbackUser.role_type,
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
    globalFeatures: [],
    setFactionPassExpiryDate: () => {
        return
    },
    factionPassExpiryDate: null,
}

export const AuthContext = createContext<AuthState>(initialState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { isServerDown } = useSupremacy()
    const [isLoggingIn, setIsLoggingIn] = useState(true)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const popupCheckInterval = useRef<NodeJS.Timer>()
    const { fingerprint } = useFingerprint()

    const [userFromPassport, setUserFromPassport] = useState<UserFromPassport>()
    const [user, setUser] = useState<User>(initialState.user)
    const [factionPassExpiryDate, setFactionPassExpiryDate] = useState<Date | null>(null)
    const userID = user.id
    const factionID = user.faction_id
    const roleType = user.role_type
    const [isActive, setIsActive] = useState(true)
    const [userStat, setUserStat] = useState<UserStat>(initialState.userStat)
    const [userRank, setUserRank] = useState<UserRank>(initialState.userRank)
    const [punishments, setPunishments] = useState<PunishListItem[]>(initialState.punishments)
    // Checks if supremacy tab is active
    const [isHidden, setIsHidden] = useState(false)

    const { query: getGlobalFeatures } = useQuery(GetGlobalFeatures())
    const [globalFeatures, setGlobalFeatures] = useState<Feature[]>([])
    const { query: gameserverLoginCheck } = useQuery(GameServerLoginCheck(fingerprint), false)
    const { mutate: passportLoginCheck } = useMutation(GameServerTokenLoginCheck)

    const handleVisibilityChange = useCallback(() => {
        if (document["hidden"]) {
            setIsHidden(true)
        } else {
            setIsHidden(false)
        }
    }, [])

    useEffect(() => {
        if (typeof document.hidden !== "undefined" && typeof document.addEventListener !== "undefined") {
            document.addEventListener("visibilitychange", handleVisibilityChange)
        } else {
            console.error("Failed to get visibility.")
        }
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [handleVisibilityChange])

    const authCheckCallback = useCallback(
        async (event?: MessageEvent) => {
            if (event && !("issue_token" in event.data)) return
            const issueToken = event?.data.issue_token as string
            // Check passport server login
            if (!userFromPassport) {
                try {
                    const resp = await passportLoginCheck({
                        issue_token: issueToken,
                        fingerprint,
                    })
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
        [fingerprint, passportLoginCheck, userFromPassport],
    )

    useEffect(() => {
        if (isServerDown) return

        gameserverLoginCheck()
            .then((resp) => {
                if (resp.error || !resp.payload) {
                    setUser(initialState.user)
                    return
                }

                setUser(resp.payload)
            })
            .finally(() => setIsLoggingIn(false))
    }, [userFromPassport, gameserverLoginCheck, isServerDown, setIsLoggingIn])

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

    // Fetch global features
    useEffect(() => {
        ;(async () => {
            if (isServerDown) return

            try {
                const resp = await getGlobalFeatures()
                if (resp.error || resp.payload == null) return
                setGlobalFeatures(resp.payload)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [getGlobalFeatures, isServerDown])

    useEffect(() => {
        authCheckCallback()
    }, [authCheckCallback])

    // Open iframe to passport web to login
    const onLogInClick = useCallback(async () => {
        if (isLoggingIn) return
        setIsLoggingIn(true)
        const href = `${PASSPORT_WEB}external/login?origin=${window.location.origin}`
        const popup = window.open(href, "_blank")

        setPassportPopup(popup)
    }, [isLoggingIn])

    const userHasFeature = useCallback(
        (featureName: FeatureName) => {
            const allFeatures = [...globalFeatures, ...(user.features || [])]
            const index = allFeatures.findIndex((el) => el.name === featureName)
            return index !== -1
        },
        [globalFeatures, user.features],
    )

    return (
        <AuthContext.Provider
            value={{
                isActive,
                setIsActive,
                isHidden,
                isLoggingIn,
                onLogInClick,
                setPassportPopup,
                userHasFeature,
                user,
                userFromPassport,
                userID,
                factionID,
                roleType,
                setUser,
                punishments,
                setPunishments,
                userStat,
                setUserStat,
                userRank,
                setUserRank,
                globalFeatures,
                setFactionPassExpiryDate,
                factionPassExpiryDate,
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
    const { userID, factionID, setUser, setUserStat, setUserRank, setPunishments, setIsActive, setFactionPassExpiryDate } = useAuth()
    const { getFaction } = useSupremacy()
    const { setFactionColors } = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const isActive = useInactivity(120000)
    const activeInterval = useRef<NodeJS.Timer>()

    // Subscribe on the user
    useGameServerSubscriptionSecuredUser<User>(
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
    useGameServerSubscriptionSecuredUser<UserStat>(
        {
            URI: "/stat",
            key: GameServerKeys.SubscribeUserStat,
        },
        (payload) => {
            if (!payload) return
            setUserStat(payload)
        },
    )

    // Listen on user ranking
    useGameServerSubscriptionSecuredUser<UserRank>(
        {
            URI: "/rank",
            key: GameServerKeys.PlayerRank,
        },
        (payload) => {
            if (!payload) return
            setUserRank(payload)
        },
    )

    // Listen on user punishments
    useGameServerSubscriptionSecuredUser<PunishListItem[]>(
        {
            URI: "/punishment_list",
            key: GameServerKeys.ListPunishments,
        },
        (payload) => {
            if (!payload) return
            setPunishments(payload)
        },
    )

    // Listen on user punishments
    useGameServerSubscriptionSecuredUser<Date | null>(
        {
            URI: "/faction_pass_expiry_date",
            key: GameServerKeys.SubPlayerFactionPassExpiryDate,
        },
        (payload) => {
            setFactionPassExpiryDate(payload)
        },
    )

    useEffect(() => {
        const faction = getFaction(factionID)

        if (faction) {
            setFactionColors(faction.palette)
        }
    }, [factionID, getFaction, setFactionColors])

    const sendFruit = useCallback(
        async (a: boolean) => {
            try {
                setIsActive(a)
                await send<null, { fruit: "APPLE" | "BANANA" }>(GameServerKeys.ToggleGojiBerryTea, {
                    fruit: a ? "APPLE" : "BANANA",
                })
            } catch (e) {
                console.error(e)
            }
        },
        [send, setIsActive],
    )

    useEffect(() => {
        if (!userID || !factionID) return
        sendFruit(isActive)
        activeInterval && activeInterval.current && clearInterval(activeInterval.current)
        activeInterval.current = setInterval(() => sendFruit(isActive), 60000)
    }, [isActive, factionID, sendFruit, userID])

    return null
}
