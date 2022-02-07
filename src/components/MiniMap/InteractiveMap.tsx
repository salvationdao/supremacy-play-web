import { Box, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { SelectionIcon } from '..'
import { useGame, useWarMachines } from '../../containers'
import { useToggle } from '../../hooks'
import { BattleAbility, Map } from '../../types'

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
    // This reduces amount of re-renders if put into parent all together
    const { mapWarMachines } = useWarMachines()
    return <>{mapWarMachines}</>
}

export const InteractiveMap = ({
    windowDimension,
    targeting,
    setSubmitted,
    confirmed,
}: {
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
        if (targeting && setSubmitted && confirmed) {
            return (
                <SelectionIcon
                    key={selection && `column-${selection.y}-row-${selection.x}`}
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
            <Draggable
                allowAnyClick
                defaultPosition={lastPos.current}
                onDrag={() => {
                    if (!isDragging.current) isDragging.current = true
                }}
                onStop={(e: DraggableEvent, data: DraggableData) => {
                    setTimeout(() => {
                        isDragging.current = false
                    }, 50)

                    lastPos.current = {
                        x: data.x,
                        y: data.y,
                    }
                }}
                bounds={{
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
                }}
            >
                <Box sx={{ cursor: 'move' }}>
                    <MapWarMachines />

                    {selectionIcon}

                    {grid}

                    <Box
                        sx={{
                            position: 'absolute',
                            width: `${map.width}px`,
                            height: `${map.height}px`,
                            backgroundImage: `url(${map.imageUrl})`,
                        }}
                    ></Box>
                </Box>
            </Draggable>
        </Stack>
    )
}
