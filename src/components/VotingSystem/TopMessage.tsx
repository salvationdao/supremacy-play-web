import { Box, Fade, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useGame } from '../../containers'
import { useInterval } from '../../hooks'

export const TopMessage = () => {
    const { votingState } = useGame()
    const [isShowing, setIsShowing] = useState<boolean>(false)
    const [sentence, setSentence] = useState<string>('')
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
    }, [votingState])

    const doSentence = () => {
        switch (votingState?.phase) {
            case 'VOTE_ABILITY_RIGHT':
                setSentence(`The voting phase ends in ${timeRemain} sec...`)
                break

            case 'NEXT_VOTE_WIN':
                setSentence(`Next vote wins!`)
                break

            case 'VOTE_COOLDOWN':
                setSentence(`The next voting phase starts in ${timeRemain} sec...`)
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
                            userSelect: 'none',
                            msUserSelect: 'none',
                            MozUserSelect: 'none',
                            WebkitUserSelect: 'none',
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
