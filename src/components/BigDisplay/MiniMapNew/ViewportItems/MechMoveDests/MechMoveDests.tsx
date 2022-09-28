import { useState } from "react"
import { useArena } from "../../../../../containers"
import { useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { MechMoveDest } from "./MechMoveDest"

export interface FactionMechCommand {
    battle_id: string
    cell_x: number
    cell_y: number
    is_ai: boolean
}

export const MechMoveDests = () => {
    const { currentArenaID } = useArena()
    const [mechMoveCommands, setMechMoveCommands] = useState<FactionMechCommand[]>([])

    useGameServerSubscriptionFaction<FactionMechCommand[]>(
        {
            URI: `/arena/${currentArenaID}/mech_commands`,
            key: GameServerKeys.SubMechCommands,
            ready: !!currentArenaID,
        },
        (payload) => {
            setMechMoveCommands(payload || [])
        },
    )

    return (
        <>
            {mechMoveCommands &&
                mechMoveCommands.length > 0 &&
                mechMoveCommands.map((mmc, index) => {
                    return <MechMoveDest key={`${mmc.battle_id}-${index}`} moveCommand={mmc} />
                })}
        </>
    )
}
