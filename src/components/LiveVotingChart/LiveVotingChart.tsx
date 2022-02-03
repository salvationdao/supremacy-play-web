import { Box, Slide, Stack, Theme, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { MaxLiveVotingDataLength, UI_OPACITY } from '../../constants'
import { useMousePosition } from '../../hooks/useMousePosition'
import { colors } from '../../theme/theme'
import { ClipThing } from '../common/ClipThing'
import { LiveGraph } from './LiveGraph'

const parseString = (val: string | null, defaultVal: number): number => {
    if (!val) return defaultVal

    return parseInt(val)
}

const LiveVotingChartMaxHeight = 288
const LiveVotingChartMinHeight = 120
const LiveVotingChartMaxWidth = 1000
const LiveVotingChartMinWidth = 200

export const LiveVotingChart = () => {
    const theme = useTheme<Theme>()
    const position = useMousePosition()

    const [chartSize, setChartSize] = useState({
        width: parseString(localStorage.getItem('liveVotingWidth'), LiveVotingChartMinWidth),
        height: parseString(localStorage.getItem('liveVotingHeight'), LiveVotingChartMinHeight),
    })

    const [topValue, setTopValue] = useState(parseString(localStorage.getItem('liveChatTopVal'), 500))
    const [rightValue, setRightValue] = useState(parseString(localStorage.getItem('liveChatRightVal'), 10))
    const [maxLiveVotingDataLength, setMaxLiveVotingDataLength] = useState(
        parseString(localStorage.getItem('liveVotingDataMax'), MaxLiveVotingDataLength),
    )

    const [startDragging, setStartDragging] = useState(false)
    const [startResizeRowLeft, SetStartResizeRowLeft] = useState(false)
    const [startResizeRowRight, SetStartResizeRowRight] = useState(false)
    const [startResizeColBottom, SetStartResizeColBottom] = useState(false)
    const [startResizeColTop, SetStartResizeColTop] = useState(false)
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const clearTriggers = () => {
        setStartDragging(false)
        SetStartResizeColTop(false)
        SetStartResizeRowLeft(false)
        SetStartResizeRowRight(false)
        SetStartResizeColBottom(false)
    }

    useEffect(() => {
        if (!startDragging && !startResizeRowLeft && !startResizeRowRight && !startResizeColBottom) return

        if (startResizeRowLeft) {
            const xMove = mousePosition.x - position.x
            const currentWidth = chartSize.width + xMove

            if (currentWidth > LiveVotingChartMaxWidth || currentWidth < LiveVotingChartMinWidth) {
                clearTriggers()
                const maxDataLength = Math.floor(chartSize.width / 5)
                setMaxLiveVotingDataLength(maxDataLength)
                localStorage.setItem('liveVotingDataMax', maxDataLength.toString())
                localStorage.setItem('liveVotingWidth', chartSize.width.toString())
            } else {
                setChartSize((cs) => ({ ...cs, width: currentWidth }))
                setMousePosition(position)
            }
        } else if (startResizeRowRight) {
            const xMove = mousePosition.x - position.x
            const currentWidth = chartSize.width - xMove

            if (currentWidth > LiveVotingChartMaxWidth || currentWidth < LiveVotingChartMinWidth) {
                clearTriggers()
                const maxDataLength = Math.floor(chartSize.width / 5)
                setMaxLiveVotingDataLength(maxDataLength)
                localStorage.setItem('liveVotingDataMax', maxDataLength.toString())
                localStorage.setItem('liveVotingWidth', chartSize.width.toString())
                localStorage.setItem('liveChatRightVal', rightValue.toString())
            } else {
                setRightValue((rv) => rv + xMove)
                setChartSize((cs) => ({ ...cs, width: currentWidth }))
                setMousePosition(position)
            }
        } else if (startResizeColBottom) {
            const yMove = mousePosition.y - position.y
            const currentHeight = chartSize.height - yMove

            if (currentHeight > LiveVotingChartMaxHeight || currentHeight < LiveVotingChartMinHeight) {
                clearTriggers()
                localStorage.setItem('liveVotingHeight', chartSize.height.toString())
            } else {
                setChartSize((cs) => ({ ...cs, height: currentHeight }))
                setMousePosition(position)
            }
        } else if (startResizeColTop) {
            const yMove = mousePosition.y - position.y
            const currentHeight = chartSize.height + yMove

            if (currentHeight > LiveVotingChartMaxHeight || currentHeight < LiveVotingChartMinHeight) {
                clearTriggers()
                localStorage.setItem('liveVotingHeight', chartSize.height.toString())
                localStorage.setItem('liveChatTopVal', topValue.toString())
            } else {
                setTopValue((tv) => tv - yMove)
                setChartSize((cs) => ({ ...cs, height: currentHeight }))
                setMousePosition(position)
            }
        } else if (startDragging) {
            // calc mouse movement
            const xMove = mousePosition.x - position.x
            const yMove = mousePosition.y - position.y

            setRightValue((rv) => rv + xMove)
            setTopValue((tv) => tv - yMove)

            setMousePosition(position)
        }
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
                    style={{
                        width: `${chartSize.width}px`,
                        height: `${chartSize.height}px`,
                        position: 'relative',
                        maxHeight: '288px',
                        maxWidth: '1440px',
                    }}
                >
                    <VerticalBarLeft
                        height={chartSize.height}
                        SetStartResize={SetStartResizeRowLeft}
                        width={chartSize.width}
                        setMaxLiveVotingDataLength={setMaxLiveVotingDataLength}
                    />
                    <VerticalBarRight
                        height={chartSize.height}
                        SetStartResize={SetStartResizeRowRight}
                        width={chartSize.width}
                        setMaxLiveVotingDataLength={setMaxLiveVotingDataLength}
                    />
                    <HorizontalBarBottom
                        width={chartSize.width}
                        SetStartResize={SetStartResizeColBottom}
                        height={chartSize.height}
                    />
                    <HorizontalBarTop
                        width={chartSize.width}
                        SetStartResize={SetStartResizeColTop}
                        height={chartSize.height}
                    />

                    <Box width="100%" height="100%">
                        <ClipThing
                            border={{ isFancy: true, borderThickness: '3px' }}
                            sx={{ width: '100%', height: '100%' }}
                            fillHeight
                            clipSize="10px"
                            innerSx={{ width: '100%', height: '100%' }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: theme.factionTheme.background,
                                    pl: 0.3,
                                    pr: 1.3,
                                    pt: 1.2,
                                    pb: 1.4,
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: 1,
                                        maxHeight: `calc(288px - 24px)`,
                                        minHeight: 0,
                                        minWidth: 0,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        width: '100%',
                                        height: '100%',
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
                                    <Box sx={{ direction: 'ltr', width: '100%', height: '100%' }}>
                                        <Stack spacing={1.3} sx={{ width: '100%', height: '100%' }}>
                                            {startResizeRowLeft || startResizeRowRight || startResizeColBottom ? (
                                                <div />
                                            ) : (
                                                <LiveGraph
                                                    maxWidthPx={chartSize.width}
                                                    maxHeightPx={chartSize.height}
                                                    maxLiveVotingDataLength={maxLiveVotingDataLength}
                                                />
                                            )}
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>
                        </ClipThing>
                    </Box>
                </div>
            </Slide>
        </Stack>
    )
}

interface ResizeBarProps {
    width: number
    height: number
    SetStartResize: React.Dispatch<React.SetStateAction<boolean>>
}

const HorizontalBarBottom = ({ width, height, SetStartResize }: ResizeBarProps) => {
    return (
        <div
            style={{
                height: '5px',
                width: `${width}px`,
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom: 0,
                left: 0,
                cursor: 'row-resize',
                zIndex: 100,
            }}
            onMouseDown={() => {
                SetStartResize(true)
            }}
            onMouseUp={() => {
                SetStartResize(false)
                localStorage.setItem('liveVotingHeight', height.toString())
            }}
        />
    )
}

const HorizontalBarTop = ({ width, height, SetStartResize }: ResizeBarProps) => {
    return (
        <div
            style={{
                height: '5px',
                width: `${width}px`,
                backgroundColor: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                cursor: 'row-resize',
                zIndex: 100,
            }}
            onMouseDown={() => {
                SetStartResize(true)
            }}
            onMouseUp={() => {
                SetStartResize(false)
                localStorage.setItem('liveVotingHeight', height.toString())
            }}
        />
    )
}

interface VerticalBarProps extends ResizeBarProps {
    setMaxLiveVotingDataLength: React.Dispatch<React.SetStateAction<number>>
}

const VerticalBarLeft = ({ height, width, SetStartResize, setMaxLiveVotingDataLength }: VerticalBarProps) => {
    return (
        <div
            style={{
                height: `${height}px`,
                width: '4px',
                backgroundColor: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                cursor: 'col-resize',
                zIndex: 100,
            }}
            onMouseDown={() => {
                SetStartResize(true)
            }}
            onMouseUp={() => {
                SetStartResize(false)
                const maxDataLength = Math.floor(width / 5)
                setMaxLiveVotingDataLength(maxDataLength)
                localStorage.setItem('liveVotingDataMax', maxDataLength.toString())
                localStorage.setItem('liveVotingWidth', width.toString())
            }}
        />
    )
}

const VerticalBarRight = ({ height, width, SetStartResize, setMaxLiveVotingDataLength }: VerticalBarProps) => {
    return (
        <div
            style={{
                height: `${height}px`,
                width: '4px',
                backgroundColor: 'transparent',
                position: 'absolute',
                top: 0,
                right: 0,
                cursor: 'col-resize',
                zIndex: 100,
            }}
            onMouseDown={() => {
                SetStartResize(true)
            }}
            onMouseUp={() => {
                SetStartResize(false)
                const maxDataLength = Math.floor(width / 5)
                setMaxLiveVotingDataLength(maxDataLength)
                localStorage.setItem('liveVotingDataMax', maxDataLength.toString())
                localStorage.setItem('liveVotingWidth', width.toString())
            }}
        />
    )
}
