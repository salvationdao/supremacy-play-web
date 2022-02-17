import { Box, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { MapWarMachine, SelectionIcon } from '..'
import { useGame } from '../../containers'
import { useToggle } from '../../hooks'
import { GameAbility, Map, WarMachineState } from '../../types'

// UseGesture Stuff
import { animated, useSpring } from 'react-spring'
import { useDrag, useGesture, useWheel } from '@use-gesture/react'
import { transform } from '@babel/core'

export interface MapSelection {
    x: number
    y: number
}

const MapGrid = styled('table', {
    shouldForwardProp: (prop) => prop !== 'map',
})<{ map: Map }>(({ map }) => ({
    position: 'absolute',
    zIndex: 4,
    width: `${map.width}px`,
    height: `${map.height}px`,
    borderSpacing: 0,
}))

const GridCell = styled('td', {
    shouldForwardProp: (prop) => prop !== 'disabled',
})<{ disabled?: boolean }>(({ disabled }) => ({
    height: '50px',
    width: '50px',
    cursor: disabled ? 'auto' : 'pointer',
    border: disabled ? 'unset' : `1px solid #FFFFFF40`,
    backgroundColor: disabled ? '#00000090' : 'unset',
    '&:hover': {
        backgroundColor: disabled ? '#00000090' : '#FFFFFF45',
    },
}))

interface MapWarMachineProps {
    warMachines: WarMachineState[]
    map: Map
}

const MapWarMachines = ({ warMachines, map }: MapWarMachineProps) => {
    if (!map || !warMachines || warMachines.length <= 0) return null

    return (
        <>
            {warMachines.map((wm) => (
                <div key={`${wm.participantID} - ${wm.tokenID}`}>
                    <MapWarMachine warMachine={wm} map={map} />
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
    enlarged?: boolean
}) => {
    const { map, setMap, warMachines } = useGame()
    const [selection, setSelection] = useState<MapSelection>()
    const [refresh, toggleRefresh] = useToggle()
    const prevSelection = useRef<MapSelection>()
    const isDragging = useRef<boolean>(false)
    const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const prevDimension = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

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
                                                                  // todo: fix - only set selection when not dragging
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

    // When map is enlarged etc. This will keep the bounds valid
    useEffect(() => {
        if (!map) return

        if (enlarged) {
            // todo: set the previous scale and location
            const minScale = windowDimension.width / map.width
            set({ scale: minScale, x: 0, y: 0 })
            setMap((prev) => {
                return prev ? { ...prev, scale: (prev.scale = minScale / 40) } : prev
            })
        } else {
            const minScale = windowDimension.width / map.width
            set({ scale: minScale, x: 0, y: 0 })
            setMap((prev) => {
                return prev ? { ...prev, scale: (prev.scale = minScale / 40) } : prev
            })
        }
        //
        // lastPos.current = {
        //     x:
        //         windowDimension.width <= map.width && prevDimension.current.width > map.width
        //             ? 0
        //             : windowDimension.width <= map.width
        //             ? Math.max(lastPos.current.x, -(map.width - windowDimension.width))
        //             : (windowDimension.width - map.width) / 2,
        //     y:
        //         windowDimension.height <= map.height && prevDimension.current.height > map.height
        //             ? 0
        //             : windowDimension.height <= map.height
        //             ? Math.max(lastPos.current.y, -(map.height - windowDimension.height))
        //             : (windowDimension.height - map.height) / 2,
        // }

        prevDimension.current = windowDimension
        toggleRefresh()
    }, [windowDimension])

    // ---------- Minimap - useGesture setup --------------
    // Prevents map zooming from interfering with the browsers' accessibility zoom
    // https://developer.apple.com/documentation/webkitjs/gestureevent
    document.addEventListener('gesturestart', (e) => e.preventDefault())
    document.addEventListener('gesturechange', (e) => e.preventDefault())

    // setup use-gesture
    const [{ x, y, scale }, set] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
    }))

    const drag = useDrag(
        ({ dragging, wheeling, cancel, offset: [x, y], down }) => {
            if (wheeling || !map || !enlarged) return cancel()
            dragging ? (isDragging.current = true) : (isDragging.current = false) // so I still need this?
            set({ x, y, immediate: down })
        },
        {
            // from: () => [x.get(), y.get()],
            bounds: () => {
                if (!map) return

                // set new bounds so the map doesn't go outside the window
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
    )

    // controls the maps scale - transforms to 0,0 (top left corner)
    // https://codepen.io/danwilson/pen/qXPdbw
    const zoom = useWheel(({ delta: [, deltaY] }) => {
        if (!map || !enlarged) return

        // calculate the scale (based on offset of the mouse - could change this to be 36??)
        // https://github.com/pmndrs/use-gesture/blob/main/packages/core/src/engines/PinchEngine.ts
        const factor = 0.1
        const currentScale = scale.get()
        const delta = deltaY * -0.01
        let newScale = currentScale + delta * factor * currentScale

        // min scale to fit the window
        const minScale = windowDimension.width / map.width
        const maxScale = 1

        // Keeps the map within scale bounds
        if (newScale >= 1 || 0.6 >= newScale) {
            newScale >= 1 ? (newScale = maxScale) : (newScale = minScale)
        }

        // set the maps new scale
        setMap((prev) => {
            return prev ? { ...prev, scale: (prev.scale = newScale / 40) } : prev
        })
        set({ scale: newScale })
    })

    if (!map) return null
    return (
        <Stack
            key={String(refresh)}
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <animated.div {...drag()} style={{ x, y, touchAction: 'none' }}>
                <Box sx={{ cursor: 'move' }}>
                    <MapWarMachines map={map} warMachines={warMachines || []} />

                    {selectionIcon}

                    {grid}

                    {/* Map Image */}
                    <animated.div {...zoom()} style={{ scale, transformOrigin: `0% 0%` }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                width: `${map.width}px`,
                                height: `${map.height}px`,
                                backgroundImage: `url(${map.imageUrl})`,
                            }}
                        />
                    </animated.div>
                </Box>
            </animated.div>
        </Stack>
    )
}
