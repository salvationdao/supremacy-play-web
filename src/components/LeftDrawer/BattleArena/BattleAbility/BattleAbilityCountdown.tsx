import { Box } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { BribeStageResponse } from "../../../../containers"
import { BribeStage } from "../../../../types"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const secondsLeftRef = useRef<number>()
    const containerRef = useRef<HTMLDivElement>()

    const updateSecondsLeft = useCallback(
        (value: number) => {
            if (!secondsLeftRef.current == null) return
            secondsLeftRef.current = value
            if (!containerRef.current) return
            containerRef.current.innerText = getPhaseText(bribeStage?.phase, secondsLeftRef.current)
        },
        [bribeStage],
    )

    useEffect(() => {
        if (!bribeStage) return
        const diff = Math.round((bribeStage.end_time.getTime() - new Date().getTime()) / 1000)

        if (diff < 0 || diff > 40) {
            updateSecondsLeft(20)
        } else {
            updateSecondsLeft(diff)
        }
    }, [bribeStage, updateSecondsLeft])

    useEffect(() => {
        const t = setInterval(() => {
            if (!secondsLeftRef.current) return
            updateSecondsLeft(secondsLeftRef.current - 1)
        }, 1000)

        return () => clearInterval(t)
    }, [updateSecondsLeft])

    return (
        <Box ref={containerRef} component="span">
            {getPhaseText(bribeStage?.phase, secondsLeftRef.current)}
        </Box>
    )
}

const getPhaseText = (phase?: BribeStage, secondsLeft?: number) => {
    if (!phase || secondsLeft == null) return "Loading..."

    switch (phase) {
        case BribeStage.OptIn:
            return `BATTLE ABILITY (${secondsLeft})`
        case BribeStage.LocationSelect:
            return `BATTLE ABILITY INITIATED (${secondsLeft})`
        case BribeStage.Cooldown:
            return `NEXT BATTLE ABILITY (${secondsLeft})`
    }

    return "Loading..."
}
