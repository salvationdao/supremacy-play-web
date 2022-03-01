import { useEffect, useState } from "react"
import { useWebsocket } from "../containers/socket"
import HubKey from "../keys"
import { useAuth } from "../containers"
import { NilUUID } from "../constants"

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
	}, [key, subscribe, _args, listenOnly])

	return { payload, setArguments }
}

export function useSecureSubscription<T>(key: HubKey, args?: any, listenOnly?: boolean) {
	const { subscribe } = useWebsocket()
	const { userID } = useAuth()

	const [payload, setPayload] = useState<T>()
	const [_args, setArguments] = useState(args)

	useEffect(() => {
		if (!userID || userID === NilUUID) return
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
