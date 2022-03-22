import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { PassportServerKeys } from "../keys"
import { UserData } from "../types/passport"
import { usePassportServerWebsocket } from "./passportServerSocket"

/**
 * A Container that handles Authorisation
 */
const AuthContainer = createContainer((initialState?: { setLogin(user: UserData): void }) => {
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
                console.debug(e)
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
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            } catch (e: any) {
                console.debug(e)
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
