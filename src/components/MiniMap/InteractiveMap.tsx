import { Box, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { SelectionIcon } from '..'
import { useGame, useWarMachines } from '../../containers'
import { useToggle } from '../../hooks'
import { FactionAbility, Map } from '../../types'

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
    const { mapWarMachines } = useWarMachines()
    return <>{mapWarMachines}</>
}

export const InteractiveMap = ({
    windowDimension,
    targeting,
    factionAbility,
    setSubmitted,
    confirmed,
}: {
    windowDimension: { width: number; height: number }
    targeting?: boolean
    factionAbility?: FactionAbility
    setSubmitted?: Dispatch<SetStateAction<boolean>>
    confirmed?: MutableRefObject<boolean>
}) => {
    const { map } = useGame()
    const [selection, setSelection] = useState<MapSelection>()
    const [refresh, toggleRefresh] = useToggle()
    const prevSelection = useRef<MapSelection>()
    const isDragging = useRef<boolean>(false)
    const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

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
        if (targeting && factionAbility && setSubmitted && confirmed) {
            return (
                <SelectionIcon
                    key={selection && `column-${selection.y}-row-${selection.x}`}
                    selection={selection}
                    setSelection={setSelection}
                    factionAbility={factionAbility}
                    setSubmitted={setSubmitted}
                    confirmed={confirmed}
                />
            )
        }
        return <div />
    }, [targeting, factionAbility, setSubmitted, selection])

    // When map is enlarged etc. This will keep the bounds valid
    useEffect(() => {
        if (!map) return

        lastPos.current = {
            x: Math.max(lastPos.current.x, -(map.width - windowDimension.width)),
            y: Math.max(lastPos.current.y, -(map.height - windowDimension.height)),
        }
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
                        x: Math.max(data.x),
                        y: Math.max(data.y),
                    }
                }}
                bounds={{
                    top: -(map.height - windowDimension.height),
                    left: -(map.width - windowDimension.width),
                    right: 0,
                    bottom: 0,
                }}
            >
                <Box sx={{ cursor: 'move' }}>
                    {/* <MapWarMachines /> */}

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
