import { SubProps, useSubscription } from "../containers/ws"
import { GAME_SERVER_HOSTNAME } from "../constants"
import { useCommands } from "../containers/ws/useCommands"
import { DataType } from "../containers/ws/util"
import { useAuth } from "../containers/auth"

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
export function useGameServerSubscriptionUser<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID } = useAuth()
    return useSubscription({ URI: `/user/${userID}${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && ready }, callback)
}

export function useGameServerSubscriptionFaction<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID, factionID } = useAuth()
    return useSubscription({ URI: `/faction/${factionID}${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && !!factionID && ready }, callback)
}

export function useGameServerSubscriptionAbilityFaction<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID, factionID } = useAuth()
    return useSubscription({ URI: `/ability/${factionID}${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && !!factionID && ready }, callback)
}

export function useGameServerSubscription<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    return useSubscription({ URI: `${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready }, callback)
}
