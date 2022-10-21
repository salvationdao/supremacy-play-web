import { useState } from "react"
import { useArena, useAuth } from "../../../../../containers"
import { useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { MechMoveDest } from "./MechMoveDest"
import { GameServerKeys } from "../../../../../keys"

export interface FactionMechCommand {
    id: string
    battle_id: string
    cell_x: string
    cell_y: string
    is_ai: boolean
    is_ended: boolean
}

export const MechMoveDests = () => {
    const { userID, factionID } = useAuth()
    const { currentArenaID } = useArena()
    const [mechMoveCommands, setMechMoveCommands] = useState<FactionMechCommand[]>([])

    useGameServerSubscription<FactionMechCommand[]>(
        {
            URI: `/mini_map/arena/${currentArenaID}/faction/${factionID}/mech_commands`,
            key: GameServerKeys.SubFactionMechCommandUpdateSubscribe,
            ready: !!userID && !!factionID && !!currentArenaID,
        },
        (payload) => {
            console.log(payload)
            setMechMoveCommands((prev) => {
                if (!prev.length) {
                    return payload.filter((p) => !p.is_ended)
                }

                const list = [...prev].map((l) => payload.find((p) => p.id === l.id) || l)

                payload.forEach((p) => {
                    if (list.some((l) => l.id === p.id)) return
                    list.push(p)
                })

                return list.filter((l) => !l.is_ended)
            })
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
