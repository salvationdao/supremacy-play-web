import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { PassportServerKeys } from "../keys"
import { UserData } from "../types/passport"
import { usePassportServerWebsocket } from "./passportServerSocket"

interface AuthInitialState {
    gameserverSessionID?: string
}

/**
 * A Container that handles Authorisation
 */
const AuthContainer = createContainer((initialState?: AuthInitialState) => {
    const gameserverSessionID = initialState?.gameserverSessionID

    const { state, send, subscribe } = usePassportServerWebsocket()
    const [user, setUser] = useState<UserData>()
    const userID = user?.id
    const factionID = user?.factionID

    const [sessionID, setSessionID] = useState("")
    const [sessionIDLoading, setSessionIDLoading] = useState(true)
    const [sessionIDError, setSessionIDError] = useState()

    const [authRingCheckError, setAuthRingCheckError] = useState()
    const [authRingCheckLoading, setAuthRingCheckLoading] = useState(true)
    const [authRingCheckSuccess, setAuthRingCheckSuccess] = useState(false)

    // get user by session id
    useEffect(() => {
        if (state !== WebSocket.OPEN || user || sessionID) return
        ;(async () => {
            try {
                setSessionIDLoading(true)
                const resp = await send<string>(PassportServerKeys.GetSessionID)
                setSessionID(resp)
            } catch (e: any) {
                setSessionIDError(e)
            } finally {
                setSessionIDLoading(false)
            }
        })()
    }, [send, state, user, sessionID])

    useEffect(() => {
        if (!subscribe || !sessionID || state !== WebSocket.OPEN) return
        return subscribe<UserData>(
            PassportServerKeys.SubscribeGamebarUser,
            (u) => {
                setUser(u)
            },
            { sessionID: sessionID },
        )
    }, [state, sessionID, subscribe])

    // upgrade user if gamebar is embedded in twitch ui
    useEffect(() => {
        if (!gameserverSessionID || state !== WebSocket.OPEN || !userID) return
        ;(async () => {
            try {
                setAuthRingCheckLoading(true)
                await send(PassportServerKeys.AuthRingCheck, { gameserverSessionID })
                setAuthRingCheckSuccess(true)
            } catch (e: any) {
                console.log(e)
                setAuthRingCheckError(e)
                setAuthRingCheckSuccess(false)
                setUser(undefined)
            } finally {
                setAuthRingCheckLoading(false)
            }
        })()
    }, [userID, send, state, gameserverSessionID])

    // start to subscribe user update
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || !authRingCheckSuccess) return
        return subscribe<UserData>(
            PassportServerKeys.SubscribeUser,
            (u) => {
                setUser(u)
            },
            { id: userID },
        )
    }, [userID, subscribe, state, authRingCheckSuccess])

    return {
        user,
        userID,
        factionID,
        sessionID,
        sessionIDLoading,
        sessionIDError,
        authRingCheckSuccess,
        authRingCheckLoading,
        authRingCheckError,
        setAuthRingCheckError,
    }
})

export const PassportServerAuthProvider = AuthContainer.Provider
export const usePassportServerAuth = AuthContainer.useContainer
