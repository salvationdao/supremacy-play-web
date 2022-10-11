import { SubProps, useSubscription } from "../containers/ws"
import { PASSPORT_SERVER_HOST } from "../constants"
import { DataType } from "../containers/ws/util"
import { useAuth } from "../containers"

// ******************
// ** Subscription **
// ******************
export function usePassportSubscriptionAccount<T = DataType>({ URI, key, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { user } = useAuth()
    return useSubscription({ URI: `/account/${user.account_id}${URI}`, key, host: PASSPORT_SERVER_HOST, ready: !!user.account_id && ready }, callback)
}
