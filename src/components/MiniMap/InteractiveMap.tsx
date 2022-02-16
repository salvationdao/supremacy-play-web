import { Box, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { MapWarMachine, SelectionIcon } from '..'
import { useGame } from '../../containers'
import { useToggle } from '../../hooks'
import { GameAbility, Map } from '../../types'

// UseGesture Stuff
import { animated, useSpring } from 'react-spring'
import { useDrag, useGesture, useWheel } from '@use-gesture/react'

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

const MapWarMachines = () => {
    const { warMachines, map } = useGame()

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
    const { map } = useGame()
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
            set({ scale: 1 })
            map.scale = 1 / 40
            // map.scale = 1
        } else {
            set({ scale: 0.16, x: -125, y: -30 })
            map.scale = 0.16 / 40
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
        scale: 0.025,
    }))

    // const [dragState, setDragState] = useState('No')
    // const [wheelState, setWheelState] = useState('No')
    // const [pinchState, setPinchState] = useState('No')

    const drag = useDrag(({wheeling, cancel, offset: [x, y]}) => {
        if (!map) return cancel()
        if (wheeling) return cancel()
        if (!enlarged) return cancel()
        set({ x, y, immediate: true })
    }, {
        bounds: () => {
            // set the dragging bounds of the map
            if (!map) return
            console.log('map scale', map.scale)
            // return {
            //     top:
            //         windowDimension.height <= map.height * map.scale
            //             ? -(map.height * map.scale - windowDimension.height)
            //             : (windowDimension.height - map.height * map.scale) / 2,
            //     left:
            //         windowDimension.width <= map.width * map.scale
            //             ? -(map.width * map.scale - windowDimension.width)
            //             : (windowDimension.width - map.width * map.scale) / 2,
            //     right: 0,
            //     bottom: 0,
            // }
            return {
                top:
                    windowDimension.height <= map.height
                        ? -(map.height - windowDimension.height)
                        : (windowDimension.height - map.height) / 2,
                left:
                    windowDimension.width <= map.width
                        ? -(map.width - windowDimension.width)
                        : (windowDimension.width - map.width) / 2,
                right: 0,
                bottom: 0,
            }
        },
    })

    const zoom = useWheel(({ delta: [, deltaY]}) => {
        if (!map) return
        if (!enlarged) return

        // calculate the scale
        const factor = 0.1
        const currentScale = scale.get()
        const delta = deltaY * -0.01
        let newScale = currentScale + delta * factor * currentScale

        // Keeps the map within scale bounds
        if (newScale >= 1 || 0.6 >= newScale) {
            newScale >= 1 ? newScale = 1 : newScale = 0.6
        }

        console.log(newScale)
        set({ scale: newScale, immediate: true})
        map.scale = newScale / 40
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
            <animated.div {...drag()} style={{ x, y }}>
            <Box sx={{ cursor: 'move' }}>
                <MapWarMachines />

                {selectionIcon}

                {grid}

                {/* Map Image */}
                <animated.div {...zoom()} style={{ scale }}>
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
