import { useGame } from "../../../containers"
import React, { useEffect, useMemo, useState } from "react"
import { Box } from "@mui/material"
import { colors } from "../../../theme/theme"
import { Map } from "../../../types"

interface BattleZoneProps {
    map: Map
}

const borderThickness = 3000

export const BattleZone = ({ map }: BattleZoneProps) => {
    const { battleZone } = useGame()

    // Update battle zone after warn time
    const [currentBattleZone, setCurrentBattleZone] = useState(battleZone)
    useEffect(() => {
        const t = setTimeout(
            () => {
                setCurrentBattleZone(battleZone)
            },
            battleZone ? battleZone.warnTime * 1000 : 10000,
        )
        return () => clearTimeout(t)
    }, [battleZone])

    const mapScale = useMemo(() => map.width / (map.cells_x * 2000), [map])

    const locationX = useMemo(
        () => ((currentBattleZone?.location.x || map.left_pixels + map.width / 2) - map.left_pixels) * mapScale,
        [map.left_pixels, map.width, mapScale, currentBattleZone?.location.x],
    )
    const locationY = useMemo(
        () => ((currentBattleZone?.location.y || map.top_pixels + map.height / 2) - map.top_pixels) * mapScale,
        [map.top_pixels, map.height, mapScale, currentBattleZone?.location.y],
    )
    const radius = useMemo(() => (currentBattleZone?.radius || 0) * mapScale, [mapScale, currentBattleZone?.radius])
    const adjustedRadius = (radius + borderThickness) * 2

    const targetLocationX = useMemo(
        () => ((battleZone?.location.x || map.left_pixels + map.width / 2) - map.left_pixels) * mapScale,
        [map.left_pixels, map.width, mapScale, battleZone?.location.x],
    )
    const targetLocationY = useMemo(
        () => ((battleZone?.location.y || map.top_pixels + map.height / 2) - map.top_pixels) * mapScale,
        [map.top_pixels, map.height, mapScale, battleZone?.location.y],
    )
    const targetRadius = useMemo(() => (battleZone?.radius || 0) * mapScale, [mapScale, battleZone?.radius])

    const battleZoneCircle = (overlay: boolean = false) => (
        <Box
            sx={{
                zIndex: overlay ? 900 : 1,
                position: "absolute",
                left: 0,
                width: adjustedRadius,
                height: adjustedRadius,
                transform: `translate(-50%, -50%) translate3d(${locationX}px, ${locationY}px, 0)`,
                pointerEvents: "none",
                transition: `all ${currentBattleZone?.shrinkTime || 0.5}s ease-in-out`,
                borderRadius: "50%",
                border: `${borderThickness}px solid #0F0202${overlay ? "66" : "BB"}`,
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
                    width: targetRadius * 2,
                    height: targetRadius * 2,
                    transform: `translate(-50%, -50%) translate3d(${targetLocationX}px, ${targetLocationY}px, 0)`,
                    borderRadius: "50%",
                    borderColor: `${colors.red}77`,
                    borderStyle: "solid",
                    borderWidth: "20px",
                    pointerEvents: "none",
                    transition: `all 0.5s ease-in-out`,
                }}
            />
        </>
    )
}
