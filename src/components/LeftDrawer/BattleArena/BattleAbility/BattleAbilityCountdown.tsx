import { useEffect, useRef } from "react"
import { BribeStageResponse } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { SectionHeading } from "../Common/SectionHeading"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)
    const sentence = useRef("Loading...")

    const phase = bribeStage?.phase || ""

    switch (phase) {
        case "OPT_IN":
            sentence.current = `BATTLE ABILITY (${totalSecRemain})`
            break

        case "LOCATION_SELECT":
            sentence.current = `BATTLE ABILITY INITIATED (${totalSecRemain})`
            break

        case "COOLDOWN":
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
            endTime = new Date(dateNow.getTime() + (bribeStage.phase == "OPT_IN" ? 30000 : 20000))
        }

        setEndTimeState(endTime)
    }, [bribeStage, setEndTimeState])

    return <SectionHeading label={sentence.current} tooltip="Opt into battle abilities and fight for your Faction!" />
}
