import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { PassportServerKeys } from "../keys"
import { UserData } from "../types/passport"
import { usePassportServerWebsocket } from "./passportServerSocket"

/**
 * A Container that handles Authorisation
 */
const AuthContainer = createContainer(() => {
    const { state, send, subscribe } = usePassportServerWebsocket()
    const [user, setUser] = useState<UserData>()
    const userID = user?.id
    const faction_id = user?.faction_id

    const [gameserverSessionID, setGameserverSessionID] = useState("")
    const [sessionID, setSessionID] = useState("")
    const [sessionIDLoading, setSessionIDLoading] = useState(true)
    const [sessionIDError, setSessionIDError] = useState()

    const [authRingCheckError, setAuthRingCheckError] = useState()
    const [authRingCheckLoading, setAuthRingCheckLoading] = useState(true)
    const [authRingCheckSuccess, setAuthRingCheckSuccess] = useState(false)

    // get user by session id
    useEffect(() => {
        console.log("state is open?", state === WebSocket.OPEN)
        console.log("userID", userID)
        console.log("sessionID", sessionID)
        console.log("sessionID", !!sessionID)
        if (state !== WebSocket.OPEN || !!userID || sessionID) return
        ;(async () => {
            try {
                console.log("triggered")
                setSessionIDLoading(true)
                console.log(state, "STATE")
                const resp = await send<string>(PassportServerKeys.GetSessionID)
                console.log("response", resp)
                setSessionID(resp)
            } catch (e: any) {
                console.log("error:", e)
                setSessionIDError(e)
            } finally {
                setSessionIDLoading(false)
            }
        })()
    }, [send, state, userID, sessionID])

    useEffect(() => {
        if (!subscribe || !sessionID || state !== WebSocket.OPEN) return
        return subscribe<UserData>(
            PassportServerKeys.SubscribeGamebarUser,
            (u) => {
                setUser(u)
            },
            { session_id: sessionID },
        )
    }, [state, sessionID, subscribe])

    // upgrade user if gamebar is embedded in twitch ui
    useEffect(() => {
        if (!gameserverSessionID || state !== WebSocket.OPEN || !userID) return
        ;(async () => {
            try {
                setAuthRingCheckLoading(true)
                await send(PassportServerKeys.AuthRingCheck, { gameserver_session_id: gameserverSessionID })
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
        faction_id,
        gameserverSessionID,
        setGameserverSessionID,
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
