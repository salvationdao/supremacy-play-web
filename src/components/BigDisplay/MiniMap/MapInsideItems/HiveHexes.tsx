import { Map as GameMap } from "../../../../types"
import { useEffect, useMemo, useState } from "react"
import { HiveHexLocation, HiveHexLocations } from "../../../../types/hive"
import { Box } from "@mui/material"

interface HiveHexesProps {
    map: GameMap
    state: boolean[]
}

const hexSize = 74

export const HiveHexes = ({ map, state }: HiveHexesProps) => {
    const mapScale = useMemo(() => (map ? map.Width / (map.Cells_X * 2000) : 0), [map])

    const [hexLocations, setHexLocations] = useState<HiveHexLocation[]>([])

    useEffect(() => {
        setHexLocations(() =>
            HiveHexLocations.map(({ x, y, yaw }) => ({ x: (x - (map ? map.Pixel_Left : 0)) * mapScale, y: (y - (map ? map.Pixel_Top : 0)) * mapScale, yaw })),
        )
    }, [mapScale])

    return useMemo(() => {
        if (!state || !hexLocations) return null
        return (
            <>
                {[...Array(589)].map((_, i) => {
                    if (hexLocations.length <= i || state.length <= i) return null

                    const { x, y, yaw } = hexLocations[i]
                    const raised = state[i]

                    return (
                        <Box
                            key={`hex-${i}`}
                            sx={{
                                position: "absolute",
                                transform: `translate(${x - hexSize / 2}px, ${y - hexSize / 2}px) rotate(${yaw + 60}deg)`,
                                height: `${hexSize}px`,
                                width: `${hexSize}px`,
                                clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                backgroundColor: "#000000",
                                opacity: raised ? 0.6 : 0,
                                zIndex: 2,
                                pointerEvents: "none",
                                transition: "opacity 0.5s ease-in-out",
                            }}
                        />
                    )
                })}
            </>
        )
    }, [state, hexLocations])
}
