import React, { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { GameServerKeys } from "../keys"
import { UpdateTheme, User } from "../types"
import { useGameServerWebsocket, usePassportServerAuth } from "."

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

    // Will receive user data after server complete the "auth ring check"
    useEffect(() => {
        if (!subscribe || state !== WebSocket.OPEN || !userID) return
        return subscribe<User>(
            GameServerKeys.UserSubscribe,
            (u) => {
                if (u) setUser(u)
                if (u?.faction?.theme) updateTheme(u.faction.theme)
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
    const buildUserStruct = useCallback((u: any) => {
        return {
            ...u,
            faction_id: u.faction_id !== "00000000-0000-0000-0000-000000000000" ? u.faction_id : null,
            faction: u.faction
                ? {
                      theme: {
                          primary: u.faction.primary_color,
                          secondary: u.faction.secondary_color,
                          background: u.faction.background_color,
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
                const resp = await send<string, null>(GameServerKeys.AuthSessionIDGet)
                setGameserverSessionID(resp)
            } catch (e: any) {
                setAuthSessionIDGetError(e)
            } finally {
                setAuthSessionIDGetLoading(false)
            }
        })()
    }, [gameserverSessionID, send, state, user])

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
