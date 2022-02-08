import { Box, Fade, Slide } from '@mui/material'
import { ReactElement, useEffect } from 'react'
import { useDebounce } from '../../hooks'

export const NotificationItem = ({ duration, children }: { duration: number; children: ReactElement }) => {
    const [isShowing, setIsShowing] = useDebounce<boolean>(true, duration)

    useEffect(() => {
        setIsShowing(false)
    }, [])

    return (
        <Slide in={isShowing} direction="left">
            <Box sx={{ filter: 'drop-shadow(0 3px 3px #00000050)' }}>{children}</Box>
        </Slide>
    )
}
