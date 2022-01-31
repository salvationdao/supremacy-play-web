import { useEffect, useState } from 'react'
import { useWebsocket } from '../containers/socket'
import HubKey from '../keys'

/** Subscribe to a hub key
 * @param args optional arguments; if set will send a ":SUBSCRIBE" (and ":UNSUBSCRIBE") message to tell server we're listening
 */
export function useSubscription<T>(key: HubKey, args?: any, listenOnly?: boolean) {
    const { subscribe } = useWebsocket()

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
    }, [key, subscribe, _args])

    return { payload, setArguments }
}
