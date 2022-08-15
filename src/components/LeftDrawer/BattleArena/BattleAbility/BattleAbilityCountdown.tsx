import { useCallback, useEffect, useState } from "react"
import { BribeStageResponse } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { SectionHeading } from "../Common/SectionHeading"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const [sentence, setSentence] = useState<string>("Loading...")
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)

    const phase = bribeStage?.phase || ""
    const doSentence = useCallback(() => {
        switch (phase) {
            case "OPT_IN":
                setSentence(`BATTLE ABILITY (${totalSecRemain})`)
                break

            case "LOCATION_SELECT":
                setSentence(`BATTLE ABILITY INITIATED (${totalSecRemain})`)
                break

            case "COOLDOWN":
                setSentence(`NEXT BATTLE ABILITY (${totalSecRemain})`)
                break
        }
    }, [phase, totalSecRemain])

    useEffect(() => {
        doSentence()
    }, [doSentence, totalSecRemain])

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
        doSentence()
    }, [bribeStage, doSentence, setEndTimeState])

    return <SectionHeading label={sentence} tooltip="Opt into battle abilities and fight for your Faction!" />
}
