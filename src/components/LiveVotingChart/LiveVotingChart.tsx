import { Box, Slide, Stack, Theme, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useState } from 'react'
import { UI_OPACITY } from '../../constants'
import { useDimension } from '../../containers'
import { colors } from '../../theme/theme'
import { ClipThing } from '../common/ClipThing'
import { LiveGraph } from './LiveGraph'

export const LiveVotingChart = () => {
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()

    const [startDragging, setStartDragging] = useState(false)
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const [topValue, setTopValue] = useState(500)
    const [rightValue, setRightValue] = useState(10)

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: topValue,
                right: rightValue,
                zIndex: 15,
                overflow: 'hidden',
                opacity: UI_OPACITY,
            }}
        >
            <Slide in={true} direction="left">
                <Box>
                    <ClipThing border={{ isFancy: true, borderThickness: '3px' }} clipSize="10px">
                        <div
                            onMouseDown={(e) => {
                                setStartDragging(true)
                                setMousePosition({ x: e.pageX, y: e.pageY })
                            }}
                            onMouseUp={() => {
                                setStartDragging(false)
                            }}
                            onMouseMove={(e) => {
                                if (!startDragging) return
                                // x,y move
                                const xMove = mousePosition.x - e.pageX
                                const yMove = mousePosition.y - e.pageY

                                setRightValue((rv) => rv + xMove)
                                setTopValue((tv) => tv - yMove)

                                // set new position
                                setMousePosition({ x: e.pageX, y: e.pageY })
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: theme.factionTheme.background,
                                    pl: 0.3,
                                    pr: 1.3,
                                    pt: 1.2,
                                    pb: 1.4,
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: 1,
                                        maxHeight: `calc(288px - 24px)`,
                                        minWidth: '300px',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        pl: 1,
                                        py: 0.2,
                                        direction: 'rtl',
                                        scrollbarWidth: 'none',
                                        '::-webkit-scrollbar': {
                                            width: 4,
                                        },
                                        '::-webkit-scrollbar-track': {
                                            boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
                                            borderRadius: 3,
                                        },
                                        '::-webkit-scrollbar-thumb': {
                                            background: theme.factionTheme.primary,
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <Box sx={{ direction: 'ltr' }}>
                                        <Stack spacing={1.3}>
                                            <LiveGraph />
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>
                        </div>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}
