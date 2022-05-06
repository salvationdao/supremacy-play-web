import { Box, Fade, Theme, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing, MapSelection, MiniMapInside, ResizeBox, TargetTimerCountdown, TopIconSettings } from ".."
import { SvgResizeXY } from "../../assets"
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { BribeStageResponse, Severity, useDimension, useGame, useOverlayToggles, useSnackbar, WinnerAnnouncementResponse } from "../../containers"
import { useToggle } from "../../hooks"
import { colors, siteZIndex } from "../../theme/theme"
import { Dimension, Map, PlayerAbility } from "../../types"
import { TargetHint } from "./MapOutsideItems/TargetHint"

export const MiniMap = () => {
    const theme = useTheme<Theme>()
    const { newSnackbarMessage } = useSnackbar()
    const { map, winner, setWinner, playerAbility, setPlayerAbility, bribeStage, setHighlightedMechHash } = useGame()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()
    const [isRender, toggleIsRender] = useToggle(isMapOpen)

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        if (bribeStage !== undefined && bribeStage.phase !== "HOLD") {
            toggleShow(true)
        } else {
            toggleShow(false)
            setPlayerAbility(undefined)
            setWinner(undefined)
        }
    }, [bribeStage, toggleShow])
    // End ****************************************

    // A little timeout so fade transition can play
    useEffect(() => {
        if (isMapOpen) return toggleIsRender(true)
        const timeout = setTimeout(() => {
            toggleIsRender(false)
        }, 250)

        return () => clearTimeout(timeout)
    }, [isMapOpen, toggleIsRender])

    useEffect(() => {
        if ((winner && bribeStage?.phase == "LOCATION_SELECT") || playerAbility) {
            toggleIsMapOpen(true)
            setHighlightedMechHash(undefined)
        }
    }, [winner, bribeStage, playerAbility, toggleIsMapOpen, setHighlightedMechHash])

    const mapRender = useMemo(
        () => (
            <MiniMapInner
                map={map}
                winner={winner}
                setWinner={setWinner}
                playerAbility={playerAbility}
                setPlayerAbility={setPlayerAbility}
                bribeStage={bribeStage}
                isMapOpen={isMapOpen && show}
                toggleIsMapOpen={toggleIsMapOpen}
                newSnackbarMessage={newSnackbarMessage}
                factionColor={theme.factionTheme.primary}
            />
        ),
        [map, winner, setWinner, playerAbility, setPlayerAbility, bribeStage, isMapOpen, toggleIsMapOpen, newSnackbarMessage, theme, show],
    )

    if (!isRender) return null
    return <>{mapRender}</>
}

interface InnerProps {
    map?: Map
    winner?: WinnerAnnouncementResponse
    setWinner: (winner?: WinnerAnnouncementResponse) => void
    playerAbility?: PlayerAbility
    setPlayerAbility: React.Dispatch<React.SetStateAction<PlayerAbility | undefined>>
    bribeStage?: BribeStageResponse
    isMapOpen: boolean
    toggleIsMapOpen: (open?: boolean) => void
    factionColor: string
    newSnackbarMessage: (message: string, severity?: Severity) => void
}

const MiniMapInner = ({
    map,
    winner,
    setWinner,
    playerAbility,
    setPlayerAbility,
    bribeStage,
    isMapOpen,
    toggleIsMapOpen,
    factionColor,
    newSnackbarMessage,
}: InnerProps) => {
    const {
        remToPxRatio,
        gameUIDimensions: { width, height },
    } = useDimension()
    const [enlarged, toggleEnlarged] = useToggle()
    const [isTargeting2, toggleIsTargeting2] = useToggle(true)
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
    const [selection, setSelection] = useState<MapSelection>()

    const adjustment = useMemo(() => Math.min(remToPxRatio, 9) / 9, [remToPxRatio])

    const isTargeting = useMemo(
        () => isTargeting2 && ((winner && bribeStage?.phase == "LOCATION_SELECT") || playerAbility) && !timeReachZero && !submitted,
        [isTargeting2, winner, playerAbility, timeReachZero, submitted, bribeStage?.phase],
    )

    // Set initial size
    useEffect(() => {
        if (!map) return
        const ratio = map ? map.height / map.width : 1
        const defaultRes = {
            width: MINI_MAP_DEFAULT_SIZE * adjustment,
            height: MINI_MAP_DEFAULT_SIZE * ratio * adjustment + 2.4 * remToPxRatio,
        }

        setDefaultDimensions(defaultRes)
        setDimensions((prev) => {
            return { width: prev.width, height: prev.width * ratio }
        })
        setMapHeightWidthRatio(ratio)
    }, [map, adjustment, remToPxRatio])

    useEffect(() => {
        if (width <= 0 || height <= 0) return
        // 25px is room for padding so the map doesnt grow bigger than the stream dimensions
        // 110px is approx the height of the mech stats
        const maxWidth = Math.min(width - 25, 900)
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
        // NOTE: need to skip the lint or the map will keep resetting to small size on new battle
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, enlarged, adjustment])

    useEffect(() => {
        setSubmitted(false)
        setTimeReachZero(false)
    }, [winner, playerAbility])

    useEffect(() => {
        if (winner && bribeStage?.phase === "LOCATION_SELECT") {
            // If battle ability is overriding player ability selection
            if (playerAbility) {
                toggleIsTargeting2(false)
                toggleEnlarged(false)
                const t = setTimeout(() => {
                    toggleEnlarged(true)
                    toggleIsTargeting2(true)
                }, 1000)
                return () => clearTimeout(t)
            } else {
                toggleEnlarged(true)
            }
        } else if (playerAbility) {
            toggleEnlarged(true)
        }
        setSelection(undefined)
    }, [winner, bribeStage, playerAbility, toggleEnlarged])

    useEffect(() => {
        if (winner) {
            // If is a battle ability
            if (timeReachZero || submitted) {
                toggleEnlarged(false)
                setWinner(undefined)
                console.log("cleared winner")
                if (playerAbility) {
                    setSubmitted(false)
                    setTimeReachZero(false)
                }
            }

            if (timeReachZero) {
                newSnackbarMessage("Failed to submit target location on time.", "error")
            }
        } else {
            // Else, its a player ability
            if (submitted) {
                toggleEnlarged(false)
                setPlayerAbility(undefined)
            }
        }
    }, [timeReachZero, submitted, setPlayerAbility, setWinner, toggleEnlarged, newSnackbarMessage])

    const mainColor = useMemo(() => {
        if (isTargeting) {
            if (winner) {
                return winner.game_ability.colour
            } else if (playerAbility) {
                return playerAbility.colour
            }
        }
        return factionColor
    }, [isTargeting, winner, factionColor, playerAbility])

    const mapInsideRender = useMemo(() => {
        if (isTargeting) {
            if (winner) {
                return (
                    <MiniMapInside
                        gameAbility={winner.game_ability}
                        containerDimensions={{ width: dimensions.width, height: dimensions.height - 2.4 * remToPxRatio }}
                        targeting
                        setSubmitted={setSubmitted}
                        selection={selection}
                        setSelection={setSelection}
                        enlarged={enlarged || dimensions.width > 450}
                        newSnackbarMessage={newSnackbarMessage}
                    />
                )
            } else if (playerAbility) {
                return (
                    <MiniMapInside
                        playerAbility={playerAbility}
                        containerDimensions={{ width: dimensions.width, height: dimensions.height - 2.4 * remToPxRatio }}
                        targeting
                        setSubmitted={setSubmitted}
                        selection={selection}
                        setSelection={setSelection}
                        enlarged={enlarged || dimensions.width > 450}
                        newSnackbarMessage={newSnackbarMessage}
                        onCancel={() => {
                            toggleEnlarged(false)
                            setPlayerAbility(undefined)
                        }}
                    />
                )
            }
        } else {
            return (
                <MiniMapInside
                    containerDimensions={{ width: dimensions.width, height: dimensions.height - 2.4 * remToPxRatio }}
                    enlarged={enlarged || dimensions.width > 388}
                    newSnackbarMessage={newSnackbarMessage}
                    selection={selection}
                    setSelection={setSelection}
                />
            )
        }
    }, [isTargeting, winner, playerAbility, setPlayerAbility, dimensions, remToPxRatio, enlarged, toggleEnlarged, newSnackbarMessage, selection])

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
                zIndex: siteZIndex.MiniMap,
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
                                zIndex: siteZIndex.MiniMap,
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

                                {isTargeting && !winner && playerAbility && <TargetHint playerAbility={playerAbility} />}

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
