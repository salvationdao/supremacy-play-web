import { Stack, Typography } from "@mui/material"
import { useEffect, useRef } from "react"
import { SvgBattleAbilityIcon } from "../../../assets"
import { BribeStageResponse } from "../../../containers"
import { useTimer } from "../../../hooks"
import { colors } from "../../../theme/theme"

export const BattleAbilityCountdown = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    return (
        <Stack direction="row" spacing=".6rem" alignItems="center">
            <SvgBattleAbilityIcon size="1.8rem" fill={colors.text} />
            <Typography sx={{ lineHeight: 1, color: colors.text, fontWeight: "fontWeightBold", textTransform: "initial" }}>
                <CountdownText bribeStage={bribeStage} />
            </Typography>
        </Stack>
    )
}

const CountdownText = ({ bribeStage }: { bribeStage?: BribeStageResponse }) => {
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)
    const sentence = useRef("Loading...")

    const phase = bribeStage?.phase || ""

    switch (phase) {
        case "OPT_IN":
            sentence.current = `BATTLE ABILITY (${totalSecRemain}s)`
            break

        case "LOCATION_SELECT":
            sentence.current = `BATTLE ABILITY INITIATED (${totalSecRemain}s)`
            break

        case "COOLDOWN":
            sentence.current = `NEXT BATTLE ABILITY (${totalSecRemain}s)`
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

    return <>{sentence.current}</>
}
