import React, { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { GameServerKeys } from "../keys"
import { UpdateTheme, User } from "../types"
import { useGameServerWebsocket } from "."

export interface AuthContainerType {
    user: User | undefined
    userID: string | undefined
    faction_id: string | undefined
    gameserverSessionID: string
    authSessionIDGetLoading: boolean
    authSessionIDGetError: undefined
}
/**
 * A Container that handles Authorisation
 */
const AuthContainer = createContainer((): AuthContainerType => {
    const { updateTheme } = React.useContext(UpdateTheme)
    const { state, send, subscribe } = useGameServerWebsocket()
    const [user, setUser] = useState<User>()
    const [gameserverSessionID, setGameserverSessionID] = useState<string>("")

    const [authSessionIDGetLoading, setAuthSessionIDGetLoading] = useState(true)
    const [authSessionIDGetError, setAuthSessionIDGetError] = useState()

    // Will receive user data after server complete the "auth ring check"
    useEffect(() => {
        if (!subscribe || state !== WebSocket.OPEN) return
        return subscribe<User>(
            GameServerKeys.UserSubscribe,
            (u) => {
                if (u) setUser(u)
                if (u?.faction?.theme) updateTheme(u.faction.theme)
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
        gameserverSessionID,
        authSessionIDGetLoading,
        authSessionIDGetError,
    }
})

export const GameServerAuthProvider = AuthContainer.Provider
export const useGameServerAuth = AuthContainer.useContainer
