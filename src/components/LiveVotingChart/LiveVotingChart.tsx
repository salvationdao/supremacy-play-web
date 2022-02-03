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
    const [startResizeLF, SetStartResizeLF] = useState(false)
    const [startResizeTD, SetStartResizeTD] = useState(false)
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        if (!startDragging && !startResizeLF && !startResizeTD) return

        if (startResizeLF) {
            const xMove = mousePosition.x - position.x
            const currentWidth = chartSize.width + xMove

            if (currentWidth > LiveVotingChartMaxWidth || currentWidth < LiveVotingChartMinWidth) {
                setStartDragging(false)
                SetStartResizeLF(false)
                const maxDataLength = Math.floor(chartSize.width / 5)
                setMaxLiveVotingDataLength(maxDataLength)
                localStorage.setItem('liveVotingDataMax', maxDataLength.toString())
                localStorage.setItem('liveVotingWidth', chartSize.width.toString())
            } else {
                setChartSize((cs) => ({ ...cs, width: cs.width + xMove }))
                setMousePosition(position)
            }
        } else if (startResizeTD) {
            const yMove = mousePosition.y - position.y
            const currentHeight = chartSize.height - yMove

            if (currentHeight > LiveVotingChartMaxHeight || currentHeight < LiveVotingChartMinHeight) {
                setStartDragging(false)
                SetStartResizeTD(false)
                localStorage.setItem('liveVotingHeight', chartSize.height.toString())
            } else {
                setChartSize((cs) => ({ ...cs, height: cs.height - yMove }))
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
    }, [position, startResizeLF, startDragging])

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
                    <VerticalBar
                        height={chartSize.height}
                        top={0}
                        left={0}
                        SetStartResizeLF={SetStartResizeLF}
                        currentWidth={chartSize.width}
                        setMaxLiveVotingDataLength={setMaxLiveVotingDataLength}
                    />
                    <HorizontalBar
                        width={chartSize.width}
                        bottom={0}
                        left={0}
                        SetStartResizeTD={SetStartResizeTD}
                        currentHeight={chartSize.height}
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
                                            {startResizeLF || startResizeTD ? (
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

interface VerticalBarProps {
    height: number
    top: number
    left: number
    SetStartResizeLF: React.Dispatch<React.SetStateAction<boolean>>
    currentWidth: number
    setMaxLiveVotingDataLength: React.Dispatch<React.SetStateAction<number>>
}

const VerticalBar = ({
    height,
    top,
    left,
    currentWidth,
    SetStartResizeLF,
    setMaxLiveVotingDataLength,
}: VerticalBarProps) => {
    return (
        <div
            style={{
                height: `${height}px`,
                width: '4px',
                backgroundColor: 'transparent',
                position: 'absolute',
                top,
                left,
                cursor: 'col-resize',
                zIndex: 100,
            }}
            onMouseDown={() => {
                SetStartResizeLF(true)
            }}
            onMouseUp={() => {
                SetStartResizeLF(false)
                const maxDataLength = Math.floor(currentWidth / 5)
                setMaxLiveVotingDataLength(maxDataLength)
                localStorage.setItem('liveVotingDataMax', maxDataLength.toString())
                localStorage.setItem('liveVotingWidth', currentWidth.toString())
            }}
        />
    )
}

interface HorizontalBarProps {
    width: number
    currentHeight: number
    bottom: number
    left: number
    SetStartResizeTD: React.Dispatch<React.SetStateAction<boolean>>
}

const HorizontalBar = ({ width, currentHeight, bottom, left, SetStartResizeTD }: HorizontalBarProps) => {
    return (
        <div
            style={{
                height: '5px',
                width: `${width}px`,
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom,
                left,
                cursor: 'row-resize',
                zIndex: 100,
            }}
            onMouseDown={() => {
                SetStartResizeTD(true)
            }}
            onMouseUp={() => {
                SetStartResizeTD(false)
                localStorage.setItem('liveVotingHeight', currentHeight.toString())
            }}
        />
    )
}
