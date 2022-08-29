import { Box } from "@mui/material"
import { useMemo } from "react"
import { useGame } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { BattleZoneStruct, Map } from "../../../../types"

const borderThickness = 3000

export const BattleZone = ({ map }: { map: Map }) => {
    const { battleZone } = useGame()

    const mapScale = useMemo(() => map.Width / (map.Cells_X * 2000), [map])

    const locationX = useMemo(
        () => ((battleZone?.location.x || map.Pixel_Left + map.Width / 2) - map.Pixel_Left) * mapScale,
        [map.Pixel_Left, map.Width, mapScale, battleZone?.location.x],
    )
    const locationY = useMemo(
        () => ((battleZone?.location.y || map.Pixel_Top + map.Height / 2) - map.Pixel_Top) * mapScale,
        [map.Pixel_Top, map.Height, mapScale, battleZone?.location.y],
    )
    const radius = useMemo(() => (battleZone?.radius || 0) * mapScale, [mapScale, battleZone?.radius])

    if (!battleZone || battleZone.radius === 0) return null

    return (
        <>
            <BattleZoneCircle battleZone={battleZone} radius={radius} locationX={locationX} locationY={locationY} />

            {/* Dim mechs outside battle zone */}
            <BattleZoneCircle overlay battleZone={battleZone} radius={radius} locationX={locationX} locationY={locationY} />

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
                    borderWidth: "20px",
                    pointerEvents: "none",
                    transition: `all 0.5s ease-in-out`,
                }}
            />
        </>
    )
}

const BattleZoneCircle = ({
    battleZone,
    overlay,
    radius,
    locationX,
    locationY,
}: {
    battleZone: BattleZoneStruct
    overlay?: boolean
    radius: number
    locationX: number
    locationY: number
}) => {
    const adjustedRadius = (radius + borderThickness) * 2

    return (
        <Box
            sx={{
                zIndex: overlay ? 900 : 1,
                position: "absolute",
                left: 0,
                width: adjustedRadius,
                height: adjustedRadius,
                transform: `translate(-50%, -50%) translate3d(${locationX}px, ${locationY}px, 0)`,
                borderRadius: "50%",
                border: `${borderThickness}px solid #0F0202${overlay ? "66" : "BB"}`,
                pointerEvents: "none",
                transition: `all ${battleZone?.shrink_time || 0.5}s ease-in-out`,
                transitionDelay: `${battleZone?.warn_time || 0}s`,
            }}
        />
    )
}
