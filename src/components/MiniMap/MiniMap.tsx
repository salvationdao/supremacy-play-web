import { Box, Fade, Theme, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing, MiniMapInside, ResizeBox, TargetTimerCountdown, TopIconSettings } from ".."
import { SvgResizeXY } from "../../assets"
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { useDimension, useGame, useOverlayToggles, BribeStageResponse, WinnerAnnouncementResponse, useSnackbar, Severity } from "../../containers"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { Dimension, Map } from "../../types"

interface MiniMapProps {
    map?: Map
    winner?: WinnerAnnouncementResponse
    setWinner: (winner?: WinnerAnnouncementResponse) => void
    bribeStage?: BribeStageResponse
    isMapOpen: boolean
    toggleIsMapOpen: (open?: boolean) => void
    factionColor: string
    newSnackbarMessage: (message: string, severity?: Severity) => void
}

export const MiniMap = () => {
    const theme = useTheme<Theme>()
    const { newSnackbarMessage } = useSnackbar()
    const { map, winner, setWinner, bribeStage } = useGame()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()
    const [isRender, toggleIsRender] = useToggle(isMapOpen)

    // A little timeout so fade transition can play
    useEffect(() => {
        if (isMapOpen) return toggleIsRender(true)
        const timeout = setTimeout(() => {
            toggleIsRender(false)
        }, 250)

        return () => clearTimeout(timeout)
    }, [isMapOpen])

    useEffect(() => {
        if (winner && bribeStage?.phase == "LOCATION_SELECT") {
            toggleIsMapOpen(true)
        }
    }, [winner, bribeStage])

    const mapRender = useMemo(
        () => (
            <MiniMapInner
                map={map}
                winner={winner}
                setWinner={setWinner}
                bribeStage={bribeStage}
                isMapOpen={isMapOpen}
                toggleIsMapOpen={toggleIsMapOpen}
                newSnackbarMessage={newSnackbarMessage}
                factionColor={theme.factionTheme.primary}
            />
        ),
        [map, winner, setWinner, bribeStage, isMapOpen, toggleIsMapOpen, newSnackbarMessage, theme],
    )

    if (!isRender) return null
    return <>{mapRender}</>
}

const MiniMapInner = ({ map, winner, setWinner, bribeStage, isMapOpen, toggleIsMapOpen, factionColor, newSnackbarMessage }: MiniMapProps) => {
    const {
        remToPxRatio,
        gameUIDimensions: { width, height },
    } = useDimension()
    const theme = useTheme()

    const [enlarged, toggleEnlarged] = useToggle()
    const [mapHeightWidthRatio, setMapHeightWidthRatio] = useState(1)
    const [defaultDimensions, setDefaultDimensions] = useState<Dimension>({
        width: MINI_MAP_DEFAULT_SIZE,
        height: MINI_MAP_DEFAULT_SIZE,
    })
    const [dimensions, setDimensions] = useState<Dimension>({
        width: MINI_MAP_DEFAULT_SIZE,
        height: MINI_MAP_DEFAULT_SIZE,
    })

    // For targeting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)

    const adjustment = useMemo(() => Math.min(remToPxRatio, 9) / 9, [remToPxRatio])

    const isTargeting = useMemo(
        () => winner && !timeReachZero && !submitted && bribeStage?.phase == "LOCATION_SELECT",
        [winner, timeReachZero, submitted, bribeStage],
    )

    // Set initial size
    useEffect(() => {
        if (!map) return
        const ratio = map ? map.height / map.width : 1
        const defaultRes = {
            width: MINI_MAP_DEFAULT_SIZE * adjustment,
            height: MINI_MAP_DEFAULT_SIZE * ratio * adjustment + 2.4 * remToPxRatio,
        }
        const res = { width: dimensions.width, height: dimensions.width * ratio }
        setDefaultDimensions(defaultRes)
        setDimensions(res)
        setMapHeightWidthRatio(ratio)
    }, [map, adjustment])

    useEffect(() => {
        if (width <= 0 || height <= 0) return
        // 25px is room for padding so the map doesnt grow bigger than the stream dimensions
        // 110px is approx the height of the mech stats
        const maxWidth = Math.min(width - 25, 1200)
        const maxHeight = Math.min(height - 110 - 12.5, maxWidth * mapHeightWidthRatio)
        let targetingWidth = Math.min(maxWidth, 900)
        let targetingHeight = targetingWidth * mapHeightWidthRatio

        if (targetingHeight > maxHeight) {
            targetingHeight = Math.min(maxHeight, 700)
            targetingWidth = targetingHeight / mapHeightWidthRatio
        }

        const newWidth = isTargeting ? targetingWidth : enlarged ? maxWidth : defaultDimensions.width * adjustment
        const newHeight = isTargeting ? targetingHeight : enlarged ? maxHeight : defaultDimensions.height * adjustment
        setDimensions({ width: newWidth, height: newHeight })
    }, [width, height, enlarged, adjustment])

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
        }
    }, [winner, bribeStage])

    useEffect(() => {
        if (timeReachZero || submitted) {
            toggleEnlarged(false)
            setWinner(undefined)
        }

        if (timeReachZero) {
            newSnackbarMessage("Failed to submit target location on time.", "error")
        }
    }, [timeReachZero, submitted])

    const mainColor = useMemo(() => (isTargeting && winner ? winner.game_ability.colour : factionColor), [isTargeting, winner, theme, factionColor])

    const mapInsideRender = useMemo(() => {
        if (isTargeting && winner) {
            return (
                <MiniMapInside
                    gameAbility={winner.game_ability}
                    containerDimensions={{ width: dimensions.width, height: dimensions.height - 2.4 * remToPxRatio }}
                    targeting
                    setSubmitted={setSubmitted}
                    enlarged={enlarged || dimensions.width > 450}
                    newSnackbarMessage={newSnackbarMessage}
                />
            )
        } else {
            return (
                <MiniMapInside
                    containerDimensions={{ width: dimensions.width, height: dimensions.height - 2.4 * remToPxRatio }}
                    enlarged={enlarged || dimensions.width > 450}
                    newSnackbarMessage={newSnackbarMessage}
                />
            )
        }
    }, [isTargeting, winner, dimensions, remToPxRatio, setSubmitted, enlarged, newSnackbarMessage])

    if (!map) return null

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
                    adjustment={adjustment}
                    onResizeStop={setDimensions}
                    initialDimensions={[dimensions.width, dimensions.height]}
                    minConstraints={[defaultDimensions.width, defaultDimensions.height]}
                    maxConstraints={[Math.min(width - 25, 638), Math.min(height - 25, 638)]}
                    resizeHandles={["nw"]}
                    handle={() => (
                        <Box
                            sx={{
                                display: !isMapOpen ? "none" : enlarged ? "none" : "unset",
                                pointerEvents: "all",
                                position: "absolute",
                                top: ".75rem",
                                left: "1.15rem",
                                cursor: "nwse-resize",
                                color: colors.text,
                                opacity: 0.8,
                                zIndex: 50,
                            }}
                        >
                            <SvgResizeXY size="1rem" sx={{ transform: "rotate(90deg)" }} />
                        </Box>
                    )}
                />

                <Fade in={isMapOpen}>
                    <Box>
                        <ClipThing
                            clipSize="10px"
                            border={{
                                isFancy: true,
                                borderThickness: ".2rem",
                                borderColor: mainColor,
                            }}
                            backgroundColor={colors.darkNavy}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    boxShadow: 1,
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    transition: "all .2s",
                                    overflow: "hidden",
                                }}
                            >
                                <TopIconSettings
                                    map={map}
                                    enlarged={enlarged}
                                    mainColor={mainColor}
                                    toggleEnlarged={toggleEnlarged}
                                    toggleIsMapOpen={toggleIsMapOpen}
                                />

                                {mapInsideRender}

                                {isTargeting && winner && (
                                    <TargetTimerCountdown gameAbility={winner.game_ability} setTimeReachZero={setTimeReachZero} endTime={winner.end_time} />
                                )}
                            </Box>
                        </ClipThing>
                    </Box>
                </Fade>
            </Box>
        </Box>
    )
}
