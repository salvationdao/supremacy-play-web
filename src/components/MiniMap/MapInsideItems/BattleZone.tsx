import { useGame } from "../../../containers"
import React, { useMemo } from "react"
import { Box } from "@mui/material"
import { colors } from "../../../theme/theme"
import { Map } from "../../../types"

interface BattleZoneProps {
    map: Map
}

export const BattleZone = ({ map }: BattleZoneProps) => {
    const { battleZone } = useGame()

    const mapScale = useMemo(() => map.width / (map.cells_x * 2000), [map])
    const locationX = useMemo(
        () => ((battleZone?.location.x || map.left_pixels + map.width / 2) - map.left_pixels) * mapScale,
        [map.left_pixels, map.width, mapScale, battleZone?.location.x],
    )
    const locationY = useMemo(
        () => ((battleZone?.location.y || map.top_pixels + map.height / 2) - map.top_pixels) * mapScale,
        [map.top_pixels, map.height, mapScale, battleZone?.location.y],
    )
    const radius = useMemo(() => (battleZone?.radius || 0) * mapScale, [mapScale, battleZone?.radius])

    const battleZoneCircle = (overlay: boolean = false) => (
        <Box
            sx={{
                zIndex: overlay ? 900 : 1,
                position: "absolute",
                left: 0,
                width: map.width * 2,
                height: map.height * 2,
                transform: `translate(-50%, -50%) translate3d(${locationX}px, ${locationY}px, 0)`,
                background: `radial-gradient(transparent ${radius}px, ${colors.black3}${overlay ? "66" : "DD"} ${radius + 80}px)`,
                pointerEvents: "none",
                //transition: `all ${battleZone?.shrinkTime || 2}s ease-in`,
                transition: `all ${0.5}s ease-in`,
            }}
        />
    )

    return (
        <>
            {battleZoneCircle()}

            {/* Dim mechs outside battle zone */}
            {battleZoneCircle(true)}

            {/* Target Circle */}
            <Box
                sx={{
                    zIndex: 1,
                    position: "absolute",
                    width: radius * 2,
                    height: radius * 2,
                    transform: `translate(-50%, -50%) translate3d(${locationX}px, ${locationY}px, 0)`,
                    borderRadius: "50%",
                    borderColor: `${colors.red}77`,
                    borderStyle: "solid",
                    borderWidth: "10px",
                    pointerEvents: "none",
                }}
            />
        </>
    )
}
