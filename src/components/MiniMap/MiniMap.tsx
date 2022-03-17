import { Box, Fade, IconButton, Typography, useTheme } from "@mui/material"
import { SyntheticEvent, useEffect, useState } from "react"
import { Resizable, ResizeCallbackData } from "react-resizable"
import { animated, useSpring } from "react-spring"
import { ClipThing, InteractiveMap, TargetTimerCountdown } from ".."
import { SvgHide, SvgMapEnlarge, SvgResizeXY } from "../../assets"
import { MINI_MAP_DEFAULT_HEIGHT, MINI_MAP_DEFAULT_WIDTH } from "../../constants"
import {
    useDimension,
    useGame,
    useOverlayToggles,
    BribeStageResponse,
    WinnerAnnouncementResponse,
} from "../../containers"
import { shadeColor } from "../../helpers"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { Map } from "../../types"

interface MiniMapProps {
    map?: Map
    winner?: WinnerAnnouncementResponse
    setWinner: (winner?: WinnerAnnouncementResponse) => void
    bribeStage?: BribeStageResponse
    isMapOpen: boolean
    toggleIsMapOpen: (open?: boolean) => void
}

export const MiniMap = () => {
    const { map, winner, setWinner, bribeStage } = useGame()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()
    return (
        <MiniMapInner
            map={map}
            winner={winner}
            setWinner={setWinner}
            bribeStage={bribeStage}
            isMapOpen={isMapOpen}
            toggleIsMapOpen={toggleIsMapOpen}
        />
    )
}

export const MiniMapInner = ({ map, winner, setWinner, bribeStage, isMapOpen, toggleIsMapOpen }: MiniMapProps) => {
    const {
        streamDimensions: { width, height },
    } = useDimension()
    const [enlarged, toggleEnlarged] = useToggle()
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: MINI_MAP_DEFAULT_WIDTH,
        height: MINI_MAP_DEFAULT_HEIGHT,
    })

    const theme = useTheme()

    // For targeting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)

    const isTargeting = winner && !timeReachZero && !submitted && bribeStage?.phase == "LOCATION_SELECT"

    useEffect(() => {
        if (width <= 0 || height <= 0) return
        // 25px is room for padding so the map doesnt grow bigger than the stream dimensions
        const newWidth = isTargeting ? Math.min(width - 25, 1000) : enlarged ? width - 25 : MINI_MAP_DEFAULT_WIDTH
        const newHeight = isTargeting ? Math.min(height - 25, 700) : enlarged ? height - 120 : MINI_MAP_DEFAULT_HEIGHT
        setDimensions({ width: newWidth, height: newHeight })
    }, [width, height, enlarged])

    useEffect(() => {
        const endTime = winner?.end_time

        if (endTime) {
            setSubmitted(false)
            setTimeReachZero(false)
        }
    }, [winner])

    useEffect(() => {
        if (winner && bribeStage?.phase == "LOCATION_SELECT") {
            toggleEnlarged(true)
            toggleIsMapOpen(true)
        }
    }, [winner, bribeStage])

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
            ? [Math.round(-(width - dimensions.width - 25) / 2), Math.round(-(height - dimensions.height - 5) / 1.2)]
            : [0, 0],
        from: { xy: [0, 0] },
        config: { duration: 200 },
    })

    if (!map) return null

    const onResize = (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
        const { size } = data || { size: { width: dimensions.width, height: dimensions.height } }
        setDimensions({ width: size.width, height: size.width / 1.0625 })
    }

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                pointerEvents: "none",
                zIndex: 32,
                filter: "drop-shadow(0 3px 3px #00000050)",
            }}
        >
            <Resizable
                height={dimensions.height}
                width={dimensions.width}
                minConstraints={[MINI_MAP_DEFAULT_WIDTH, MINI_MAP_DEFAULT_HEIGHT]}
                maxConstraints={[Math.min(height, 637.5), Math.min(height - 25, 637.5)]}
                onResize={onResize}
                resizeHandles={["nw"]}
                handle={() => (
                    <Box
                        sx={{
                            display: !isMapOpen ? "none" : enlarged ? "none" : "unset",
                            pointerEvents: "all",
                            position: "absolute",
                            top: ".95rem",
                            left: "1rem",
                            cursor: "nwse-resize",
                            color: colors.text,
                            opacity: 0.8,
                            zIndex: 50,
                        }}
                    >
                        <SvgResizeXY size="1.1rem" sx={{ transform: "rotate(90deg)" }} />
                    </Box>
                )}
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
                                        borderThickness: ".3rem",
                                        borderColor: isTargeting
                                            ? winner.game_ability.colour
                                            : theme.factionTheme.primary,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            boxShadow: 1,
                                            width: dimensions.width,
                                            height: dimensions.height,
                                            transition: "all .2s",
                                            background: `repeating-linear-gradient(45deg,#000000,#000000 7px,${colors.darkNavy} 7px,${colors.darkNavy} 14px )`,
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                left: enlarged ? ".5rem" : "2.5rem",
                                                top: 0,
                                                color: colors.text,
                                                opacity: 0.8,
                                                zIndex: 50,
                                            }}
                                            onClick={() => toggleEnlarged()}
                                        >
                                            <SvgMapEnlarge size="1.3rem" />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                left: enlarged ? "2.5rem" : "4.8rem",
                                                top: 0,
                                                color: colors.text,
                                                opacity: 0.8,
                                                zIndex: 50,
                                            }}
                                            onClick={() => toggleIsMapOpen()}
                                        >
                                            <SvgHide size="1.3rem" />
                                        </IconButton>

                                        {isTargeting && (
                                            <TargetTimerCountdown
                                                gameAbility={winner.game_ability}
                                                setTimeReachZero={setTimeReachZero}
                                                endTime={winner.end_time}
                                            />
                                        )}

                                        {isTargeting ? (
                                            <InteractiveMap
                                                gameAbility={winner.game_ability}
                                                windowDimension={dimensions}
                                                targeting
                                                setSubmitted={setSubmitted}
                                                enlarged={enlarged}
                                            />
                                        ) : (
                                            <InteractiveMap windowDimension={dimensions} enlarged={enlarged} />
                                        )}

                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                px: "1rem",
                                                pt: ".8rem",
                                                pb: ".6rem",
                                                backgroundColor: shadeColor(
                                                    isTargeting
                                                        ? winner.game_ability.colour
                                                        : theme.factionTheme.primary,
                                                    -86,
                                                ),
                                                boxShadow: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: "fontWeightBold",
                                                    lineHeight: 1,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {map.name.replace(/([A-Z])/g, " $1").trim()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ClipThing>
                            </Box>
                        </Fade>
                    </Box>
                </animated.div>
            </Resizable>
        </Box>
    )
}
