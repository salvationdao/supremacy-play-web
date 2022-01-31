import React, { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import HubKey from '../keys'
import { UpdateTheme, User } from '../types'
import { useWebsocket } from './socket'

interface TokenLoginRequest {
    twitchToken: string
}

/**
 * A Container that handles Authorisation
 */
export const AuthContainer = createContainer(() => {
    const { updateTheme } = React.useContext(UpdateTheme)
    const { state, send, subscribe } = useWebsocket()
    const { token } = useTwitch()
    const [user, setUser] = useState<User>()

    const [authLoading, setAuthJWTLoading] = useState(true)
    const [authJWTDone, setAuthJWTDone] = useState(false)
    const [authError, setAuthJWTError] = useState()

    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM2NzgxNjgsIm9wYXF1ZV91c2VyX2lkIjoiVTc1MDE4NTAyOSIsInJvbGUiOiJicm9hZGNhc3RlciIsInB1YnN1Yl9wZXJtcyI6eyJsaXN0ZW4iOlsiYnJvYWRjYXN0IiwiZ2xvYmFsIl0sInNlbmQiOlsiYnJvYWRjYXN0Il19LCJjaGFubmVsX2lkIjoiNzUwMTg1MDI5IiwidXNlcl9pZCI6Ijc1MDE4NTAyOSIsImlhdCI6MTY0MzU5MTc2OH0.4riP1o1wNZt3hsq3YOBv6ohjs_n79Bnc-KSAzXwCoCk

    useEffect(() => {
        if (state !== WebSocket.OPEN || user || !token) return
        ;(async () => {
            try {
                setAuthJWTLoading(true)
                const resp = await send<boolean, TokenLoginRequest>(HubKey.AuthJWT, { twitchToken: token })
                setAuthJWTDone(resp)
            } catch (e: any) {
                setAuthJWTError(e)
            } finally {
                setAuthJWTLoading(false)
            }
        })()
    }, [token, send, state])

    useEffect(() => {
        if (!user?.faction?.theme) return
        updateTheme(user.faction.theme)
    }, [user])

    // will receive user data after server complete the "auth ring check"
    useEffect(() => {
        if (!subscribe) return
        return subscribe<User>(
            HubKey.UserSubscribe,
            (u) => {
                if (!u) return
                console.log('CHECK USER SUBSCRIBE', u)
                setUser(u)
            },
            null,
            true,
        )
    }, [subscribe])

    return {
        user,
        userID: user?.id,
        factionID: user?.factionID,
        authLoading,
        authError,
        authJWTDone,
    }
})

export const AuthProvider = AuthContainer.Provider
export const useAuth = AuthContainer.useContainer
