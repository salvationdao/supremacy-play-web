import { Box, Fade, IconButton, Typography, useTheme } from "@mui/material"
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react"
import { Resizable, ResizeCallbackData } from "react-resizable"
import { ClipThing, InteractiveMap, ResizeBox, TargetTimerCountdown } from ".."
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
    const theme = useTheme()

    const [enlarged, toggleEnlarged] = useToggle()
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: MINI_MAP_DEFAULT_WIDTH,
        height: MINI_MAP_DEFAULT_HEIGHT,
    })

    // For targeting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)

    const isTargeting = winner && !timeReachZero && !submitted && bribeStage?.phase == "LOCATION_SELECT"

    useEffect(() => {
        if (width <= 0 || height <= 0) return
        // 25px is room for padding so the map doesnt grow bigger than the stream dimensions
        // 110px is approx the height of the mech stats
        const newWidth = isTargeting ? Math.min(width - 25, 1000) : enlarged ? width - 25 : MINI_MAP_DEFAULT_WIDTH
        const newHeight = isTargeting
            ? Math.min(height - 25, 700)
            : enlarged
            ? height - 110 - 12.5
            : MINI_MAP_DEFAULT_HEIGHT
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

    if (!map) return null

    const mainColor = isTargeting ? winner.game_ability.colour : theme.factionTheme.primary

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: enlarged ? 110 : "1rem",
                right: enlarged ? (width - dimensions.width) / 2 - 3 : "1rem",
                pointerEvents: "none",
                filter: "drop-shadow(0 3px 3px #00000050)",
                transition: "all .2s",
                zIndex: 32,
            }}
        >
            <Box sx={{ position: "relative", pointerEvents: "all" }}>
                <ResizeBox
                    sx={{ bottom: 0, right: 0 }}
                    color={mainColor}
                    onResizeStop={setDimensions}
                    minConstraints={[MINI_MAP_DEFAULT_WIDTH, MINI_MAP_DEFAULT_HEIGHT]}
                    maxConstraints={[Math.min(width - 25, 638), Math.min(height - 25, 638)]}
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
                />

                <Fade in={isMapOpen}>
                    <Box>
                        <ClipThing
                            clipSize="10px"
                            border={{
                                isFancy: true,
                                borderThickness: ".3rem",
                                borderColor: mainColor,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    boxShadow: 1,
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    transition: "all .2s",
                                    overflow: "hidden",
                                    background: `repeating-linear-gradient(45deg,#000000,#000000 7px,${colors.darkNavy} 7px,${colors.darkNavy} 14px )`,
                                }}
                            >
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
                                        backgroundColor: shadeColor(mainColor, -86),
                                        boxShadow: 2,
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
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            lineHeight: 1,
                                            textAlign: "center",
                                        }}
                                    >
                                        {map.name
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()
                                            .toUpperCase()}
                                    </Typography>
                                </Box>
                            </Box>
                        </ClipThing>
                    </Box>
                </Fade>
            </Box>
        </Box>
    )
}
