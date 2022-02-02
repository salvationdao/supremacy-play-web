import { Box, Fade, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useGame } from '../../containers'
import { useInterval } from '../../hooks'

export const BattleTopMessage = () => {
    const { battleState } = useGame()
    const [sentence, setSentence] = useState<string>('')
    const [isShowing, setIsShowing] = useState<boolean>(false)
    const [timeRemain, setTimeRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)

    useEffect(() => {
        const endTime = battleState?.endTime

        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [battleState])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, 0))
        doSentence()
    }, delay)

    useEffect(() => {
        const endTime = battleState?.endTime

        switch (battleState?.phase) {
            case 'FIRST_VOTE':
            case 'TIE':
            case 'VOTE_COOLDOWN':
                if (endTime) {
                    const d = moment.duration(moment(endTime).diff(moment()))
                    setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
                    setIsShowing(true)
                    setDelay(1000)
                    return
                }
                setDelay(null)
                break

            default:
                setIsShowing(false)
                break
        }
        doSentence()
    }, [battleState])

    const doSentence = () => {
        switch (battleState?.phase) {
            case 'FIRST_VOTE':
                setSentence(`Voting phase ends in ${timeRemain} sec...`)
                break

            case 'TIE':
                setSentence(`Next vote wins!`)
                break

            case 'VOTE_COOLDOWN':
                setSentence(`Voting phase starts in ${timeRemain} sec...`)
                break
        }
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 125,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 15,
            }}
        >
            <Fade in={isShowing}>
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'fontWeightBold',
                            fontFamily: 'Nostromo Regular Black',
                            color: '#FFFFFF',
                            filter: 'drop-shadow(0 3px 3px #00000020)',
                        }}
                    >
                        {sentence}
                    </Typography>
                </Box>
            </Fade>
        </Box>
    )
}
