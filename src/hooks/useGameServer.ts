import { GAME_SERVER_HOSTNAME } from "../constants"
import { useAuth } from "../containers/auth"
import { SubProps, useSubscription } from "../containers/ws"
import { useCommands } from "../containers/ws/useCommands"
import { DataType } from "../containers/ws/util"

// ***********
// ** Fetch **
// ***********
export const useGameServerCommandsUser = (URI: string) => {
    const { userID } = useAuth()
    return useCommands({ host: GAME_SERVER_HOSTNAME, URI: `/user/${userID}${URI}`, ready: !!userID })
}

export const useGameServerCommandsFaction = (URI: string) => {
    const { userID, factionID } = useAuth()
    return useCommands({ host: GAME_SERVER_HOSTNAME, URI: `/faction/${factionID}${URI}`, ready: !!userID && !!factionID })
}

export const useGameServerCommands = (URI: string) => {
    return useCommands({ host: GAME_SERVER_HOSTNAME, URI: `${URI}` })
}

// ******************
// ** Subscription **
// ******************

export function useGameServerSubscriptionSecuredUser<T = DataType>(
    { URI, key, ready = true, binaryKey, binaryParser }: SubProps,
    callback?: (payload: T) => void,
) {
    const { userID } = useAuth()
    return useSubscription(
        { URI: `/secure/user/${userID}${URI}`, key, host: GAME_SERVER_HOSTNAME, ready: !!userID && ready, binaryKey, binaryParser },
        callback,
    )
}

export function useGameServerSubscriptionSecured<T = DataType>({ URI, key, ready = true, binaryKey, binaryParser }: SubProps, callback?: (payload: T) => void) {
    const { userID } = useAuth()
    return useSubscription({ URI: `/secure${URI}`, key, host: GAME_SERVER_HOSTNAME, ready: !!userID && ready, binaryKey, binaryParser }, callback)
}

export function useGameServerSubscriptionFaction<T = DataType>({ URI, key, ready = true, binaryKey, binaryParser }: SubProps, callback?: (payload: T) => void) {
    const { userID, factionID } = useAuth()
    return useSubscription(
        { URI: `/faction/${factionID}${URI}`, key, host: GAME_SERVER_HOSTNAME, ready: !!userID && !!factionID && ready, binaryKey, binaryParser },
        callback,
    )
}

export function useGameServerSubscription<T = DataType>({ URI, key, ready = true, binaryKey, binaryParser }: SubProps, callback?: (payload: T) => void) {
    return useSubscription({ URI: `${URI}`, key, host: GAME_SERVER_HOSTNAME, ready, binaryKey, binaryParser }, callback)
}

export enum BinaryDataKey {
    WarMachineStats = 1,
    MiniMapEvents = 2,
}
