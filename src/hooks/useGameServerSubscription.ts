import { useEffect, useState } from "react"
import { useGameServerWebsocket } from "../containers"
import { GameServerKeys } from "../keys"

/** Subscribe to a hub key
 * @param args optional arguments; if set will send a ":SUBSCRIBE" (and ":UNSUBSCRIBE") message to tell server we're listening
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function useGameServerSubscription<T>(key: GameServerKeys, args?: any, listenOnly?: boolean) {
    const { subscribe } = useGameServerWebsocket()

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
