import { Box, Fade, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing, MiniMapInside, ResizeBox, TargetTimerCountdown, TopIconSettings } from ".."
import { SvgResizeXY } from "../../assets"
import { MINI_MAP_DEFAULT_HEIGHT, MINI_MAP_DEFAULT_WIDTH } from "../../constants"
import {
    useDimension,
    useGame,
    useOverlayToggles,
    BribeStageResponse,
    WinnerAnnouncementResponse,
} from "../../containers"
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
                bottom: enlarged ? "calc(50% + 50px)" : "1rem",
                right: enlarged ? (width - dimensions.width) / 2 - 3 : "1rem",
                transform: enlarged ? "translateY(50%)" : "none",
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
                    initialDimensions={[dimensions.width, dimensions.height]}
                    minConstraints={[MINI_MAP_DEFAULT_WIDTH, MINI_MAP_DEFAULT_HEIGHT]}
                    maxConstraints={[Math.min(width - 25, 638), Math.min(height - 25, 638)]}
                    resizeHandles={["nw"]}
                    handle={() => (
                        <Box
                            sx={{
                                display: !isMapOpen ? "none" : enlarged ? "none" : "unset",
                                pointerEvents: "all",
                                position: "absolute",
                                top: ".85rem",
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
                                {isTargeting ? (
                                    <MiniMapInside
                                        gameAbility={winner.game_ability}
                                        containerDimensions={dimensions}
                                        targeting
                                        setSubmitted={setSubmitted}
                                        enlarged={enlarged}
                                    />
                                ) : (
                                    <MiniMapInside containerDimensions={dimensions} enlarged={enlarged} />
                                )}

                                <TopIconSettings
                                    map={map}
                                    enlarged={enlarged}
                                    mainColor={mainColor}
                                    toggleEnlarged={toggleEnlarged}
                                    toggleIsMapOpen={toggleIsMapOpen}
                                />

                                {isTargeting && (
                                    <TargetTimerCountdown
                                        gameAbility={winner.game_ability}
                                        setTimeReachZero={setTimeReachZero}
                                        endTime={winner.end_time}
                                    />
                                )}
                            </Box>
                        </ClipThing>
                    </Box>
                </Fade>
            </Box>
        </Box>
    )
}
