import { Box } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { BribeStageResponse } from "../../../../containers"
import { BribeStage } from "../../../../types"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const secondsLeftRef = useRef<number>()
    const containerRef = useRef<HTMLDivElement>()

    // useEffect(() => {
    //     if (!bribeStage) return

    //     let endTime = bribeStage.end_time
    //     const dateNow = new Date()
    //     const diff = endTime.getTime() - dateNow.getTime()

    //     // Just a temp fix, if user's pc time is not correct then at least set for them
    //     // Checked by seeing if they have at least 8s to do stuff
    //     if (endTime < dateNow || diff > 40000) {
    //         endTime = new Date(dateNow.getTime() + (bribeStage.phase === BribeStage.OptIn ? 30000 : 20000))
    //     }

    //     setEndTimeState(endTime)
    // }, [bribeStage, setEndTimeState])

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
