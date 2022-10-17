import { useState } from "react"
import { useArena } from "../../../../../containers"
import { useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { Position } from "../../../../../types"
import { Blackout } from "./Blackout"

export interface BlackoutEvent {
    id: string
    game_ability_id: number
    duration: number
    radius: number
    coords: Position
}

export const Blackouts = () => {
    const { currentArenaID } = useArena()
    const [blackoutEvents, setBlackoutEvents] = useState<BlackoutEvent[]>([])

    useGameServerSubscription<BlackoutEvent[]>(
        {
            URI: `/mini_map/arena/${currentArenaID}/public/minimap`,
            key: GameServerKeys.MinimapUpdatesSubscribe,
        },
        (payload) => {
            if (!payload) {
                setBlackoutEvents([])
                return
            }
            setBlackoutEvents(payload)
        },
    )

    return (
        <>
            {blackoutEvents.map((blackout) => {
                return <Blackout key={blackout.id} blackout={blackout} />
            })}
        </>
    )
}
