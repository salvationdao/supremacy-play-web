import { Box, Stack } from "@mui/material"
import { styled } from "@mui/system"
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { MapWarMachine, SelectionIcon } from ".."
import { useGame } from "../../containers"
import { GameAbility, Map, WarMachineState } from "../../types"
import { animated, useSpring } from "react-spring"
import { useGesture } from "@use-gesture/react"
import { opacityEffect } from "../../theme/keyframes"

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
                <div key={`${wm.participantID} - ${wm.tokenID}`}>
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
    confirmed,
    enlarged,
}: {
    gameAbility?: GameAbility
    windowDimension: { width: number; height: number }
    targeting?: boolean
    setSubmitted?: Dispatch<SetStateAction<boolean>>
    confirmed?: MutableRefObject<boolean>
    enlarged: boolean
}) => {
    const { map, warMachines } = useGame()
    const [selection, setSelection] = useState<MapSelection>()
    const prevSelection = useRef<MapSelection>()
    const isDragging = useRef<boolean>(false)

    useEffect(() => {
        setSelection(undefined)
        prevSelection.current = undefined
    }, [targeting])

    // Generate grid ----------------------------------------
    const grid = useMemo(() => {
        if (!map || !targeting) {
            return <div />
        }

        return (
            <MapGrid map={map}>
                <tbody>
                    {Array(map.cellsY)
                        .fill(1)
                        .map((_el, y) => (
                            <tr key={`column-${y}`}>
                                {Array(map.cellsX)
                                    .fill(1)
                                    .map((_el, x) => {
                                        const disabled =
                                            map.disabledCells.indexOf(Math.max(y, 0) * map.cellsX + x) != -1
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
        if (targeting && gameAbility && setSubmitted && confirmed) {
            return (
                <SelectionIcon
                    key={selection && `column-${selection.y}-row-${selection.x}`}
                    gameAbility={gameAbility}
                    selection={selection}
                    setSelection={setSelection}
                    setSubmitted={setSubmitted}
                    confirmed={confirmed}
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
                set({ x, y, immediate: down })
            },
            onWheel: ({ delta: [, deltaY], pinching, dragging }) => {
                if (!enlarged || pinching || dragging) return

                // Calculate new scale
                const curScale = scale.get()
                const zoomSpeed = 0.05
                const newScale = deltaY < 0 ? curScale + zoomSpeed : curScale - zoomSpeed

                setScale(newScale)
            },
            onPinch: ({ movement: [ms], dragging, wheeling }) => {
                if (!enlarged || dragging || wheeling) return

                // Calculate new scale
                const curScale = scale.get()
                const zoomSpeed = 0.2
                const newScale = ms < 0 ? curScale + zoomSpeed : curScale - zoomSpeed

                setScale(newScale)
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
    const setScale = (newScale: number) => {
        if (!map) return
        const minScale = Math.max(windowDimension.width / map.width, windowDimension.height / map.height)
        const maxScale = 1

        // Keeps the map within scale bounds
        if (newScale >= maxScale || minScale >= newScale) {
            newScale >= maxScale ? (newScale = maxScale) : (newScale = minScale)
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
        const ox = xBound >= x.get() ? xBound : x.get()
        const oy = yBound >= y.get() ? yBound : y.get()

        // Set scale and [x,y] offset
        set({ scale: newScale, x: ox, y: oy })
    }

    if (!map) return null
    return (
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

                    <Box sx={{ animation: enlarged ? "" : `${opacityEffect} 0.2s 1`}}>
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
                            backgroundImage: `url(${map.imageUrl})`,
                        }}
                    />
                </Box>
            </animated.div>
        </Stack>
    )
}
