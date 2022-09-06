import { useEffect, useRef } from "react"
import { BribeStageResponse } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { BribeStage } from "../../../../types"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)
    const sentence = useRef("Loading...")

    const phase = bribeStage?.phase || ""

    switch (phase) {
        case BribeStage.OptIn:
            sentence.current = `BATTLE ABILITY (${totalSecRemain})`
            break

        case BribeStage.LocationSelect:
            sentence.current = `BATTLE ABILITY INITIATED (${totalSecRemain})`
            break

        case BribeStage.Cooldown:
            sentence.current = `NEXT BATTLE ABILITY (${totalSecRemain})`
            break
    }

    useEffect(() => {
        if (!bribeStage) return

        let endTime = bribeStage.end_time
        const dateNow = new Date()
        const diff = endTime.getTime() - dateNow.getTime()

        // Just a temp fix, if user's pc time is not correct then at least set for them
        // Checked by seeing if they have at least 8s to do stuff
        if (endTime < dateNow || diff > 40000) {
            endTime = new Date(dateNow.getTime() + (bribeStage.phase === BribeStage.OptIn ? 30000 : 20000))
        }

        setEndTimeState(endTime)
    }, [bribeStage, setEndTimeState])

    return <>{sentence.current}</>
}
