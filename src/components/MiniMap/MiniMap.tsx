import { Box, IconButton, Slide, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ClipThing, InteractiveMap, TargetTimerCountdown } from '..'
import { colors } from '../../theme/theme'
import { Theme } from '@mui/material/styles'
import ZoomOutMapOutlinedIcon from '@mui/icons-material/ZoomOutMapOutlined'
import ZoomInMapOutlinedIcon from '@mui/icons-material/ZoomInMapOutlined'
import { useToggle } from '../../hooks'
import { useDimension, useGame } from '../../containers'
import { CONTROLS_HEIGHT, GAMEBAR_HEIGHT } from '../../constants'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { parseString } from '../../helpers'
import { SvgDrag } from '../../assets'

const Padding = 10
const DefaultPositionY = 222

export const MiniMap = () => {
    const {
        streamDimensions: { width, height },
    } = useDimension()
    const theme = useTheme<Theme>()
    const [curPosX, setCurPosX] = useState(-1)
    const [curPosY, setCurPosY] = useState(-1)
    const { map, winner, setWinner, votingState } = useGame()
    const [enlarged, toggleEnlarged] = useToggle()
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: 230,
        height: 200,
    })

    // For targeting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const confirmed = useRef<boolean>(false)

    useEffect(() => {
        // Height: 125 is the height of the bottom mech stats
        const newWidth = enlarged ? Math.min(width - 23, 1000) : 230
        const newHeight = enlarged ? Math.min(height - 125, 700) : 200

        let newPosX = parseString(localStorage.getItem('miniMapPosX'), -1)
        let newPosY = parseString(localStorage.getItem('miniMapPosY'), DefaultPositionY)

        // Make sure map is inside iframe when page is resized etc.
        newPosX =
            newPosX > 0 ? Math.max(Padding, Math.min(newPosX, width - newWidth - Padding)) : width - newWidth - Padding
        newPosY = Math.max(Padding, Math.min(newPosY, height - GAMEBAR_HEIGHT - CONTROLS_HEIGHT - newHeight - Padding))

        setCurPosX(newPosX)
        setCurPosY(newPosY)
        setDimensions({ width: newWidth, height: newHeight })
        localStorage.setItem('miniMapPosX', newPosX.toString())
        localStorage.setItem('miniMapPosY', newPosY.toString())
    }, [width, height, enlarged])

    useEffect(() => {
        const endTime = winner?.endTime

        if (endTime) {
            confirmed.current = false
            setSubmitted(false)
            setTimeReachZero(false)
        }
    }, [winner])

    useEffect(() => {
        if (winner && votingState?.phase == 'LOCATION_SELECT') toggleEnlarged(true)
    }, [winner, votingState])

    useEffect(() => {
        if (timeReachZero || submitted) {
            toggleEnlarged(false)
            setWinner(undefined)
        }
    }, [timeReachZero, submitted])

    if (!map) return null

    const isTargeting = winner && !timeReachZero && !submitted && votingState?.phase == 'LOCATION_SELECT'

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 32,
                filter: 'drop-shadow(0 3px 3px #00000050)',
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
                    localStorage.setItem('miniMapPosX', data.x.toString())
                    localStorage.setItem('miniMapPosY', data.y.toString())
                }}
                bounds={{
                    top: Padding,
                    bottom: height - dimensions.height - Padding - 3,
                    left: Padding,
                    right: width - dimensions.width - Padding - 3,
                }}
            >
                <Box sx={{ pointerEvents: 'all' }}>
                    <Slide in={true} direction="left">
                        <Box>
                            <ClipThing
                                clipSize="10px"
                                border={{
                                    isFancy: true,
                                    borderThickness: '3px',
                                    borderColor: isTargeting ? winner.gameAbility.colour : theme.factionTheme.primary,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        boxShadow: 1,
                                        width: dimensions.width,
                                        height: dimensions.height,
                                        // backgroundColor: colors.darkNavy,
                                        transition: 'all .2s',
                                        background: `repeating-linear-gradient(45deg,#000000,#000000 7px,${colors.darkNavy} 7px,${colors.darkNavy} 14px )`,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            left: 1,
                                            top: 1,
                                            color: colors.text,
                                            opacity: 0.8,
                                            zIndex: 50,
                                        }}
                                        onClick={() => toggleEnlarged()}
                                    >
                                        {enlarged ? (
                                            <ZoomInMapOutlinedIcon fontSize="small" />
                                        ) : (
                                            <ZoomOutMapOutlinedIcon fontSize="small" />
                                        )}
                                    </IconButton>

                                    <IconButton
                                        className="handle"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            left: 25,
                                            top: 3,
                                            color: colors.text,
                                            opacity: 0.8,
                                            zIndex: 50,
                                            cursor: 'move',
                                        }}
                                    >
                                        <SvgDrag size="13px" />
                                    </IconButton>

                                    {isTargeting && (
                                        <TargetTimerCountdown
                                            gameAbility={winner.gameAbility}
                                            setTimeReachZero={setTimeReachZero}
                                            endTime={winner.endTime}
                                        />
                                    )}

                                    {isTargeting ? (
                                        <InteractiveMap
                                            gameAbility={winner.gameAbility}
                                            windowDimension={dimensions}
                                            targeting
                                            setSubmitted={setSubmitted}
                                            confirmed={confirmed}
                                            enlarged={enlarged}
                                        />
                                    ) : (
                                        <InteractiveMap windowDimension={dimensions} enlarged={enlarged} />
                                    )}
                                </Box>
                            </ClipThing>
                        </Box>
                    </Slide>
                </Box>
            </Draggable>
        </Box>
    )
}
