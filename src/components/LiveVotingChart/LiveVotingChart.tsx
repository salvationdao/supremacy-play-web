import { Box, Fade, Stack, Theme, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import BigNumber from 'bignumber.js'
import { SyntheticEvent, useEffect, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { SvgDrag, SvgResizeArrow, SvgSupToken } from '../../assets'
import { UI_OPACITY } from '../../constants'
import { useDimension, useWebsocket } from '../../containers'
import { parseString } from '../../helpers'
import { pulseEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'
import { NetMessageType } from '../../types'
import { LiveGraph } from './LiveGraph'

const Padding = 10
const DefaultPositionY = 222
const DefaultSizeX = 280
const DefaultSizeY = 115
const MaxSizeY = 115
const DefaultMaxLiveVotingDataLength = 100

const SpoilOfWarAmount = () => {
    const { state, subscribeNetMessage } = useWebsocket()
    const [spoilOfWarAmount, setSpoilOfWarAmount] = useState<string>('0')

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<string | undefined>(NetMessageType.SpoilOfWarTick, (payload) => {
            if (!payload) return
            setSpoilOfWarAmount(new BigNumber(payload).dividedBy('1000000000000000000').toFixed(6))
        })
    }, [state, subscribeNetMessage])

    return (
        <>
            <Typography variant="body1" sx={{}}>
                SPOILS OF WAR:&nbsp;
            </Typography>
            <SvgSupToken size="14px" fill={colors.yellow} />
            <Typography variant="body1">{spoilOfWarAmount}</Typography>
        </>
    )
}

export const LiveVotingChart = () => {
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { width, height },
    } = useDimension()
    const [curPosX, setCurPosX] = useState(-1)
    const [curPosY, setCurPosY] = useState(-1)
    const [curWidth, setCurWidth] = useState(parseString(localStorage.getItem('liveVotingSizeX'), DefaultSizeX))
    const [curHeight, setCurHeight] = useState(parseString(localStorage.getItem('liveVotingSizeY'), DefaultSizeY))
    const [maxLiveVotingDataLength, setMaxLiveVotingDataLength] = useState(
        parseString(localStorage.getItem('liveVotingDataMax'), DefaultMaxLiveVotingDataLength),
    )

    useEffect(() => {
        let newPosX = parseString(localStorage.getItem('liveVotingPosX'), -1)
        let newPosY = parseString(localStorage.getItem('liveVotingPosY'), DefaultPositionY)

        // Make sure live voting chart is inside iframe when page is resized etc.
        newPosX =
            newPosX > 0 ? Math.max(Padding, Math.min(newPosX, width - curWidth - Padding)) : width - curWidth - Padding
        newPosY = Math.max(Padding, Math.min(newPosY, height - curHeight - Padding))

        setCurPosX(newPosX)
        setCurPosY(newPosY)
        localStorage.setItem('liveVotingPosX', newPosX.toString())
        localStorage.setItem('liveVotingPosY', newPosY.toString())

        onResize()
    }, [width, height, curWidth])

    const onResize = (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
        const { size } = data || { size: { width: curWidth, height: curHeight } }
        if (size.width >= DefaultSizeX) {
            setMaxLiveVotingDataLength(size.width / 5)
            setCurWidth(Math.min(width - 2 * Padding, size.width))
        }

        if (size.height <= MaxSizeY && size.height >= DefaultSizeY) {
            setCurHeight(Math.min(height - 2 * Padding, size.height))
        }
    }

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 18,
                opacity: UI_OPACITY,
                filter: 'drop-shadow(0 3px 3px #00000050)',
                ':hover': {
                    zIndex: 999,
                },
            }}
        >
            <Draggable
                allowAnyClick
                handle=".handle"
                position={{
                    x: curPosX,
                    y: curPosY,
                }}
                onStop={(e: DraggableEvent, data: DraggableData) => {
                    setCurPosX(data.x)
                    setCurPosY(data.y)
                    localStorage.setItem('liveVotingPosX', data.x.toString())
                    localStorage.setItem('liveVotingPosY', data.y.toString())
                }}
                bounds={{
                    top: Padding,
                    bottom: height - curHeight - Padding,
                    left: Padding,
                    right: width - curWidth - Padding,
                }}
            >
                <Box sx={{ pointerEvents: 'all' }}>
                    <Fade in={true}>
                        <Box>
                            <Resizable
                                height={curHeight}
                                width={curWidth}
                                onResize={onResize}
                                handle={() => (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 9.1,
                                            right: 9,
                                            cursor: 'ew-resize',
                                            opacity: 0.4,
                                            ':hover': { opacity: 1 },
                                        }}
                                    >
                                        <SvgResizeArrow size="13px" />
                                    </Box>
                                )}
                                onResizeStop={(e: SyntheticEvent, data: ResizeCallbackData) => {
                                    localStorage.setItem('liveVotingSizeX', data.size.width.toString())
                                    localStorage.setItem('liveVotingSizeY', data.size.height.toString())
                                }}
                            >
                                <Stack
                                    sx={{
                                        position: 'relative',
                                        width: curWidth,
                                        height: curHeight,
                                        resize: 'all',
                                        overflow: 'auto',
                                        backgroundColor: theme.factionTheme.background,
                                        borderRadius: 0.5,
                                    }}
                                >
                                    <Box sx={{ flex: 1, px: 1, pt: 1, pb: 0.9, width: '100%' }}>
                                        <Box
                                            key={maxLiveVotingDataLength}
                                            sx={{
                                                position: 'relative',
                                                height: '100%',
                                                px: 0.7,
                                                pt: 2,
                                                background: '#00000099',
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                                spacing={0.5}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 5,
                                                    right: 7,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 7,
                                                        height: 7,
                                                        mb: 0.2,
                                                        backgroundColor: colors.red,
                                                        borderRadius: '50%',
                                                        animation: `${pulseEffect} 3s infinite`,
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                                    Live
                                                </Typography>
                                            </Stack>

                                            <LiveGraph
                                                maxWidthPx={curWidth}
                                                maxHeightPx={curHeight}
                                                maxLiveVotingDataLength={maxLiveVotingDataLength}
                                            />
                                        </Box>
                                    </Box>

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="flex-end"
                                        sx={{ px: 1.3, pb: 0.7 }}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{ mr: 'auto' }}
                                        >
                                            <SpoilOfWarAmount />
                                        </Stack>

                                        <Box
                                            className="handle"
                                            sx={{ cursor: 'move', mr: '20px', opacity: 0.4, ':hover': { opacity: 1 } }}
                                        >
                                            <SvgDrag size="13px" />
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Resizable>
                        </Box>
                    </Fade>
                </Box>
            </Draggable>
        </Stack>
    )
}
