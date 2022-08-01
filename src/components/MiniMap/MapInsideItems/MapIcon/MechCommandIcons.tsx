import { useMemo, useState } from "react"
import { SvgDrag } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MapIcon } from "./MapIcon"

interface FactionMechCommand {
    battle_id: string
    cell_x: number
    cell_y: number
    is_ai: boolean
}

export const MechCommandIcons = () => {
    const theme = useTheme()
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
                        return (
                            <MapIcon
                                key={`${mmc.battle_id}-${index}`}
                                primaryColor={theme.factionTheme.primary}
                                position={{ x: mmc.cell_x, y: mmc.cell_y }}
                                sx={{ zIndex: 9, borderRadius: "50%" }}
                                sizeGrid={1.2}
                                icon={<SvgDrag size="3rem" sx={{ pb: 0 }} fill={theme.factionTheme.primary} />}
                            />
                        )
                    })}
            </>
        )
    }, [mechMoveCommands, theme.factionTheme.primary])
}
