import { Box, IconButton, Fade, useTheme } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { ClipThing, InteractiveMap, TargetTimerCountdown } from ".."
import { colors } from "../../theme/theme"
import { Theme } from "@mui/material/styles"
import { useToggle } from "../../hooks"
import { useDimension, useGame, useOverlayToggles } from "../../containers"
import { SvgHide, SvgMapEnlarge } from "../../assets"
import { MINI_MAP_DEFAULT_HEIGHT, MINI_MAP_DEFAULT_WIDTH } from "../../constants"
import { useSpring, animated } from "react-spring"

export const MiniMap = () => {
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { width, height },
    } = useDimension()
    const { map, winner, setWinner, votingState } = useGame()
    const [enlarged, toggleEnlarged] = useToggle(false)
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: MINI_MAP_DEFAULT_WIDTH,
        height: MINI_MAP_DEFAULT_HEIGHT,
    })

    // For targeting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const confirmed = useRef<boolean>(false)

    useEffect(() => {
        if (width <= 0 || height <= 0) return

        // 25px is room for padding so the map doesnt grow bigger than the stream dimensions
        const newWidth = enlarged ? Math.min(width - 25, 1000) : MINI_MAP_DEFAULT_WIDTH
        const newHeight = enlarged ? Math.min(height - 25, 700) : MINI_MAP_DEFAULT_HEIGHT
        setDimensions({ width: newWidth, height: newHeight })
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
        if (winner && votingState?.phase == "LOCATION_SELECT") toggleEnlarged(true)
    }, [winner, votingState])

    useEffect(() => {
        if (timeReachZero || submitted) {
            toggleEnlarged(false)
            setWinner(undefined)
        }
    }, [timeReachZero, submitted])

    // -------------- Map React Spring ----------------
    const { xy } = useSpring({
        // Rounding is needed for the transform - otherwise it makes the element blurry
        xy: enlarged
            ? [Math.round(-(width - dimensions.width - 25) / 2), Math.round(-(height - dimensions.height - 25) / 1.2)]
            : [0, 0],
        from: { xy: [0, 0] },
        config: { duration: 200 },
    })

    if (!map) return null

    const isTargeting = winner && !timeReachZero && !submitted && votingState?.phase == "LOCATION_SELECT"

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                pointerEvents: "none",
                zIndex: 32,
                filter: "drop-shadow(0 3px 3px #00000050)",
            }}
        >
            <animated.div
                style={{
                    transform: xy.to((x, y) => `translate(${x}px, ${y}px)`),
                }}
            >
                <Box sx={{ pointerEvents: "all" }}>
                    <Fade in={isMapOpen}>
                        <Box>
                            <ClipThing
                                clipSize="10px"
                                border={{
                                    isFancy: true,
                                    borderThickness: "3px",
                                    borderColor: isTargeting ? winner.gameAbility.colour : theme.factionTheme.primary,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        boxShadow: 1,
                                        width: dimensions.width,
                                        height: dimensions.height,
                                        // backgroundColor: colors.darkNavy,
                                        transition: "all .2s",
                                        background: `repeating-linear-gradient(45deg,#000000,#000000 7px,${colors.darkNavy} 7px,${colors.darkNavy} 14px )`,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            left: 2,
                                            top: 2,
                                            color: colors.text,
                                            opacity: 0.8,
                                            zIndex: 50,
                                        }}
                                        onClick={() => toggleEnlarged()}
                                    >
                                        <SvgMapEnlarge size="13px" />
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            left: 25,
                                            top: 2,
                                            color: colors.text,
                                            opacity: 0.8,
                                            zIndex: 50,
                                        }}
                                        onClick={toggleIsMapOpen}
                                    >
                                        <SvgHide size="13px" />
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
                    </Fade>
                </Box>
            </animated.div>
        </Box>
    )
}
