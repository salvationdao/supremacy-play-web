import { useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { Arena, ArenaStatus } from "../types"

export const ArenaContainer = createContainer(() => {
    const [arenaList, setArenaList] = useState<Arena[]>([])
    const [currentArena, setCurrentArena] = useState<Arena>()

    const currentArenaID = currentArena?.id || ""

    return {
        arenaList,
        setArenaList,
        currentArena,
        setCurrentArena,
        currentArenaID,
    }
})

export const ArenaProvider = ArenaContainer.Provider
export const useArena = ArenaContainer.useContainer

export const ArenaListener = () => {
    const { setArenaList, currentArenaID, setCurrentArena } = useArena()

    useGameServerSubscription<Arena[]>(
        {
            URI: "/public/arena_list",
            key: GameServerKeys.SubBattleArenaList,
        },
        (payload) => {
            if (!payload || payload.length === 0) {
                setArenaList([])
                setCurrentArena(undefined)
                return
            }

            // default arena to the first one
            setCurrentArena(payload[0])
            // above code will be refactor when players are able to select arena

            setArenaList(payload)
        },
    )

    useGameServerSubscription<ArenaStatus>(
        {
            URI: `/public/arena/${currentArenaID}/status`,
            key: GameServerKeys.SubArenaStatus,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return
            setCurrentArena((prev) => {
                if (!prev) return

                return {
                    ...prev,
                    status: payload,
                }
            })
        },
    )

    useGameServerSubscription<boolean>(
        {
            URI: `/public/arena/${currentArenaID}/closed`,
            key: GameServerKeys.SubBattleArenaClosed,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return
            setCurrentArena(undefined)
        },
    )
    return null
}
