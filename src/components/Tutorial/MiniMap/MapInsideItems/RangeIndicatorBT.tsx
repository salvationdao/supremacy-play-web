import { Box, keyframes, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { useTraining } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { Map, GAME_CLIENT_TILE_SIZE } from "../../../../types"

interface RangeIndicatorProps {
    parentRef: React.RefObject<HTMLDivElement>
    gestureRef: React.RefObject<HTMLDivElement>
    empRef: React.RefObject<HTMLDivElement>
    mapScale: number
    map: Map
}

export const RangeIndicatorBT = ({ parentRef, mapScale: zoomScale, map, gestureRef, empRef }: RangeIndicatorProps) => {
    const { abilityDetails, playerAbility, winner, empCoords } = useTraining()
    const indicatorRef = useRef<HTMLDivElement>(null)
    const mapScale = useMemo(() => map?.Width / (map?.Cells_X * GAME_CLIENT_TILE_SIZE), [map])
    const ability = useMemo(() => winner?.game_ability || playerAbility?.ability, [winner, playerAbility])
    const abilityDetail = typeof ability?.game_client_ability_id !== "undefined" ? abilityDetails[ability.game_client_ability_id] : undefined
    const diameter = useMemo(() => (abilityDetail ? abilityDetail.radius * mapScale * zoomScale * 2 : undefined), [abilityDetail, mapScale, zoomScale])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!diameter || !indicatorRef.current) return

            const el = e.currentTarget as HTMLDivElement
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            indicatorRef.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`
        },
        [diameter],
    )

    useEffect(() => {
        if (!gestureRef.current || !empRef.current) return
        gestureRef.current.appendChild(empRef.current)
    }, [empRef, gestureRef])

    useEffect(() => {
        const gestureDiv = parentRef.current
        if (!gestureDiv) return

        gestureDiv.addEventListener("mousemove", handleMouseMove, false)
        return () => gestureDiv.removeEventListener("mousemove", handleMouseMove, false)
    }, [handleMouseMove, parentRef])
    return useMemo(() => {
        if (!diameter || !ability) return null

        return (
            <>
                <Box
                    ref={indicatorRef}
                    sx={{
                        zIndex: 1000,
                        position: "absolute",
                        width: diameter,
                        height: diameter,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        border: `3px ${ability?.colour}`,
                        borderStyle: "dashed solid",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                />
                <Box
                    ref={empRef}
                    sx={{
                        zIndex: 1000,
                        position: "absolute",
                        width: diameter * 2,
                        height: diameter * 2,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        border: `3px ${colors.grey}`,
                        borderStyle: "dashed",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        transform: `translate(-50%, -50%) translate3d(${empCoords?.x}px, ${empCoords?.y}px, 0)`,
                        animation: `${growEffect(diameter * 2)} 2s infinite`,
                    }}
                >
                    <Typography
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 9999,
                            whiteSpace: "nowrap",
                            fontSize: "inherit",
                        }}
                    >
                        Click here
                    </Typography>
                </Box>
            </>
        )
    }, [ability, diameter, empCoords?.x, empCoords?.y, empRef])
}

export const growEffect = (d: number) => keyframes`
    0% {
    width: ${d}px;
    height: ${d};
    font-size:30px;
}
	50% {
    width: ${d * 1.15}px;
    height: ${d * 1.15}px;
    font-size:45px;
 }
	100% {
    width: ${d}px;
    height: ${d}px;
    font-size:30px;
}
`
