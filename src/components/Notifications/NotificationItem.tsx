import { Box, Fade, Slide } from '@mui/material'
import { ReactElement, useEffect } from 'react'
import { ClipThing } from '..'
import { useDebounce } from '../../hooks'
import { colors } from '../../theme/theme'

export const NotificationItem = ({ duration, children }: { duration: number; children: ReactElement }) => {
    const [isShowing, setIsShowing] = useDebounce<boolean>(true, duration)

    useEffect(() => {
        setIsShowing(false)
    }, [])

    return (
        <Slide in={isShowing} direction="left">
            <Box sx={{ width: 320, filter: 'drop-shadow(0 3px 3px #00000050)' }}>
                <ClipThing border={{ isFancy: true, borderThickness: '2px' }} clipSize="5px">
                    <Box
                        sx={{
                            px: 1.8,
                            pt: 1.5,
                            pb: 1,
                            backgroundColor: colors.darkNavy,
                        }}
                    >
                        {children}
                    </Box>
                </ClipThing>
            </Box>
        </Slide>
    )
}
