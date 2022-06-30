import { Box } from "@mui/material"
import { useMemo, useState } from "react"
import { useMiniMap } from "../../../containers"

import { useTimer } from "../../../hooks"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { CellCoords } from "../../../types"

interface MinimapEvent {
    id: string
    game_ability_id: number
    duration: number
    radius: number
    coords: CellCoords
}

export const Blackouts = () => {
    const [blackouts, setBlackouts] = useState<MinimapEvent[]>([])

    useGameServerSubscription<MinimapEvent[]>(
        {
            URI: "/public/minimap",
            key: GameServerKeys.MinimapUpdatesSubscribe,
        },
        (payload) => {
            if (!payload) return
            console.log(payload)
            setBlackouts(payload)
        },
    )

    return useMemo(() => {
        return (
            <>
                {blackouts &&
                    blackouts.length > 0 &&
                    blackouts.map((b) => {
                        return <Blackout key={b.id} {...b} />
                    })}
            </>
        )
    }, [blackouts])
}

const Blackout = ({ duration, radius, coords }: MinimapEvent) => {
    const { totalSecRemain } = useTimer(new Date(new Date().getTime() + duration * 1000), 1000, true)
    const { gridHeight, gridWidth } = useMiniMap()

    const diameter = useMemo(() => (radius / gridHeight) * 2.1, [gridHeight, radius])

    if (totalSecRemain <= 0) return null

    return (
        <Box
            sx={{
                zIndex: 900,
                position: "absolute",
                width: diameter,
                height: diameter,
                transform: `translate(${coords.x * gridWidth - diameter / 2}px, ${coords.y * gridHeight - diameter / 2}px)`,
                borderRadius: "50%",
                backgroundColor: `${colors.black2}DD`,
            }}
        />
    )
}
