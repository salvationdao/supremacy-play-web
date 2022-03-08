import { Box, Stack, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { MapWarMachine, SelectionIcon } from ".."
import { useGame, useGameServerWebsocket } from "../../containers"
import { GameAbility, Map, WarMachineState } from "../../types"
import { animated, useSpring } from "react-spring"
import { useGesture } from "@use-gesture/react"
import { opacityEffect } from "../../theme/keyframes"
import { GameServerKeys } from "../../keys"
import moment from "moment"
import { useInterval } from "../../hooks"

export interface MapSelection {
    x: number
    y: number
}

const MapGrid = styled("table", {
    shouldForwardProp: (prop) => prop !== "map",
})<{ map: Map }>(({ map }) => ({
    position: "absolute",
    zIndex: 4,
    width: `${map.width}px`,
    height: `${map.height}px`,
    borderSpacing: 0,
}))

const GridCell = styled("td", {
    shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled?: boolean }>(({ disabled }) => ({
    height: "50px",
    width: "50px",
    cursor: disabled ? "auto" : "pointer",
    border: disabled ? "unset" : `1px solid #FFFFFF40`,
    backgroundColor: disabled ? "#00000090" : "unset",
    "&:hover": {
        backgroundColor: disabled ? "#00000090" : "#FFFFFF45",
    },
}))

interface MapWarMachineProps {
    warMachines: WarMachineState[]
    map: Map
    enlarged: boolean
}

const MapWarMachines = ({ warMachines, map, enlarged }: MapWarMachineProps) => {
    if (!map || !warMachines || warMachines.length <= 0) return null

    return (
        <>
            {warMachines.map((wm) => (
                <div key={`${wm.participantID} - ${wm.hash}`}>
                    <MapWarMachine warMachine={wm} map={map} enlarged={enlarged} />
                </div>
            ))}
        </>
    )
}

export const InteractiveMap = ({
    gameAbility,
    windowDimension,
    targeting,
    setSubmitted,
    enlarged,
}: {
    gameAbility?: GameAbility
    windowDimension: { width: number; height: number }
    targeting?: boolean
    setSubmitted?: Dispatch<SetStateAction<boolean>>
    enlarged: boolean
}) => {
    const { state, send } = useGameServerWebsocket()
    const { map, warMachines } = useGame()
    const [selection, setSelection] = useState<MapSelection>()
    const prevSelection = useRef<MapSelection>()
    const isDragging = useRef<boolean>(false)

    const [endMoment, setEndMoment] = useState<moment.Moment>()
    const [timeRemain, setTimeRemain] = useState<number>(-2)
    const [delay, setDelay] = useState<number | null>(null)

    useEffect(() => {
        setSelection(undefined)
        prevSelection.current = undefined
    }, [targeting])

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // Count down starts when user has selected a location, then fires if they don't change their mind
    useEffect(() => {
        if (!selection) return
        if (!endMoment) setEndMoment(moment().add(3, "seconds"))
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
        if (selection && gameAbility && timeRemain == -1) onConfirm()
    }, [timeRemain])

    const onConfirm = () => {
        try {
            if (state !== WebSocket.OPEN || !selection) return
            send<boolean, { x: number; y: number }>(GameServerKeys.SubmitAbilityLocationSelect, {
                x: selection.x,
                y: selection.y,
            })
            setSubmitted && setSubmitted(true)
            setEndMoment(undefined)
        } catch (e) {
            console.log(e)
        }
    }
    // --------------------------------------------------------------
    // --------------------------------------------------------------

    // Generate grid ----------------------------------------
    const grid = useMemo(() => {
        if (!map || !targeting) {
            return <div />
        }

        return (
            <MapGrid map={map}>
                <tbody>
                    {Array(map.cells_y)
                        .fill(1)
                        .map((_el, y) => (
                            <tr key={`column-${y}`}>
                                {Array(map.cells_x)
                                    .fill(1)
                                    .map((_el, x) => {
                                        const disabled =
                                            map.disabled_cells.indexOf(Math.max(y, 0) * map.cells_x + x) != -1
                                        return (
                                            <GridCell
                                                key={`column-${y}-row-${x}`}
                                                disabled={disabled}
                                                onClick={
                                                    disabled
                                                        ? undefined
                                                        : () => {
                                                              if (!isDragging.current) {
                                                                  setSelection((prev) => {
                                                                      prevSelection.current = prev
                                                                      return { x, y }
                                                                  })
                                                              }
                                                          }
                                                }
                                            />
                                        )
                                    })}
                            </tr>
                        ))}
                </tbody>
            </MapGrid>
        )
    }, [targeting, map])

    const selectionIcon = useMemo(() => {
        if (targeting && gameAbility && setSubmitted) {
            return (
                <SelectionIcon
                    key={selection && `column-${selection.y}-row-${selection.x}`}
                    gameAbility={gameAbility}
                    selection={selection}
                    setSelection={setSelection}
                />
            )
        }
        return <div />
    }, [targeting, setSubmitted, selection])

    // Set map scale to minimum scale while staying in-bounds
    useEffect(() => {
        if (!map) return
        const minScale = Math.max(windowDimension.width / map.width, windowDimension.height / map.height)

        // the ternary stops the map showing out of bounds
        enlarged ? set({ scale: minScale, x: 0, y: 0, immediate: true }) : set({ scale: minScale, x: 0, y: 0 })
    }, [windowDimension, warMachines])

    // --------------- Minimap - useGesture setup -------------------

    // Prevents map zooming from interfering with the browsers' accessibility zoom
    document.addEventListener("gesturestart", (e) => e.preventDefault())
    document.addEventListener("gesturechange", (e) => e.preventDefault())
    document.addEventListener("gestureend", (e) => e.preventDefault())

    // Create actions
    const gestureRef = useRef<HTMLDivElement>(null)

    // Setup use-gesture props
    const [{ x, y, scale }, set] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: map ? windowDimension.width / map.width : 1,
    }))

    // Setup map drag
    useGesture(
        {
            onDrag: ({ dragging, wheeling, cancel, offset: [x, y], down }) => {
                if (wheeling || !map || !enlarged) return cancel()

                // Set dragging
                dragging
                    ? (isDragging.current = true)
                    : setTimeout(() => {
                          isDragging.current = false
                      }, 50)

                // Set [x,y] offset
                set({ x: Math.round(x), y: Math.round(y), immediate: down })
            },
            onWheel: ({ delta: [, deltaY], pinching, dragging, event: e }) => {
                if (!enlarged || pinching || dragging || !map) return
                const mapWidth = map.width
                const mapHeight = map.height

                // Calculate new scale
                const curScale = scale.get()
                const newScale = curScale * (deltaY > 0 ? 0.95 : 1.05)

                // Cursors position in relation to the image
                const cursorX = e.offsetX
                const cursorY = e.offsetY

                // Change in x after scaling
                const displacementX = mapWidth * curScale - mapWidth * newScale
                // The ratio of image between the cursor and the side of the image (x)
                const sideRatioX = cursorX / mapWidth
                // The new position of x - keeps the ratio of image between the cursor and the edge
                const newX = x.get() + displacementX * sideRatioX

                // Change in y after scaling
                const displacementY = mapHeight * curScale - mapHeight * newScale
                // The ratio of image between the cursor and the top of the image (y)
                const topRatioY = cursorY / mapHeight
                // The new position of y - keeps the ratio of image between the cursor and the top
                const newY = y.get() + displacementY * topRatioY

                // Set new scale and positions
                setScale(newScale, newX, newY)
            },
            onPinch: ({ movement: [ms], dragging, wheeling }) => {
                if (!enlarged || dragging || wheeling) return

                // Calculate new scale
                const curScale = scale.get()
                const newScale = curScale * (ms > 0 ? 0.95 : 1.05)

                setScale(newScale, 0, 0)
            },
        },
        {
            target: gestureRef,
            eventOptions: { passive: false },
            drag: {
                from: () => [x.get(), y.get()],
                filterTaps: true,
                preventDefault: true,
                bounds: () => {
                    if (!map) return
                    return {
                        top:
                            windowDimension.height <= map.height * scale.get()
                                ? -(map.height * scale.get() - windowDimension.height)
                                : (windowDimension.height - map.height * scale.get()) / 2,
                        left:
                            windowDimension.width <= map.width * scale.get()
                                ? -(map.width * scale.get() - windowDimension.width)
                                : (windowDimension.width - map.width * scale.get()) / 2,
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
    const setScale = (newScale: number, newX: number, newY: number) => {
        if (!map) return
        const minScale = Math.max(windowDimension.width / map.width, windowDimension.height / map.height)
        const maxScale = 1
        const curScale = scale.get()

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
            windowDimension.width <= map.width * newScale
                ? -(map.width * newScale - windowDimension.width)
                : (windowDimension.width - map.width * newScale) / 2
        const yBound =
            windowDimension.height <= map.height * newScale
                ? -(map.height * newScale - windowDimension.height)
                : (windowDimension.height - map.height * newScale) / 2

        // Keep the map in-bounds
        newX = xBound >= newX ? xBound : newX > 0 ? 0 : newX
        newY = yBound >= newY ? yBound : newY > 0 ? 0 : newY

        // Set scale and [x,y] offset
        set({ scale: newScale, x: Math.round(newX), y: Math.round(newY), immediate: true })
    }

    if (!map) return null
    return (
        <>
            <Stack
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                {/* Map - can be dragged and zoomed/scaled */}
                <animated.div ref={gestureRef} style={{ x, y, touchAction: "none", scale, transformOrigin: `0% 0%` }}>
                    <Box sx={{ cursor: enlarged ? "move" : "" }}>
                        <Box sx={{ animation: enlarged ? "" : `${opacityEffect} 0.2s 1` }}>
                            <MapWarMachines map={map} warMachines={warMachines || []} enlarged={enlarged} />
                        </Box>

                        {selectionIcon}

                        {grid}

                        {/* Map Image */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: `${map.width}px`,
                                height: `${map.height}px`,
                                backgroundImage: `url(${map.image_url})`,
                            }}
                        />
                    </Box>
                </animated.div>
            </Stack>

            {/* Count down timer for the selection */}
            {timeRemain >= 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: 999,
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontFamily: "Nostromo Regular Black",
                            color: "#D90000",
                            opacity: 0.9,
                            filter: "drop-shadow(0 3px 3px #00000050)",
                        }}
                    >
                        {timeRemain}
                    </Typography>
                </Box>
            )}
        </>
    )
}
