import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useUrlQuery } from "../hooks"
import { useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { Arena, ArenaStatus } from "../types"
import { blankOptionOven, useOvenStream } from "./oven"

export const ArenaContainer = createContainer(() => {
    const [arenaList, setArenaList] = useState<Arena[]>([])
    const [currentArena, setCurrentArena] = useState<Arena>()
    const { changeOvenStream, setCurrentStreamOptions } = useOvenStream()
    const [, updateQuery] = useUrlQuery()

    const currentArenaID = currentArena?.id || ""

    useEffect(() => {
        if (!currentArena) return
        changeOvenStream(currentArena.oven_stream)
        setCurrentStreamOptions([blankOptionOven, currentArena.oven_stream])
    }, [changeOvenStream, currentArena, setCurrentStreamOptions])

    // Save the arena in url param when its changed
    useEffect(() => {
        updateQuery({
            arenaName: currentArena?.name,
        })
    }, [currentArena?.name, updateQuery])

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
    const [query] = useUrlQuery()

    // Subscribe to the list of available arenas and set the current one
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

            // Sets the one specified in the url, else default to first one
            const arenaInUrl = payload.find((arena) => arena.name === query.get("arenaName"))
            setCurrentArena(arenaInUrl || payload[0])

            setArenaList(payload)
        },
    )

    // Subscribe to the status of the arena
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

    // If arena is closed, set it
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
