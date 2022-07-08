import { useMemo, useState } from "react"
import { SvgDrag } from "../../../../assets"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { MapIcon } from "./MapIcon"

interface FactionMechCommand {
    battle_id: string
    cell_x: number
    cell_y: number
    is_ai: boolean
}

export const MechCommandIcons = () => {
    const [mechMoveCommands, setMechMoveCommands] = useState<FactionMechCommand[]>([])

    useGameServerSubscriptionFaction<FactionMechCommand[]>(
        {
            URI: "/mech_commands",
            key: GameServerKeys.SubMechCommands,
        },
        (payload) => {
            setMechMoveCommands(payload || [])
        },
    )

    return useMemo(() => {
        return (
            <>
                {mechMoveCommands &&
                    mechMoveCommands.length > 0 &&
                    mechMoveCommands.map((mmc, index) => {
                        if (mmc.cell_x === undefined || mmc.cell_y === undefined) return null
                        return (
                            <MapIcon
                                key={`${mmc.battle_id}-${index}`}
                                primaryColor={colors.gold}
                                position={{ x: mmc.cell_x, y: mmc.cell_y }}
                                icon={<SvgDrag size="4.5rem" sx={{ pb: 0 }} fill={colors.gold} />}
                            />
                        )
                    })}
            </>
        )
    }, [mechMoveCommands])
}
