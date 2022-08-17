import { useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"

enum ArenaType {
    Story = "STORY",
    Expedition = "EXPEDITION",
}

interface Arena {
    id: string
    type: ArenaType
}

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
                return
            }

            setArenaList(payload)
            // NOTE: temporary default arena to the first one
            setCurrentArena((prev) => prev || payload[0])
        },
    )

    useGameServerSubscription<boolean>(
        {
            URI: `/public/arena/${currentArenaID}/closed`,
            key: GameServerKeys.SubBattleArenaClosed,
            ready: currentArenaID != "",
        },
        (payload) => {
            if (!payload) return
            setCurrentArena(undefined)
        },
    )
    return null
}
