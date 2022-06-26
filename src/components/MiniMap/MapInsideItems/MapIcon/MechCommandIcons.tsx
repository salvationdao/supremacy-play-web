import { useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechMoveCommand } from "../../../PlayerAbilities/MechMoveCommandCard"
import { MapIcon } from "./MapIcon"

export const MechCommandIcons = () => {
    const theme = useTheme()
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
                        if (mmc.cell_x === undefined || mmc.cell_y === undefined) return null
                        return <MapIcon key={mmc.id} primaryColor={theme.factionTheme.primary} position={{ x: mmc.cell_x, y: mmc.cell_y }} />
                    })}
            </>
        )
    }, [mechMoveCommands, theme.factionTheme.primary])
}
