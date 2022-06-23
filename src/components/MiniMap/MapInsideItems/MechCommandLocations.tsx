import { Box } from "@mui/material"
import { Dispatch, SetStateAction, useMemo } from "react"
import { MapSelection } from "../MiniMapInside"
import { BlueprintPlayerAbility, GameAbility } from "../../../types"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { useAuth } from "../../../containers"
import { GameServerKeys } from "../../../keys"

export const MechCommandLocations = ({ gridWidth, gridHeight }: { gridWidth: number; gridHeight: number }) => {
    const sizeX = useMemo(() => gridWidth * 1.5, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.5, [gridHeight])

    useGameServerSubscriptionFaction(
        {
            URI: "/mech_commands",
            key: GameServerKeys.SubMechCommands,
        },
        (payload) => {
            if (!payload) return
            console.log(payload)
        },
    )
    return <Box></Box>
}
