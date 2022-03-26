import React, { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar } from "."
import { useInactivity } from "../hooks/useInactivity"
import { GameServerKeys } from "../keys"
import { UpdateTheme, User } from "../types"

export interface AuthContainerType {
    user: User | undefined
    userID: string | undefined
    faction_id: string | undefined
    authSessionIDGetLoading: boolean
    authSessionIDGetError: undefined
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

    useEffect(() => {
        if (user && initialState && initialState.setLogin) initialState.setLogin(user)
    }, [user])

    const [authSessionIDGetLoading, setAuthSessionIDGetLoading] = useState(true)
    const [authSessionIDGetError, setAuthSessionIDGetError] = useState()

    useEffect(() => {
        if (state !== WebSocket.OPEN || !user) return
        ;(async () => {
            try {
                await send<null, { payload: "APPLE" | "BANANA" }>(GameServerKeys.ToggleGojiBerryTea, {
                    payload: isActive ? "APPLE" : "BANANA",
                })
            } catch (e) {
                console.debug(e)
            }
        })()
    }, [isActive, user])

    // Will receive user data after server complete the "auth ring check"
    useEffect(() => {
        if (!subscribe || state !== WebSocket.OPEN || !userID || !window.localStorage.getItem("ring_check_token"))
            return
        return subscribe<User>(
            GameServerKeys.UserSubscribe,
            (u) => {
                if (u) {
                    const betterU = buildUserStruct(u)
                    setUser(betterU)
                    if (betterU?.faction?.theme) updateTheme(betterU.faction.theme)
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
                    const betterU = buildUserStruct(u)
                    setUser(betterU)
                    if (betterU?.faction?.theme) updateTheme(betterU.faction.theme)
                }
            },
            null,
            true,
        )
    }, [state, subscribe])

    // Temporary
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const buildUserStruct = useCallback((u: any) => {
        return {
            ...u,
            faction_id: u.faction_id !== "00000000-0000-0000-0000-000000000000" ? u.faction_id : null,
            faction: u.faction
                ? {
                      theme: {
                          primary: u.faction.theme.primary,
                          secondary: u.faction.theme.secondary,
                          background: u.faction.theme.background,
                      },
                  }
                : null,
        }
    }, [])

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
    }
})

export const GameServerAuthProvider = AuthContainer.Provider
export const useGameServerAuth = AuthContainer.useContainer
