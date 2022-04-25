import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useSnackbar } from "."
import { PassportServerKeys } from "../keys"
import { UserData } from "../types/passport"
import { usePassportServerWebsocket } from "./passportServerSocket"

interface SubscribeGamebar {
    user: UserData
    jwt_token: string
}

/**
 * A Container that handles Authorisation
 */
const AuthContainer = createContainer((initialState?: { setLogin(user: UserData): void }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, send, subscribe } = usePassportServerWebsocket()
    const [user, setUser] = useState<UserData>()

    const [hasToken, setHasToken] = useState(false)
    const [sessionID, setSessionID] = useState("")
    const [sessionIDLoading, setSessionIDLoading] = useState(true)
    const [sessionIDError, setSessionIDError] = useState()

    const [authRingCheckError, setAuthRingCheckError] = useState()

    const userID = user?.id
    const factionID = user?.faction ? user.faction.id : undefined

    useEffect(() => {
        if (user && initialState && initialState.setLogin) initialState.setLogin(user)
    }, [user])

    // get user by session id
    useEffect(() => {
        if (state !== WebSocket.OPEN || !!userID || sessionID) return
        ;(async () => {
            try {
                setSessionIDLoading(true)
                const resp = await send<string>(PassportServerKeys.GetSessionID)
                setSessionID(resp)
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            } catch (e: any) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get session ID from passport server.", "error")
                console.debug(e)
                setSessionIDError(e)
            } finally {
                setSessionIDLoading(false)
            }
        })()
    }, [send, state, userID, sessionID])

    useEffect(() => {
        if (!subscribe || !sessionID || state !== WebSocket.OPEN) return
        return subscribe<SubscribeGamebar>(
            PassportServerKeys.SubscribeGamebarUser,
            (u) => {
                setUser(u.user)
                localStorage.setItem("ring_check_token", u.jwt_token)
                setHasToken(true)
            },
            { session_id: sessionID },
        )
    }, [state, sessionID, subscribe])

    // start to subscribe user update
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<UserData>(
            PassportServerKeys.SubscribeUser,
            (u) => {
                setUser(u)
            },
            { id: userID },
        )
    }, [userID, subscribe, state])

    return {
        user,
        userID,
        factionID,
        hasToken,
        sessionID,
        sessionIDLoading,
        sessionIDError,
        authRingCheckError,
        setAuthRingCheckError,
    }
})

export const PassportServerAuthProvider = AuthContainer.Provider
export const usePassportServerAuth = AuthContainer.useContainer
