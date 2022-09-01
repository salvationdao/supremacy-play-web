import { Box, keyframes, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { useTraining } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { Map } from "../../../../types"

interface RangeIndicatorProps {
    parentRef: React.RefObject<HTMLDivElement>
    mapScale: number
    map: Map
}

export const EMP_X = 435.4375
export const EMP_Y = 335.3125

export const RangeIndicatorBT = ({ parentRef, mapScale: zoomScale, map }: RangeIndicatorProps) => {
    const { abilityDetails, playerAbility, winner } = useTraining()

    const indicatorRef = useRef<HTMLDivElement>(null)
    const mapScale = useMemo(() => map?.Width / (map?.Cells_X * 2000), [map])
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
                    sx={{
                        zIndex: 1000,
                        position: "absolute",
                        width: diameter,
                        height: diameter,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        border: `3px ${colors.grey}`,
                        borderStyle: "dashed",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        transform: `translate(calc(${EMP_X}px - 50%), calc(${EMP_Y}px - 50%))`,
                        animation: `${growEffect(diameter)} 2s infinite`,
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
    }, [ability, diameter])
}

export const growEffect = (d: number) => keyframes`
    0% {
    width: ${d}px;
    height: ${d};
    font-size:1.4rem;
}
	50% {
    width: ${d * 1.15}px;
    height: ${d * 1.15}px;
    font-size:2rem;
 }
	100% {
    width: ${d}px;
    height: ${d}px;
    font-size:1.4rem;
}
`
