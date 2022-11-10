import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgBattleAbilityIcon } from "../../../../assets"
import { TrainingBribeStageResponse } from "../../TrainingBattleAbility"

export const BattleAbilityCountdownBT = ({ bribeStage }: { bribeStage?: TrainingBribeStageResponse }) => {
    return (
        <Stack direction="row" spacing=".6rem" alignItems="center">
            <SvgBattleAbilityIcon size="1.8rem" fill="inherit" />
            <Typography sx={{ lineHeight: 1, color: "inherit", fontWeight: "bold", textTransform: "initial" }}>
                <CountdownText bribeStage={bribeStage} />
            </Typography>
        </Stack>
    )
}

const CountdownText = ({ bribeStage }: { bribeStage?: TrainingBribeStageResponse }) => {
    const [sentence, setSentence] = useState<string>("Loading...")

    const phase = bribeStage?.phase || ""
    const doSentence = useCallback(() => {
        switch (phase) {
            case "OPT_IN":
                setSentence(`BATTLE ABILITY (${bribeStage?.time}s)`)
                break

            case "LOCATION_SELECT":
                setSentence(`BATTLE ABILITY INITIATED (${bribeStage?.time}s)`)
                break

            case "COOLDOWN":
                setSentence(`NEXT BATTLE ABILITY ${bribeStage?.time === 30 ? "" : "(" + bribeStage?.time + "s)"}`)
                break
        }
    }, [phase, bribeStage?.time])

    useEffect(() => {
        doSentence()
    }, [doSentence, bribeStage])

    return <>{sentence}</>
}
