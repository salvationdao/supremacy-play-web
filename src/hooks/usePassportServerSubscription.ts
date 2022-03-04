import { useEffect, useState } from "react"
import { NullUUID } from "../constants"
import { usePassportServerAuth, usePassportServerWebsocket } from "../containers"
import { PassportServerKeys } from "../keys"

/** Subscribe to a hub key
 * @param args optional arguments; if set will send a ":SUBSCRIBE" (and ":UNSUBSCRIBE") message to tell server we're listening
 */
export function usePassportServerSubscription<T>(key: PassportServerKeys, args?: any, listenOnly?: boolean) {
    const { subscribe } = usePassportServerWebsocket()

    const [payload, setPayload] = useState<T>()
    const [_args, setArguments] = useState(args)

    useEffect(() => {
        return subscribe<T>(
            key,
            (payload) => {
                setPayload(payload)
            },
            _args,
            listenOnly,
        )
    }, [key, subscribe, _args, listenOnly])

    return { payload, setArguments }
}

export function usePassportServerSecureSubscription<T>(key: PassportServerKeys, args?: any, listenOnly?: boolean) {
    const { subscribe } = usePassportServerWebsocket()
    const { userID } = usePassportServerAuth()

    const [payload, setPayload] = useState<T>()
    const [_args, setArguments] = useState(args)

    useEffect(() => {
        if (!userID || userID === NullUUID) return
        return subscribe<T>(
            key,
            (payload) => {
                setPayload(payload)
            },
            _args,
            listenOnly,
        )
    }, [key, subscribe, _args, listenOnly, userID])

    return { payload, setArguments }
}
