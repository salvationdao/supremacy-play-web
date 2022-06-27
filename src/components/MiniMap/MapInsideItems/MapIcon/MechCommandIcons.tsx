import { useMemo, useState } from "react"
import { SvgDrag } from "../../../../assets"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { MechMoveCommand } from "../../../PlayerAbilities/MechMoveCommandCard"
import { MapIcon } from "./MapIcon"

export const MechCommandIcons = () => {
    const [mechMoveCommands, setMechMoveCommands] = useState<MechMoveCommand[]>([])

    useGameServerSubscriptionFaction<MechMoveCommand[]>(
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
                    mechMoveCommands.map((mmc) => {
                        if (mmc.cell_x === undefined || mmc.cell_y === undefined || mmc.reached_at || mmc.cancelled_at) return null
                        return (
                            <MapIcon
                                key={mmc.id}
                                primaryColor={colors.gold}
                                position={{ x: mmc.cell_x, y: mmc.cell_y }}
                                icon={<SvgDrag size="4.5rem" sx={{ pb: 0 }} />}
                            />
                        )
                    })}
            </>
        )
    }, [mechMoveCommands])
}
