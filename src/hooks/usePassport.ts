import { SubProps, useSubscription } from "../containers/ws"
import { PASSPORT_SERVER_HOST } from "../constants"
import { useCommands } from "../containers/ws/useCommands"
import { DataType } from "../containers/ws/util"
import { useAuth } from "../containers/auth"

// Fetch
export const usePassportCommandsUser = (URI: string) => {
    const { userID } = useAuth()
    return useCommands({ host: PASSPORT_SERVER_HOST, URI: `/user/${userID}${URI}`, ready: !!userID })
}

export const usePassportCommands = (URI: string) => {
    return useCommands({ host: PASSPORT_SERVER_HOST, URI: `${URI}` })
}

// Subscription
export function usePassportSubscriptionUser<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID } = useAuth()
    return useSubscription({ URI: `/user/${userID}${URI}`, key, host: PASSPORT_SERVER_HOST, args, ready: !!userID && ready }, callback)
}

export function usePassportSubscription<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    return useSubscription({ URI: `${URI}`, key, host: PASSPORT_SERVER_HOST, args, ready }, callback)
}
