import React, { useEffect, useState } from "react"
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
const AuthContainer = createContainer((): AuthContainerType => {
    const { gameserverSessionID, setGameserverSessionID } = usePassportServerAuth()
    const { updateTheme } = React.useContext(UpdateTheme)
    const { state, send, subscribe } = useGameServerWebsocket()
    const [user, setUser] = useState<User>()

    const [authSessionIDGetLoading, setAuthSessionIDGetLoading] = useState(true)
    const [authSessionIDGetError, setAuthSessionIDGetError] = useState()

    // Will receive user data after server complete the "auth ring check"
    useEffect(() => {
        if (!subscribe || state !== WebSocket.OPEN || !user) return
        return subscribe<User>(
            GameServerKeys.UserSubscribe,
            (u) => {
                if (u) setUser(u)
                if (u?.faction?.theme) updateTheme(u.faction.theme)
            },
            { id: user.id },
        )
    }, [state, subscribe, user])

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
    const buildUserStruct = (u: any) => {
        return {
            ...u,
            faction: {
                theme: {
                    primary: u.faction.primary_color,
                    secondary: u.faction.secondary_color,
                    background: u.faction.background_color,
                },
            },
        }
    }

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
