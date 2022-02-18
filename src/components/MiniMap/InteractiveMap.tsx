import { Box, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { MapWarMachine, SelectionIcon } from '..'
import { useGame } from '../../containers'
import { useToggle } from '../../hooks'
import { GameAbility, Map, WarMachineState } from '../../types'
import { animated, useSpring } from 'react-spring'
import { useDrag, useWheel } from '@use-gesture/react'
import { CONTROLS_HEIGHT, GAMEBAR_HEIGHT } from '../../constants'

export interface MapSelection {
    x: number
    y: number
}

// todo: implement this?
interface MapGridProps {
    mapHeight: number
    mapWidth: number
    scale: number // just this one?
}

//todo: need to scale grid size
const MapGrid = styled('table', {
    shouldForwardProp: (prop) => prop !== 'map',
})<{ map: Map }>(({ map }) => ({
    position: 'absolute',
    zIndex: 4,
    // todo: redo this
    width: `${map.width}px`,
    height: `${map.height}px`,
    borderSpacing: 0,
}))

// todo: implement this?
interface GridCellProps {
    gridHeight: number
    gridWidth: number
    scale: number // just this one?
}

//todo: need to scale grid cell size
const GridCell = styled('td', {
    shouldForwardProp: (prop) => prop !== 'disabled' && prop !== 'map',
})<{ disabled?: boolean; map: Map }>(({ disabled, map }) => ({
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

// Should I have interactiveMapProps?

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
    const lastPos = useRef<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 })
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
                                                map={map}
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

        // todo: set the previous enlarged scale and location
        const minScale = windowDimension.width / map.width
        set({ scale: minScale, x: 0, y: 0 })
        setMap((prev) => {
            return prev ? { ...prev, scale: (prev.scale = minScale / 40) } : prev
        })
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
        scale: map ? windowDimension.width / map.width : 1,
    }))

    const dragMap = useDrag(
        ({ dragging, wheeling, cancel, offset: [x, y], down }) => {
            if (wheeling || !map || !enlarged) return cancel()
            dragging && down ? (isDragging.current = true) : (isDragging.current = false)
            console.log(isDragging)
            set({ x, y, immediate: down })
        },
        {
            from: () => [x.get(), y.get()],
            // set new bounds so the map doesn't go outside the view window when dragging
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
    )

    // controls the maps scale - transforms to 0,0 (top left corner)
    // https://codepen.io/danwilson/pen/qXPdbw
    const scaleMap = useWheel(({ delta: [, deltaY] }) => {
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

        // set the maps new scale, height & width
        setMap((prev) => {
            return prev ? { ...prev, scale: (prev.scale = newScale / 40) } : prev
        })

        //todo: calculate the new x & y coordinates so the map stays within bounds when zooming
        // something like this?
        // newPosX =
        //     newPosX > 0 ? Math.max(Padding, Math.min(newPosX, width - newWidth - Padding)) : width - newWidth - Padding
        // newPosY = Math.max(Padding, Math.min(newPosY, height - GAMEBAR_HEIGHT - CONTROLS_HEIGHT - newHeight - Padding))
        // setCurPosX(newPosX)
        // setCurPosY(newPosY)

        // move the map, so it stays within bounds when scaling - not working properly
        set({ scale: newScale, x: x.get() * newScale, y: y.get() * newScale })
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
            {/* Map - can be dragged */}
            <animated.div {...dragMap()} style={{ x, y, touchAction: 'none' }}>
                <Box sx={{ cursor: 'move' }}>
                    <MapWarMachines map={map} warMachines={warMachines || []} />

                    {/* Can be scaled and dragged */}
                    <animated.div {...scaleMap()} style={{ scale, transformOrigin: `0% 0%` }}>
                        {selectionIcon}

                        {grid}

                        {/* Map Image */}
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
