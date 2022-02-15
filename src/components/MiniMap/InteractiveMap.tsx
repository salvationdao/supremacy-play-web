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
import { useGesture } from '@use-gesture/react'

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
}: {
    gameAbility?: GameAbility
    windowDimension: { width: number; height: number }
    targeting?: boolean
    setSubmitted?: Dispatch<SetStateAction<boolean>>
    confirmed?: MutableRefObject<boolean>
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

        lastPos.current = {
            x:
                windowDimension.width <= map.width && prevDimension.current.width > map.width
                    ? 0
                    : windowDimension.width <= map.width
                    ? Math.max(lastPos.current.x, -(map.width - windowDimension.width))
                    : (windowDimension.width - map.width) / 2,
            y:
                windowDimension.height <= map.height && prevDimension.current.height > map.height
                    ? 0
                    : windowDimension.height <= map.height
                    ? Math.max(lastPos.current.y, -(map.height - windowDimension.height))
                    : (windowDimension.height - map.height) / 2,
        }

        prevDimension.current = windowDimension
        toggleRefresh()
    }, [windowDimension])

    // ---------- Minimap - useGesture setup --------------
    // Prevents map zooming from interfering with the browsers' accessibility zoom
    // https://developer.apple.com/documentation/webkitjs/gestureevent
    document.addEventListener('gesturestart', (e) => e.preventDefault())
    document.addEventListener('gesturechange', (e) => e.preventDefault())

    const [style, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        wheel: 0,
    }))
    const mapRef = useRef<HTMLDivElement>(null)

    const bind = useGesture(
        {
            onDrag: ({ wheeling, cancel, down, offset: [x, y] }) => {
                if (wheeling) return cancel()
                console.log(x, y)
                api.start({ x, y, immediate: down })
            },
            onWheel: ({ delta: [, deltaY] }) => {
                const factor = 0.1
                const scale = style.scale.get()
                const delta = deltaY * -0.01
                const newScale = scale + delta * factor * scale

                //Todo: Set the origin of the zoom
                // y = 0
                // x = 0

                // Keeps the map within scale bounds
                if (newScale >= 0.6 && 1 >= newScale) {
                    api.set({ scale: newScale })
                } else if (newScale >= 1) {
                    api.set({ scale: 1 })
                } else {
                    api.set({ scale: 0.6 })
                }

            },
        },

        {
            drag: {
                // set the initial position of map
                from: () => [style.x.get(), style.y.get()],

                // set the bounds of the map
                bounds: () => {
                    if (!map) return


                    const scale = style.scale.get()
                    const mapHeight = scale * map.height
                    const mapWidth = scale * map.width

                    console.log("width", mapWidth, " height", mapHeight)

                    return {
                        top:
                            windowDimension.height <= mapHeight
                                ? -(mapHeight - windowDimension.height)
                                : (windowDimension.height - mapHeight) / 2,
                        left:
                            windowDimension.width <= mapWidth
                                ? -(mapWidth - windowDimension.width)
                                : (windowDimension.width - mapWidth) / 2,
                        right: 0,
                        bottom: 0,
                    }
                },
            },
        },
    )

    if (!map) return null

    return (
        <Stack
            key={String(refresh)}
            sx={{
                position: 'absolute',
                display: 'flex',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <animated.div {...bind()} style={style} ref={mapRef}>
                <Box sx={{ cursor: 'move' }}>
                    <MapWarMachines />

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
                </Box>
            </animated.div>
        </Stack>
    )
}
