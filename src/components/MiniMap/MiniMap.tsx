import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { MiniMapInside, MoveableResizable, TargetTimerCountdown } from ".."
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { BribeStageResponse, useDimension, useGame, useOverlayToggles, useSnackbar, WinnerAnnouncementResponse } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts } from "../../theme/theme"
import { Map } from "../../types"
import { MoveableResizableConfig, useMoveableResizable } from "../Common/MoveableResizable/MoveableResizableContainer"

export const MiniMap = () => {
    const { map, winner, setWinner, bribeStage } = useGame()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()
    const [isRender, toggleIsRender] = useToggle(isMapOpen)

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        toggleShow(bribeStage !== undefined && bribeStage.phase !== "HOLD")
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
        if (winner && bribeStage?.phase == "LOCATION_SELECT") {
            toggleIsMapOpen(true)
        }
    }, [winner, bribeStage, toggleIsMapOpen])

    // Map
    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "minimap",
            // Defaults
            defaultPosX: 10,
            defaultPosY: 10,
            defaultWidth: MINI_MAP_DEFAULT_SIZE,
            defaultHeight: MINI_MAP_DEFAULT_SIZE,
            // Position limits
            minPosX: 10,
            minPosY: 10,
            // Size limits
            minWidth: 300,
            minHeight: 280,
            maxWidth: 1000,
            maxHeight: 1000,
            // Others
            infoTooltipText: "Battle arena minimap.",
            onHideCallback: () => toggleIsMapOpen(false),
        }),
        [toggleIsMapOpen],
    )

    const mapRender = useMemo(() => {
        if (!map) return null

        return (
            <Fade in={isMapOpen && show}>
                <Box>
                    <MoveableResizable config={config}>
                        <MiniMapInner map={map} winner={winner} setWinner={setWinner} bribeStage={bribeStage} />
                    </MoveableResizable>
                </Box>
            </Fade>
        )
    }, [map, isMapOpen, show, config, winner, setWinner, bribeStage])

    if (!isRender) return null
    return mapRender
}

interface MiniMapInnerProps {
    map: Map
    winner?: WinnerAnnouncementResponse
    setWinner: (winner?: WinnerAnnouncementResponse) => void
    bribeStage?: BribeStageResponse
}

const MiniMapInner = ({ map, winner, setWinner, bribeStage }: MiniMapInnerProps) => {
    const { newSnackbarMessage } = useSnackbar()

    // For targeting map
    const [timeReachZero, setTimeReachZero] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)

    const isTargeting = useMemo(
        () => winner && !timeReachZero && !submitted && bribeStage?.phase == "LOCATION_SELECT",
        [winner, timeReachZero, submitted, bribeStage],
    )

    useEffect(() => {
        if (winner?.end_time) {
            setSubmitted(false)
            setTimeReachZero(false)
        }
    }, [winner])

    useEffect(() => {
        if (timeReachZero || submitted) setWinner(undefined)
        if (timeReachZero) newSnackbarMessage("Failed to submit target location on time.", "error")
    }, [timeReachZero, submitted, setWinner, newSnackbarMessage])

    // For map rendering
    const theme = useTheme()
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    const {
        curWidth,
        curHeight,
        curPosX,
        curPosY,
        defaultWidth,
        defaultHeight,
        maxWidth,
        maxHeight,
        setCurWidth,
        setCurHeight,
        setCurPosX,
        setCurPosY,
        setDefaultWidth,
        setDefaultHeight,
    } = useMoveableResizable()
    const mapHeightWidthRatio = useRef(1)
    const prevWidth = useRef(curWidth)
    const prevHeight = useRef(curHeight)
    const prevPosX = useRef(curPosX)
    const prevPosY = useRef(curPosY)

    // Set initial size
    useEffect(() => {
        const ratio = map.height / map.width
        const defaultW = defaultWidth
        const defaultH = defaultHeight * ratio

        setDefaultWidth(defaultW)
        setDefaultHeight(defaultH)
        setCurHeight(curWidth * ratio)
        mapHeightWidthRatio.current = ratio
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, setDefaultWidth, setDefaultHeight, setCurHeight])

    // When it's targetting, enlarge the map and move to center of screen, else restore to the prev dimensions
    useEffect(() => {
        if (isTargeting) {
            const maxW = Math.min(width - 25, maxWidth || width, 900)
            const maxH = Math.min(maxW * mapHeightWidthRatio.current, maxHeight || height, height - 120)
            let targetingWidth = Math.min(maxW, 900)
            let targetingHeight = targetingWidth * mapHeightWidthRatio.current

            if (targetingHeight > maxH) {
                targetingHeight = Math.min(maxH, 700)
                targetingWidth = targetingHeight / mapHeightWidthRatio.current
            }

            setCurPosX((prev1) => {
                prevPosX.current = prev1

                setCurWidth((prev2) => {
                    prevWidth.current = prev2
                    return targetingWidth
                })

                return (width - targetingWidth) / 2
            })
            setCurPosY((prev1) => {
                prevPosY.current = prev1

                setCurHeight((prev2) => {
                    prevHeight.current = prev2
                    return targetingHeight
                })

                return (height - targetingHeight) / 2
            })
        } else {
            setCurPosX(() => {
                setCurWidth(prevWidth.current)
                return prevPosX.current
            })
            setCurPosY(() => {
                setCurHeight(prevHeight.current)
                return prevPosY.current
            })
        }
    }, [height, isTargeting, maxHeight, maxWidth, setCurHeight, setCurPosX, setCurPosY, setCurWidth, width])

    let mapName = map.name
    if (mapName === "NeoTokyo") mapName = "City Block X2"

    return useMemo(
        () => (
            <Box
                sx={{
                    position: "relative",
                    boxShadow: 1,
                    width: curWidth,
                    height: curHeight,
                    transition: "all .2s",
                    overflow: "hidden",
                    pointerEvents: "all",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: "3.1rem",
                        px: "1.8rem",
                        backgroundColor: "#000000BF",
                        borderBottom: `${theme.factionTheme.primary}80 .25rem solid`,
                        zIndex: 99,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            lineHeight: 1,
                            opacity: 0.8,
                        }}
                    >
                        {mapName
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .toUpperCase()}
                    </Typography>
                </Stack>

                {isTargeting && winner ? (
                    <>
                        <MiniMapInside
                            gameAbility={winner.game_ability}
                            containerDimensions={{ width: curWidth, height: curHeight }}
                            targeting
                            setSubmitted={setSubmitted}
                            enlarged={curWidth > 388 || curHeight > 400}
                            newSnackbarMessage={newSnackbarMessage}
                        />

                        <TargetTimerCountdown gameAbility={winner.game_ability} setTimeReachZero={setTimeReachZero} endTime={winner.end_time} />
                    </>
                ) : (
                    <MiniMapInside
                        containerDimensions={{ width: curWidth, height: curHeight }}
                        enlarged={curWidth > 388 || curHeight > 400}
                        newSnackbarMessage={newSnackbarMessage}
                    />
                )}
            </Box>
        ),
        [curHeight, curWidth, isTargeting, mapName, newSnackbarMessage, theme.factionTheme.primary, winner],
    )
}
