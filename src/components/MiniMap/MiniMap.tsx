import { Box, Fade, IconButton, Slide, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ClipThing, InteractiveMap, TargetTimerCountdown } from '..'
import { colors } from '../../theme/theme'
import { Theme } from '@mui/material/styles'
import ZoomOutMapOutlinedIcon from '@mui/icons-material/ZoomOutMapOutlined'
import ZoomInMapOutlinedIcon from '@mui/icons-material/ZoomInMapOutlined'
import { useToggle } from '../../hooks'
import { useDimension, useGame } from '../../containers'
import { CONTROLS_HEIGHT } from '../../constants'

export const MiniMap = () => {
    const {
        iframeDimensions: { width, height },
    } = useDimension()
    const theme = useTheme<Theme>()
    const { map, winner, setWinner, votingState } = useGame()
    const [enlarged, toggleEnlarged] = useToggle()
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: 230,
        height: 200,
    })

    // For targetting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const confirmed = useRef<boolean>(false)

    useEffect(() => {
        if (enlarged) {
            // Height: 76 is just vertical spacing, and 125 is the height of the bottom mech stats
            setDimensions({
                width: Math.min(width - 23, 1000),
                height: Math.min(height - 76 - 125 - CONTROLS_HEIGHT, 700),
            })
        } else {
            setDimensions({ width: 230, height: 200 })
        }
    }, [enlarged])

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

    const isTargetting = winner && !timeReachZero && !submitted && votingState?.phase == 'LOCATION_SELECT'

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 32,
                filter: 'drop-shadow(0 3px 3px #00000050)',
            }}
        >
            <Slide in={true} direction="left">
                <Box>
                    <ClipThing
                        border={{
                            isFancy: true,
                            borderThickness: '3px',
                            borderColor: isTargetting ? winner.gameAbility.colour : theme.factionTheme.primary,
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

                            {isTargetting && (
                                <TargetTimerCountdown
                                    gameAbility={winner.gameAbility}
                                    setTimeReachZero={setTimeReachZero}
                                    endTime={winner.endTime}
                                />
                            )}

                            {isTargetting ? (
                                <InteractiveMap
                                    gameAbility={winner.gameAbility}
                                    windowDimension={dimensions}
                                    targeting
                                    setSubmitted={setSubmitted}
                                    confirmed={confirmed}
                                />
                            ) : (
                                <InteractiveMap windowDimension={dimensions} />
                            )}
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Box>
    )
}
