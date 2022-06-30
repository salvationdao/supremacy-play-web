import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { BribeStageResponse } from "../../../containers"
import { useInterval, useTimer } from "../../../hooks"
import { SvgBattleAbilityIcon } from "../../../assets"
import { colors } from "../../../theme/theme"
import { ContributorAmount } from "../../BattleStats/ContributorAmount"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    return (
        <>
            <Stack direction="row" alignItems="center" spacing="1.2rem" sx={{ pr: ".3rem" }}>
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgBattleAbilityIcon size="1.8rem" fill={colors.text} />
                    <Typography sx={{ lineHeight: 1, color: colors.text, fontWeight: "fontWeightBold" }}>
                        <CountdownText bribeStage={bribeStage} />
                    </Typography>
                </Stack>
                <ContributorAmount hideContributionTotal />
            </Stack>
        </>
    )
}

const CountdownText = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const [sentence, setSentence] = useState<string>("Loading...")
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)

    const doSentence = useCallback(() => {
        switch (bribeStage?.phase) {
            case "BRIBE":
                setSentence(`BATTLE ABILITY (${totalSecRemain}s)`)
                break

            case "LOCATION_SELECT":
                setSentence("BATTLE ABILITY INITIATED...")
                break

            case "COOLDOWN":
                setSentence(`NEXT BATTLE ABILITY (${totalSecRemain}s)`)
                break
        }
    }, [bribeStage?.phase, totalSecRemain])

    useEffect(() => {
        if (!bribeStage) return

        let endTime = bribeStage.end_time
        const dateNow = new Date()
        const diff = endTime.getTime() - dateNow.getTime()

        // Just a temp fix, if user's pc time is not correct then at least set for them
        // Checked by seeing if they have at least 8s to do stuff
        if (endTime < dateNow || diff > 40000) {
            endTime = new Date(dateNow.getTime() + (bribeStage.phase == "BRIBE" ? 30000 : 20000))
        }

        setEndTimeState(endTime)
        doSentence()
    }, [bribeStage, doSentence, setEndTimeState])

    useInterval(() => {
        doSentence()
    }, totalSecRemain)

    return <>{sentence}</>
}
