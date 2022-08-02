import { Box } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { useGame, useMiniMap } from "../../../containers"
import { Map } from "../../../types"

interface RangeIndicatorProps {
    parentRef: React.RefObject<HTMLDivElement>
    mapScale: number
    map: Map
}

export const RangeIndicator = ({ parentRef, map, mapScale: trueMapScale }: RangeIndicatorProps) => {
    const { abilityDetails } = useGame()
    const { playerAbility, winner } = useMiniMap()

    const indicatorRef = useRef<HTMLDivElement>(null)

    const mapScale = useMemo(() => map.width / (map.cells_x * 2000), [map])
    const ability = useMemo(() => winner?.game_ability || playerAbility?.ability, [winner, playerAbility])
    const abilityDetail = typeof ability?.game_client_ability_id !== "undefined" ? abilityDetails[ability.game_client_ability_id] : undefined

    const diameter = useMemo(() => (abilityDetail ? abilityDetail.radius * mapScale * trueMapScale * 2 : undefined), [abilityDetail, mapScale, trueMapScale])

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
