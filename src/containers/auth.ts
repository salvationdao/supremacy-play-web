import React, { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import HubKey from "../keys"
import { UpdateTheme, User } from "../types"
import { useWebsocket } from "./socket"

export interface AuthContainerType {
    user: User | undefined
    userID: string | undefined
    factionID: string | undefined
    gameserverSessionID: string
    authSessionIDGetLoading: boolean
    authSessionIDGetError: undefined
}
/**
 * A Container that handles Authorisation
 */
export const AuthContainer = createContainer((): AuthContainerType => {
    const { updateTheme } = React.useContext(UpdateTheme)
    const { state, send, subscribe } = useWebsocket()
    const [user, setUser] = useState<User>()
    const userID = user?.id

    const [gameserverSessionID, setGameserverSessionID] = useState<string>("")

    const [authSessionIDGetLoading, setAuthSessionIDGetLoading] = useState(true)
    const [authSessionIDGetError, setAuthSessionIDGetError] = useState()

    // Will receive user data after server complete the "auth ring check"
    useEffect(() => {
        console.log("here")

        if (!subscribe || state !== WebSocket.OPEN) return

        console.log("here2")

        return subscribe<User>(
            HubKey.UserSubscribe,
            (u) => {
                console.log("here3, user", u)

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
                const resp = await send<string, null>(HubKey.AuthSessionIDGet)
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
        factionID: user?.factionID,
        gameserverSessionID,
        authSessionIDGetLoading,
        authSessionIDGetError,
    }
})

export const AuthProvider = AuthContainer.Provider
export const useAuth = AuthContainer.useContainer
