import { Box, Stack, Typography } from "@mui/material"
import { useGesture } from "@use-gesture/react"
import moment from "moment"
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FancyButton, MapWarMachines, SelectionIcon } from ".."
import { Crosshair } from "../../assets"
import { Severity, useGame, useGameServerAuth, useGameServerWebsocket, WebSocketProperties } from "../../containers"
import { useInterval, useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { Dimension, GameAbility, GameCoords, Map, PlayerAbility, WarMachineState } from "../../types"

export interface MapSelection {
    x: number
    y: number
    mechHash?: string
}

interface Props {
    gameAbility?: GameAbility
    playerAbility?: PlayerAbility
    containerDimensions: Dimension
    targeting?: boolean
    setSubmitted?: Dispatch<SetStateAction<boolean>>
    selection?: MapSelection
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    enlarged: boolean
    newSnackbarMessage: (message: string, severity?: Severity) => void
    onCancel?: () => void
}

export const MiniMapInside = (props: Props) => {
    const { userID } = useGameServerAuth()
    const { state, send } = useGameServerWebsocket()
    const { map, warMachines, setHighlightedMechHash } = useGame()

    return (
        <MiniMapInsideInner
            {...props}
            state={state}
            send={send}
            map={map}
            warMachines={warMachines}
            setHighlightedMechHash={setHighlightedMechHash}
            userID={userID}
        />
    )
}

interface PropsInner extends Props, Partial<WebSocketProperties> {
    map?: Map
    warMachines?: WarMachineState[]
    setHighlightedMechHash: Dispatch<SetStateAction<string | undefined>>
    userID?: string
}

const MiniMapInsideInner = ({
    state,
    send,
    gameAbility,
    playerAbility,
    containerDimensions,
    targeting,
    setSubmitted,
    selection,
    setSelection,
    enlarged,
    map,
    warMachines,
    newSnackbarMessage,
    setHighlightedMechHash,
    onCancel,
    userID,
}: PropsInner) => {
    const mapElement = useRef<HTMLDivElement>()
    // Setup use-gesture props
    const [dragX, setDragX] = useState(0)
    const [dragY, setDragY] = useState(0)
    const [mapScale, setMapScale] = useState(0)
    const gestureRef = useRef<HTMLDivElement>(null)
    const [, toggleIsGesturing] = useToggle()

    const gridWidth = useMemo(() => (map ? map.width / map.cells_x : 50), [map])
    const gridHeight = useMemo(() => (map ? map.height / map.cells_y : 50), [map])

    const onConfirm = useCallback(async () => {
        if (state !== WebSocket.OPEN || !selection || !send || !userID) return
        console.log("confirmed", playerAbility?.label)
        // if (userID) return
        try {
            if (gameAbility) {
                console.info("activated game ability", gameAbility.label)
                await send<boolean, { x: number; y: number }>(GameServerKeys.SubmitAbilityLocationSelect, {
                    x: Math.floor(selection.x),
                    y: Math.floor(selection.y),
                })
            } else if (playerAbility) {
                console.info("activated player ability", playerAbility.label)
                let payload: {
                    ability_id: string
                    location_select_type: string
                    start_coords?: GameCoords
                    end_coords?: GameCoords
                    mech_hash?: string
                } | null = null
                switch (playerAbility.location_select_type) {
                    case "LINE_SELECT":
                        payload = {
                            ability_id: playerAbility.id,
                            location_select_type: playerAbility.location_select_type,
                            start_coords: {
                                x: Math.floor(selection.x),
                                y: Math.floor(selection.y),
                            },
                            end_coords: {
                                // todo
                                x: -1,
                                y: -1,
                            },
                        }
                        break
                    case "MECH_SELECT":
                        payload = {
                            ability_id: playerAbility.id,
                            location_select_type: playerAbility.location_select_type,
                            mech_hash: selection.mechHash,
                        }
                        break
                    case "LOCATION_SELECT":
                        payload = {
                            ability_id: playerAbility.id,
                            location_select_type: playerAbility.location_select_type,
                            start_coords: {
                                x: Math.floor(selection.x),
                                y: Math.floor(selection.y),
                            },
                        }
                        break
                    case "GLOBAL":
                        break
                }

                if (!payload) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }
                await send<boolean, typeof payload>(GameServerKeys.PlayerAbilityUse, payload)
            }
            newSnackbarMessage("Successfully submitted target location.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to submit target location.", "error")
            console.debug(e)
        } finally {
            setSubmitted && setSubmitted(true)
            setSelection(undefined)
            if (playerAbility?.location_select_type === "MECH_SELECT") {
                setHighlightedMechHash(undefined)
            }
        }
    }, [state, send, selection, setSubmitted, setSelection, gameAbility, playerAbility, newSnackbarMessage, setHighlightedMechHash, userID])

    const handleSelection = useCallback(
        (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
            if (mapElement && mapElement.current) {
                const rect = mapElement.current.getBoundingClientRect()
                // Mouse position
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                setSelection({
                    x: x / (gridWidth * mapScale),
                    y: y / (gridHeight * mapScale),
                })
            }
        },
        [mapElement, gridWidth, gridHeight, mapScale, setSelection],
    )

    // Set map scale to minimum scale while staying in-bounds
    useEffect(() => {
        if (!map) return
        const minScale = Math.max(containerDimensions.width / map.width, containerDimensions.height / map.height)
        setDragX(0)
        setDragY(0)
        setMapScale(minScale)
    }, [containerDimensions, map, enlarged])

    // --------------- Minimap - useGesture setup -------------------
    // Prevents map zooming from interfering with the browsers' accessibility zoom
    useEffect(() => {
        const callback: EventListenerOrEventListenerObject = (e) => e.preventDefault()

        document.addEventListener("gesturestart", callback)
        document.addEventListener("gesturechange", callback)
        document.addEventListener("gestureend", callback)

        return () => {
            document.removeEventListener("gesturestart", callback)
            document.removeEventListener("gesturechange", callback)
            document.removeEventListener("gestureend", callback)
        }
    }, [])

    // Setup map drag
    useGesture(
        {
            onDrag: ({ wheeling, cancel, offset: [x, y] }) => {
                if (wheeling || !map) return cancel()

                // Set [x,y] offset
                setDragX(Math.round(x))
                setDragY(Math.round(y))
            },
            onWheel: ({ delta: [, deltaY], pinching, wheeling, dragging, event: e }) => {
                if (pinching || dragging || !map || !wheeling) return

                const mapWidth = map.width
                const mapHeight = map.height

                // Calculate new scale
                const curScale = mapScale
                const newScale = curScale * (deltaY > 0 ? 0.96 : 1.04)

                // Cursors position in relation to the image
                const cursorX = e.offsetX
                const cursorY = e.offsetY

                // Change in x after scaling
                const displacementX = mapWidth * curScale - mapWidth * newScale

                // The ratio of image between the cursor and the side of the image (x)
                const sideRatioX = cursorX / mapWidth

                // The new position of x - keeps the ratio of image between the cursor and the edge
                const newX = dragX + displacementX * sideRatioX

                // Change in y after scaling
                const displacementY = mapHeight * curScale - mapHeight * newScale

                // The ratio of image between the cursor and the top of the image (y)
                const topRatioY = cursorY / mapHeight

                // The new position of y - keeps the ratio of image between the cursor and the top
                const newY = dragY + displacementY * topRatioY

                // Set new scale and positions
                setScale(newScale, newX, newY)
            },
            onPinch: ({ movement: [ms], dragging, wheeling, pinching }) => {
                if (dragging || wheeling || !pinching) return

                // Calculate new scale
                const curScale = mapScale
                const newScale = curScale * (ms > 0 ? 0.96 : 1.04)

                setScale(newScale, 0, 0)
            },
            onDragStart: () => {
                toggleIsGesturing(true)
            },
            onDragEnd: () => {
                toggleIsGesturing(false)
            },
            onWheelStart: () => {
                toggleIsGesturing(true)
            },
            onWheelEnd: () => {
                toggleIsGesturing(false)
            },
            onPinchStart: () => {
                toggleIsGesturing(true)
            },
            onPinchEnd: () => {
                toggleIsGesturing(false)
            },
        },
        {
            target: gestureRef,
            eventOptions: { passive: false },
            drag: {
                from: () => [dragX, dragY],
                filterTaps: true,
                preventDefault: true,
                bounds: () => {
                    if (!map) return
                    return {
                        top:
                            containerDimensions.height <= map.height * mapScale
                                ? -(map.height * mapScale - containerDimensions.height)
                                : (containerDimensions.height - map.height * mapScale) / 2,
                        left:
                            containerDimensions.width <= map.width * mapScale
                                ? -(map.width * mapScale - containerDimensions.width)
                                : (containerDimensions.width - map.width * mapScale) / 2,
                        right: 0,
                        bottom: 0,
                    }
                },
            },
            wheel: {
                preventDefault: true,
                filterTaps: true,
                threshold: 20,
            },
            pinch: {
                preventDefault: true,
                filterTaps: true,
                threshold: 20,
            },
        },
    )

    // Set the zoom of the map
    const setScale = useCallback(
        (newScale: number, newX: number, newY: number) => {
            if (!map) return
            const minScale = Math.max(containerDimensions.width / map.width, containerDimensions.height / map.height)
            const maxScale = 1
            const curScale = mapScale

            // Keeps the map within scale bounds
            if (newScale >= maxScale || minScale >= newScale) {
                newScale >= maxScale ? (newScale = maxScale) : (newScale = minScale)
            }

            // Return if the map is already at zoom limit
            if ((curScale === minScale || curScale === maxScale) && (newScale >= maxScale || minScale >= newScale)) {
                return
            }

            // Calculate the new boundary
            const xBound =
                containerDimensions.width <= map.width * newScale
                    ? -(map.width * newScale - containerDimensions.width)
                    : (containerDimensions.width - map.width * newScale) / 2
            const yBound =
                containerDimensions.height <= map.height * newScale
                    ? -(map.height * newScale - containerDimensions.height)
                    : (containerDimensions.height - map.height * newScale) / 2

            // Keep the map in-bounds
            newX = xBound >= newX ? xBound : newX > 0 ? 0 : newX
            newY = yBound >= newY ? yBound : newY > 0 ? 0 : newY

            // Set scale and [x,y] offset
            setDragX(Math.round(newX))
            setDragY(Math.round(newY))
            setMapScale(newScale)
        },
        [map, containerDimensions, mapScale],
    )

    if (!map) return null

    const locationTargeting = targeting && !(playerAbility?.location_select_type === "MECH_SELECT" || playerAbility?.location_select_type === "GLOBAL")

    return (
        <>
            <Stack
                sx={{
                    position: "relative",
                    width: containerDimensions.width,
                    height: containerDimensions.height,
                    overflow: "hidden",
                }}
            >
                <Box
                    ref={gestureRef}
                    sx={{
                        touchAction: "none",
                        transformOrigin: "0% 0%",
                        transform: `translate(${dragX}px, ${dragY}px) scale(${mapScale})`,
                    }}
                >
                    <SelectionIcon
                        key={selection && `column-${selection.y}-row-${selection.x}`}
                        gameAbility={gameAbility || playerAbility}
                        gridWidth={gridWidth}
                        gridHeight={gridHeight}
                        selection={selection}
                        setSelection={setSelection}
                        targeting={targeting}
                    />

                    <MapWarMachines
                        map={map}
                        gridWidth={gridWidth}
                        gridHeight={gridHeight}
                        warMachines={warMachines || []}
                        enlarged={enlarged}
                        targeting={targeting}
                        playerAbility={playerAbility}
                        setSelection={setSelection}
                    />

                    {/* Map Image */}
                    <Box
                        ref={mapElement}
                        onClick={locationTargeting ? handleSelection : undefined}
                        sx={{
                            position: "absolute",
                            width: `${map.width}px`,
                            height: `${map.height}px`,
                            backgroundImage: `url(${map.image_url})`,
                            cursor: locationTargeting ? `url(${Crosshair}) 10 10, auto` : "move",
                            borderSpacing: 0,
                        }}
                    />
                </Box>
            </Stack>
            {onCancel && targeting && !gameAbility && playerAbility && (
                <FancyButton
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "4px",
                        backgroundColor: colors.red,
                        border: { borderColor: colors.red },
                        sx: {
                            flex: 1,
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                        },
                    }}
                    sx={{
                        pt: ".32rem",
                        pb: ".24rem",
                        minWidth: "2rem",
                    }}
                    onClick={() => {
                        onCancel()
                        setSelection(undefined)
                    }}
                >
                    <Typography
                        sx={{
                            lineHeight: 1,
                            fontWeight: "fontWeightBold",
                            whiteSpace: "nowrap",
                            color: "#FFFFFF",
                        }}
                    >
                        Cancel
                    </Typography>
                </FancyButton>
            )}
            <CountdownText selection={selection} onConfirm={() => onConfirm()} />
        </>
    )
}

// Count down timer for the selection
const CountdownText = ({ selection, onConfirm }: { selection?: MapSelection; onConfirm: () => void }) => {
    const [endMoment, setEndMoment] = useState<moment.Moment>()
    const [timeRemain, setTimeRemain] = useState<number>(-2)
    const [delay, setDelay] = useState<number | null>(null)

    // Count down starts when user has selected a location, then fires if they don't change their mind
    useEffect(() => {
        setEndMoment((prev) => {
            if (!selection) {
                setTimeRemain(-2)
                return undefined
            }

            if (!prev) return moment().add(3, "seconds")

            return prev
        })
    }, [selection])

    useEffect(() => {
        setDelay(null)
        if (endMoment) {
            setDelay(600) // Counts faster than 1 second
            const d = moment.duration(endMoment.diff(moment()))
            setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
    }, [endMoment])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, -1))
    }, delay)

    useEffect(() => {
        if (selection && timeRemain == -1) onConfirm()
    }, [onConfirm, selection, timeRemain])

    useEffect(() => {
        console.log("selection changed", selection)
    }, [selection])
    useEffect(() => {
        console.log("timeRemain changed", timeRemain)
    }, [timeRemain])

    if (timeRemain < 0) return null

    return (
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 99,
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: "#D90000",
                    opacity: 0.9,
                    filter: "drop-shadow(0 3px 3px #00000050)",
                }}
            >
                {timeRemain}
            </Typography>
        </Box>
    )
}
