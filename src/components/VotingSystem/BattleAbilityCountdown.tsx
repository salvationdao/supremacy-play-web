import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import moment from 'moment'
import { useGame } from '../../containers'
import { useInterval } from '../../hooks'
import { BattleAbility } from '../../types'

export const BattleAbilityCountdown = ({ battleAbility }: { battleAbility: BattleAbility }) => {
    const theme = useTheme<Theme>()
    const { votingState } = useGame()
    const [sentence, setSentence] = useState<string>('Loading...')
    const [timeRemain, setTimeRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)

    useEffect(() => {
        const endTime = votingState?.endTime

        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [votingState])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, 0))
        doSentence()
    }, delay)

    useEffect(() => {
        const endTime = votingState?.endTime

        switch (votingState?.phase) {
            case 'VOTE_ABILITY_RIGHT':
            case 'NEXT_VOTE_WIN':
            case 'VOTE_COOLDOWN':
                if (endTime) {
                    const d = moment.duration(moment(endTime).diff(moment()))
                    setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
                    setDelay(1000)
                    return
                }
                setDelay(null)
                break
        }
        doSentence()
    }, [votingState])

    const doSentence = () => {
        switch (votingState?.phase) {
            case 'VOTE_ABILITY_RIGHT':
                setSentence(`FIGHT FOR YOUR SYNDICATE (${timeRemain}s)`)
                break

            case 'NEXT_VOTE_WIN':
                setSentence(`FIGHT FOR YOUR SYNDICATE (NEXT VOTE WINS)`)
                break

            case 'VOTE_COOLDOWN':
                setSentence(`UPCOMING ACTION (${timeRemain}s)`)
                break
        }
    }

    return <Typography sx={{ color: theme.factionTheme.primary, fontWeight: 'fontWeightBold' }}>{sentence}</Typography>
}
