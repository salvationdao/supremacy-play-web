import { GAME_SERVER_HOSTNAME } from "../constants"
import { useAuth } from "../containers/auth"
import { SubProps, useSubscription } from "../containers/ws"
import useCommands from "../containers/ws/useCommands"
import { DataType } from "../containers/ws/util"

// Fetch
export const useGameServerCommandsUser = (URI?: string) => {
    const { userID } = useAuth()
    return useCommands(GAME_SERVER_HOSTNAME, `/user/${userID || "noop"}${URI || "/commander"}`, !!userID)
}

export const useGameServerCommandsFaction = (URI?: string) => {
    const { userID, factionID } = useAuth()
    return useCommands(GAME_SERVER_HOSTNAME, `/faction/${factionID || "noop"}${URI || "/commander"}`, !!userID && !!factionID)
}

export const useGameServerCommandsBattleFaction = (URI?: string) => {
    const { userID, factionID } = useAuth()
    return useCommands(GAME_SERVER_HOSTNAME, `/battle/faction/${factionID || "noop"}${URI || "/commander"}`, !!userID && !!factionID)
}

export const useGameServerCommands = (URI?: string) => {
    return useCommands(GAME_SERVER_HOSTNAME, `${URI || "/public/commander"}`)
}

// Subscription
export function useGameServerSubscriptionUser<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID } = useAuth()
    return useSubscription({ URI: `/user/${userID}${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && ready }, callback)
}

export function useGameServerSubscriptionFaction<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID, factionID } = useAuth()
    return useSubscription({ URI: `/faction/${factionID}${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && !!factionID && ready }, callback)
}

export function useGameServerSubscriptionBattleFaction<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID, factionID } = useAuth()
    return useSubscription(
        { URI: `/battle/faction/${factionID}${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && !!factionID && ready },
        callback,
    )
}

export function useGameServerSubscription<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    return useSubscription({ URI: `${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready }, callback)
}

export function useGameServerSubscriptionSecurePublic<T = DataType>({ URI, key, args, ready = true }: SubProps, callback?: (payload: T) => void) {
    const { userID } = useAuth()
    return useSubscription({ URI: `/secure_public/${URI}`, key, host: GAME_SERVER_HOSTNAME, args, ready: !!userID && ready }, callback)
}
