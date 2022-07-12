import { Box } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { useGame, useMiniMap } from "../../../containers"

interface RangeIndicatorProps {
    parentRef: React.RefObject<HTMLDivElement>
    mapScale: number
}

export const RangeIndicator = ({ parentRef, mapScale }: RangeIndicatorProps) => {
    const { abilityDetails } = useGame()
    const { gridHeight, playerAbility, winner } = useMiniMap()

    const indicatorRef = useRef<HTMLDivElement>(null)

    const ability = useMemo(() => winner?.game_ability || playerAbility?.ability, [winner, playerAbility])
    const abilityDetail = abilityDetails[ability?.game_client_ability_id || -1]
    const diameter = useMemo(() => (abilityDetail ? ((mapScale * abilityDetail.radius) / gridHeight) * 2.5 : undefined), [abilityDetail, gridHeight, mapScale])

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
        )
    }, [ability, diameter])
}
