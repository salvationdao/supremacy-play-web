import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { MapSelection, MiniMapInside, MoveableResizable, TargetTimerCountdown } from ".."
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { Severity, useAuth, useDimension, useGame, useOverlayToggles, useSnackbar, useSupremacy, WinnerAnnouncementResponse } from "../../containers"
import { useConsumables } from "../../containers/consumables"
import { useMiniMap } from "../../containers/minimap"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts } from "../../theme/theme"
import { Faction, Map, PlayerAbility, WarMachineState } from "../../types"
import { MoveableResizableConfig, useMoveableResizable } from "../Common/MoveableResizable/MoveableResizableContainer"
import { TargetHint } from "./MapOutsideItems/TargetHint"

export const MiniMap = () => {
    const theme = useTheme()
    const { userID, factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { newSnackbarMessage } = useSnackbar()
    const { map, bribeStage, warMachines } = useGame()
    const { winner, setWinner, enlarged, setEnlarged, isTargeting, selection, setSelection, resetSelection, highlightedMechHash, setHighlightedMechHash } =
        useMiniMap()
    const { playerAbility, setPlayerAbility } = useConsumables()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()
    const [isRender, toggleIsRender] = useToggle(isMapOpen)

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        if (bribeStage && bribeStage.phase !== "HOLD") {
            toggleShow(true)
        } else {
            toggleShow(false)
            setPlayerAbility(undefined)
            setWinner(undefined)
        }
    }, [bribeStage, toggleShow, setPlayerAbility, setWinner])
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
            minWidth: 225,
            minHeight: 225,
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
                        <MiniMapInner
                            // useGameServerAuth
                            userID={userID}
                            factionID={factionID}
                            // useOverlay
                            isMapOpen={isMapOpen && show}
                            toggleIsMapOpen={toggleIsMapOpen}
                            // useGame
                            map={map}
                            warMachines={warMachines}
                            // useSupremacy
                            getFaction={getFaction}
                            // useMiniMap
                            winner={winner}
                            enlarged={enlarged}
                            setEnlarged={setEnlarged}
                            isTargeting={isTargeting}
                            selection={selection}
                            setSelection={setSelection}
                            resetSelection={resetSelection}
                            highlightedMechHash={highlightedMechHash}
                            setHighlightedMechHash={setHighlightedMechHash}
                            // useConsumables
                            playerAbility={playerAbility}
                            // useSnackbar
                            newSnackbarMessage={newSnackbarMessage}
                            // useTheme
                            factionColor={theme.factionTheme.primary}
                        />
                    </MoveableResizable>
                </Box>
            </Fade>
        )
    }, [
        config,
        show,
        userID,
        factionID,
        isMapOpen,
        toggleIsMapOpen,
        map,
        warMachines,
        getFaction,
        winner,
        enlarged,
        setEnlarged,
        isTargeting,
        selection,
        setSelection,
        resetSelection,
        highlightedMechHash,
        setHighlightedMechHash,
        playerAbility,
        newSnackbarMessage,
        theme,
    ])

    if (!isRender) return null
    return mapRender
}

interface InnerProps {
    // useGameServerAuth
    userID?: string
    factionID?: string
    // useOverlay
    isMapOpen: boolean // *
    toggleIsMapOpen: (open?: boolean) => void // *
    // useGame
    map: Map
    warMachines?: WarMachineState[]
    // useSupremacy
    getFaction: (factionID: string) => Faction
    // useMiniMap
    winner?: WinnerAnnouncementResponse
    enlarged: boolean
    setEnlarged: React.Dispatch<React.SetStateAction<boolean>> // *
    isTargeting: boolean
    selection?: MapSelection
    setSelection: React.Dispatch<React.SetStateAction<MapSelection | undefined>>
    resetSelection: () => void
    highlightedMechHash?: string
    setHighlightedMechHash: React.Dispatch<React.SetStateAction<string | undefined>>
    // useConsumables
    playerAbility?: PlayerAbility
    // useSnackbar
    newSnackbarMessage: (message: string, severity?: Severity) => void
    // useTheme
    factionColor: string
}

const MiniMapInner = ({
    userID,
    factionID,
    map,
    warMachines,
    getFaction,
    winner,
    enlarged,
    isTargeting,
    selection,
    setSelection,
    resetSelection,
    highlightedMechHash,
    setHighlightedMechHash,
    playerAbility,
    newSnackbarMessage,
    factionColor,
}: InnerProps) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTargeting, maxHeight, maxWidth, setCurHeight, setCurPosX, setCurPosY, setCurWidth])

    const mapInsideRender = useMemo(() => {
        return (
            <MiniMapInside
                gameAbility={winner?.game_ability}
                containerDimensions={{ width: curWidth, height: curHeight }}
                userID={userID}
                factionID={factionID}
                map={map}
                warMachines={warMachines}
                getFaction={getFaction}
                enlarged={curWidth > 388 || curHeight > 400}
                isTargeting={isTargeting}
                selection={selection}
                setSelection={setSelection}
                resetSelection={resetSelection}
                highlightedMechHash={highlightedMechHash}
                setHighlightedMechHash={setHighlightedMechHash}
                playerAbility={!winner?.game_ability ? playerAbility : undefined}
                newSnackbarMessage={newSnackbarMessage}
            />
        )
    }, [
        userID,
        factionID,
        map,
        warMachines,
        getFaction,
        winner,
        isTargeting,
        selection,
        setSelection,
        resetSelection,
        highlightedMechHash,
        setHighlightedMechHash,
        playerAbility,
        newSnackbarMessage,
        curHeight,
        curWidth,
    ])

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
                        height: "3.1rem",
                        px: "1.8rem",
                        backgroundColor: "#000000BF",
                        borderBottom: `${factionColor}80 .25rem solid`,
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

                {mapInsideRender}

                {isTargeting && !winner && playerAbility && <TargetHint ability={playerAbility.ability} />}

                {isTargeting && winner && (
                    <TargetTimerCountdown
                        gameAbility={winner.game_ability}
                        endTime={winner.end_time}
                        onCountdownExpired={() => {
                            newSnackbarMessage("Failed to submit target location on time.", "error")
                            resetSelection()
                        }}
                    />
                )}
            </Box>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            mapName,
            mapInsideRender,
            factionColor,
            userID,
            factionID,
            map,
            warMachines,
            getFaction,
            winner,
            enlarged,
            isTargeting,
            selection,
            setSelection,
            resetSelection,
            highlightedMechHash,
            setHighlightedMechHash,
            playerAbility,
            newSnackbarMessage,
            curHeight,
            curWidth,
        ],
    )
}
