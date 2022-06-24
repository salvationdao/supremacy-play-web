import { Box } from "@mui/material"
import { useMemo, useState } from "react"
import { useAuth } from "../../../containers"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { Faction } from "../../../types"
import { MechMoveCommand } from "../../PlayerAbilities/MechMoveCommandCard"

export const MechCommandLocations = ({
    gridWidth,
    gridHeight,
    getFaction,
}: {
    gridWidth: number
    gridHeight: number
    getFaction: (factionID: string) => Faction
}) => {
    const { factionID } = useAuth()
    const sizeX = useMemo(() => gridWidth * 1.5, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.5, [gridHeight])

    const [mechMoveCommands, setMechMoveCommands] = useState<MechMoveCommand[]>([])
    const borderColor = useMemo(() => {
        if (!factionID) return "#FFFFFF"
        return getFaction(factionID).primary_color
    }, [factionID, getFaction])

    useGameServerSubscriptionFaction<MechMoveCommand[]>(
        {
            URI: "/mech_commands",
            key: GameServerKeys.SubMechCommands,
        },
        (payload) => {
            setMechMoveCommands(payload || [])
        },
    )

    return (
        <>
            {mechMoveCommands &&
                mechMoveCommands.length > 0 &&
                mechMoveCommands.map((mmc) => {
                    if (mmc.cell_x === undefined || mmc.cell_y === undefined) return <></>
                    return (
                        <Box
                            key={mmc.id}
                            sx={{
                                position: "absolute",
                                height: `${sizeX}px`,
                                width: `${sizeY}px`,
                                cursor: "pointer",
                                border: `2px solid ${borderColor}`,
                                borderRadius: 1,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                transform: `translate(calc(${mmc.cell_x * gridWidth - sizeX / 2}px - 50%), calc(${
                                    mmc.cell_y * gridHeight - sizeY / 2
                                }px - 50%))`,
                                zIndex: 100,
                            }}
                        />
                    )
                })}
        </>
    )
}
