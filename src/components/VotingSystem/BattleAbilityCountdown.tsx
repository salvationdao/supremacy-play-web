import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { useGame, BribeStageResponse } from "../../containers"
import { useInterval, useTimer } from "../../hooks"
import { SvgBattleAbilityIcon } from "../../assets"
import { colors } from "../../theme/theme"

export const BattleAbilityCountdown = () => {
    const { bribeStage } = useGame()
    return <BattleAbilityCountdownInner bribeStage={bribeStage} />
}

interface BattleAbilityCountdownInnerProps {
    bribeStage?: BribeStageResponse
}

const BattleAbilityCountdownInner = ({ bribeStage }: BattleAbilityCountdownInnerProps) => {
    const theme = useTheme<Theme>()

    const [sentence, setSentence] = useState<string>("Loading...")
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)

    useEffect(() => {
        const endTime = bribeStage?.end_time
        setEndTimeState(endTime)
        doSentence()
    }, [bribeStage])

    useInterval(() => {
        doSentence()
    }, totalSecRemain)

    const doSentence = () => {
        switch (bribeStage?.phase) {
            case "BRIBE":
                setSentence(`BATTLE ABILITY (${totalSecRemain}s)`)
                break

            case "LOCATION_SELECT":
                setSentence("BATTLE ABILITY INITIATED...")
                break

            case "COOLDOWN":
                setSentence(`PREPARING FOR NEXT BATTLE ABILITY (${totalSecRemain}s)`)
                break
        }
    }

    return (
        <Stack direction="row" spacing=".48rem" alignItems="center">
            <SvgBattleAbilityIcon size="1.8rem" fill={colors.text} />
            <Typography sx={{ lineHeight: 1, color: colors.text, fontWeight: "fontWeightBold" }}>{sentence}</Typography>
        </Stack>
    )
}
