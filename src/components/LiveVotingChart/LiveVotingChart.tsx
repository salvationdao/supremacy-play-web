import { Box, Slide, Stack, Theme, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { UI_OPACITY } from '../../constants'
import { useDimension } from '../../containers'
import { useMousePosition } from '../../hooks/useMousePosition'
import { colors } from '../../theme/theme'
import { ClipThing } from '../common/ClipThing'
import { LiveGraph } from './LiveGraph'

const parseString = (val: string | null, defaultVal: number): number => {
    if (!val) return defaultVal

    return parseInt(val)
}

export const LiveVotingChart = () => {
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()
    const position = useMousePosition()

    const [topValue, setTopValue] = useState(parseString(localStorage.getItem('liveChatTopVal'), 500))
    const [rightValue, setRightValue] = useState(parseString(localStorage.getItem('liveChatRightVal'), 10))

    const [startDragging, setStartDragging] = useState(false)
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        if (!startDragging) return
        // calc mouse movement
        const xMove = mousePosition.x - position.x
        const yMove = mousePosition.y - position.y

        setRightValue((rv) => rv + xMove)
        setTopValue((tv) => tv - yMove)

        setMousePosition(position)
    }, [position])

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
                            onMouseDown={() => {
                                setStartDragging(true)
                                setMousePosition(position)
                            }}
                            onMouseUp={() => {
                                setStartDragging(false)
                                // store current top
                                localStorage.setItem('liveChatTopVal', topValue.toString())
                                localStorage.setItem('liveChatRightVal', rightValue.toString())
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
