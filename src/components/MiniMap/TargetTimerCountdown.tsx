import { Stack, Typography } from '@mui/material'
import moment from 'moment'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FactionAbility } from '../../types'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useInterval } from '../../hooks'

export const TargetTimerCountdown = ({
    factionAbility,
    setTimeReachZero,
    endTime,
}: {
    factionAbility: FactionAbility
    setTimeReachZero: Dispatch<SetStateAction<boolean>>
    endTime: Date
}) => {
    const theme = useTheme<Theme>()
    const [timeRemain, setTimeRemain] = useState<number>(999)
    const [delay, setDelay] = useState<number | null>(null)

    const { label, colour } = factionAbility

    useEffect(() => {
        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.round(d.asSeconds()))
            return
        }
        setDelay(null)
    }, [endTime])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, -1))
    }, delay)

    useEffect(() => {
        if (timeRemain <= 0) setTimeReachZero(true)
    }, [timeRemain])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={1}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                px: 1.4,
                py: 0.6,
                backgroundColor: `${theme.factionTheme.background}99`,
                borderRadius: 0.5,
                zIndex: 9,
            }}
        >
            <Typography variant="body1" sx={{ span: { lineHeight: 1, fontWeight: 'fontWeightBold', color: colour } }}>
                {`You have ${Math.max(timeRemain, 0)}s to choose a location for `}
                <span>{`${label}`}</span>
            </Typography>
        </Stack>
    )
}
