import React, { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar } from "."
import { useInactivity } from "../hooks/useInactivity"
import { GameServerKeys } from "../keys"
import { UpdateTheme, User, UserStat } from "../types"

export interface AuthContainerType {
    user: User | undefined
    userID: string | undefined
    faction_id: string | undefined
    authSessionIDGetLoading: boolean
    authSessionIDGetError: undefined
    userStat: UserStat
}

/**
 * A Container that handles Authorisation
 */
const AuthContainer = createContainer((initialState?: { setLogin(user: User): void }): AuthContainerType => {
    const isActive = useInactivity(120000)
    const { newSnackbarMessage } = useSnackbar()
    const { gameserverSessionID, setGameserverSessionID } = usePassportServerAuth()
    const { updateTheme } = React.useContext(UpdateTheme)
    const { state, send, subscribe } = useGameServerWebsocket()
    const [user, setUser] = useState<User>()
    const userID = user?.id
    const activeInterval = useRef<NodeJS.Timer>()

    const [userStat, setUserStat] = useState<UserStat>({
        id: "",
        total_ability_triggered: 0,
        kill_count: 0,
        view_battle_count: 0,
        mech_kill_count: 0,
    })

    // start to subscribe user update
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<UserStat>(GameServerKeys.SubscribeUserStat, (us) => {
            if (!us) return
            setUserStat(us)
        })
    }, [userID, subscribe, state])

    useEffect(() => {
        if (user && initialState && initialState.setLogin) initialState.setLogin(user)
    }, [user])

    const [authSessionIDGetLoading, setAuthSessionIDGetLoading] = useState(true)
    const [authSessionIDGetError, setAuthSessionIDGetError] = useState()

    const sendFruit = useCallback(async () => {
        if (state !== WebSocket.OPEN || !user || !user.faction_id || !user.faction) return
        try {
            await send<null, { fruit: "APPLE" | "BANANA" }>(GameServerKeys.ToggleGojiBerryTea, {
                fruit: isActive ? "APPLE" : "BANANA",
            })
        } catch (e) {
            console.debug(e)
        }
    }, [state, user, isActive])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !user || !user.faction_id || !user.faction) return
        sendFruit()
        activeInterval && activeInterval.current && clearInterval(activeInterval.current)
        activeInterval.current = setInterval(sendFruit, 60000)
    }, [state, user, isActive])

    // Will receive user data after server complete the "auth ring check"
    useEffect(() => {
        if (!subscribe || state !== WebSocket.OPEN || !userID || !window.localStorage.getItem("ring_check_token"))
            return
        return subscribe<User>(
            GameServerKeys.UserSubscribe,
            (u) => {
                if (u) {
                    setUser(u)
                    if (u?.faction?.theme) updateTheme(u.faction.theme)
                }
            },
            { id: userID },
        )
    }, [state, subscribe, userID])

    useEffect(() => {
        if (!subscribe || state !== WebSocket.OPEN) return
        return subscribe<User>(
            GameServerKeys.RingCheck,
            (u) => {
                if (u) {
                    setUser(u)
                    if (u?.faction?.theme) updateTheme(u.faction.theme)
                }
            },
            null,
            true,
        )
    }, [state, subscribe])

    useEffect(() => {
        if (state !== WebSocket.OPEN || user || gameserverSessionID) return
        ;(async () => {
            try {
                setAuthSessionIDGetLoading(true)
                const jwtToken = localStorage.getItem("ring_check_token")
                if (jwtToken) {
                    send<User, { token: string }>(GameServerKeys.AuthJWTCheck, {
                        token: jwtToken,
                    })
                }
                const resp = await send<string, null>(GameServerKeys.AuthSessionIDGet)
                setGameserverSessionID(resp)
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            } catch (e: any) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get session ID from game server.", "error")
                setAuthSessionIDGetError(e)
                console.debug(e)
            } finally {
                setAuthSessionIDGetLoading(false)
            }
        })()
    }, [gameserverSessionID, send, state, user])

    useEffect(() => {
        if (state !== WebSocket.CLOSED) return
        setUser(undefined)
    }, [state])

    return {
        user,
        userID: user?.id,
        faction_id: user?.faction_id,
        authSessionIDGetLoading,
        authSessionIDGetError,
        userStat,
    }
})

export const GameServerAuthProvider = AuthContainer.Provider
export const useGameServerAuth = AuthContainer.useContainer
