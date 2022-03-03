import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import moment from "moment"
import { useGame, VotingStateResponse } from "../../containers"
import { useInterval, useTimer } from "../../hooks"
import { BattleAbility } from "../../types"
import { SvgBattleAbilityIcon } from "../../assets"

export const BattleAbilityCountdown = (props: { battleAbility: BattleAbility }) => {
    const { votingState } = useGame()
    return <BattleAbilityCountdownInner {...props} votingState={votingState} />
}

interface BattleAbilityCountdownInnerProps {
    votingState?: VotingStateResponse
    battleAbility: BattleAbility
}

const BattleAbilityCountdownInner = ({ battleAbility, votingState }: BattleAbilityCountdownInnerProps) => {
    const theme = useTheme<Theme>()

    const [sentence, setSentence] = useState<string>("Loading...")
    const { setEndTimeState, totalSecRemain } = useTimer(undefined)

    useEffect(() => {
        const endTime = votingState?.endTime
        setEndTimeState(endTime)
        doSentence()
    }, [votingState])

    useInterval(() => {
        doSentence()
    }, totalSecRemain)

    const doSentence = () => {
        switch (votingState?.phase) {
            case "VOTE_ABILITY_RIGHT":
                setSentence(`FIGHT FOR YOUR SYNDICATE (${totalSecRemain}s)`)
                break

            case "NEXT_VOTE_WIN":
                setSentence(`FIGHT FOR YOUR SYNDICATE (NEXT VOTE WINS)`)
                break

            case "VOTE_COOLDOWN":
                setSentence(`UPCOMING ACTION (${totalSecRemain}s)`)
                break
        }
    }

    return (
        <Stack direction="row" spacing={0.6} alignItems="center">
            <SvgBattleAbilityIcon size="18px" fill={theme.factionTheme.primary} />
            <Typography sx={{ lineHeight: 1, color: theme.factionTheme.primary, fontWeight: "fontWeightBold" }}>
                {sentence}
            </Typography>
        </Stack>
    )
}
