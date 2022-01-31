import { Box, Fade, IconButton, Slide, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ClipThing, InteractiveMap, TargetTimerCountdown } from '..'
import { colors } from '../../theme/theme'
import { Theme } from '@mui/material/styles'
import ZoomOutMapOutlinedIcon from '@mui/icons-material/ZoomOutMapOutlined'
import ZoomInMapOutlinedIcon from '@mui/icons-material/ZoomInMapOutlined'
import { useToggle, useWindowDimensions } from '../../hooks'
import { useGame } from '../../containers'

export const MiniMap = () => {
    const { width, height } = useWindowDimensions()
    const theme = useTheme<Theme>()
    const { map, winner, battleState } = useGame()
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
            setDimensions({ width: width - 17, height: height - 76 })
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
        if (winner && battleState?.phase == 'LOCATION_SELECT') toggleEnlarged(true)
    }, [winner, battleState])

    useEffect(() => {
        if (timeReachZero || submitted) toggleEnlarged(false)
    }, [timeReachZero, submitted])

    if (!map) return null

    const isTargetting = winner && !timeReachZero && !submitted && battleState?.phase == 'LOCATION_SELECT'

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 65,
                right: 7,
                zIndex: 32,
                filter: 'drop-shadow(0 3px 3px #00000050)',
            }}
        >
            <Slide in={true} direction="left">
                <Box>
                    <ClipThing
                        border={{
                            isFancy: true,
                            borderThickness: '2px',
                            borderColor: isTargetting ? winner.factionAbility.colour : theme.factionTheme.primary,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                boxShadow: 1,
                                width: dimensions.width,
                                height: dimensions.height,
                                backgroundColor: colors.darkNavy,
                                transition: 'all .2s',
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
                                    factionAbility={winner.factionAbility}
                                    setTimeReachZero={setTimeReachZero}
                                    endTime={winner.endTime}
                                />
                            )}

                            {isTargetting ? (
                                <InteractiveMap
                                    windowDimension={dimensions}
                                    targeting
                                    factionAbility={winner.factionAbility}
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
