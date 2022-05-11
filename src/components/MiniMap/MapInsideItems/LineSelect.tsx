import { Box } from "@mui/material"
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { colors } from "../../../theme/theme"
import { Map } from "../../../types"
import { MapSelection } from "../MiniMapInside"

interface LineSelectProps {
    selection?: MapSelection
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    mapElement?: HTMLDivElement
    gridWidth: number
    gridHeight: number
    map?: Map
    mapScale: number
}

const minCanvasHeight = 700

export const LineSelect = ({ selection, setSelection, mapElement, gridWidth, gridHeight, map, mapScale }: LineSelectProps) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const canvasRef: React.RefCallback<HTMLCanvasElement> = useCallback((node) => {
        if (node !== null) {
            setCanvas(node)
        }
    }, [])

    useEffect(() => {
        const c = canvas?.getContext("2d")
        if (!c) return
        if (!mapElement) return

        const { width, height } = mapElement.getBoundingClientRect()
        c.canvas.width = (width / height) * minCanvasHeight
        c.canvas.height = minCanvasHeight
    }, [canvas, mapElement])

    // https://stackoverflow.com/questions/24376951/find-new-coordinates-of-point-on-line-in-javascript
    useEffect(() => {
        const c = canvas?.getContext("2d")
        if (!c) return
        if (!map) return

        c.clearRect(0, 0, c.canvas.width, c.canvas.height)
        if (!selection?.startCoords || !selection?.endCoords) return

        const normalisedStartCoords = {
            x: (selection.startCoords.x * c.canvas.width) / map.cells_x,
            y: (selection.startCoords.y * c.canvas.height) / map.cells_y,
        }
        const normalisedEndCoords = {
            x: (selection.endCoords.x * c.canvas.width) / map.cells_x,
            y: (selection.endCoords.y * c.canvas.height) / map.cells_y,
        }
        const xLen = normalisedStartCoords.x - normalisedEndCoords.x
        const yLen = normalisedStartCoords.y - normalisedEndCoords.y

        c.moveTo(normalisedStartCoords.x, normalisedStartCoords.y)
        c.lineTo(normalisedEndCoords.x, normalisedEndCoords.y)
        c.stroke()
        console.log("line drawn", normalisedStartCoords, normalisedEndCoords)
    }, [canvas, selection, map])

    const indicatorDiameter = useMemo(() => (map ? map.cells_x * 1.5 : 50), [map])

    return (
        <>
            {selection?.startCoords && (
                <Box
                    onClick={() =>
                        setSelection((prev) => ({
                            ...prev,
                            startCoords: undefined,
                        }))
                    }
                    sx={{
                        position: "absolute",
                        height: `${indicatorDiameter}px`,
                        width: `${indicatorDiameter}px`,
                        cursor: "pointer",
                        border: `2px solid ${colors.black2}`,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        transform: `translate(${selection.startCoords.x * gridWidth - indicatorDiameter / 2}px, ${
                            selection.startCoords.y * gridHeight - indicatorDiameter / 2
                        }px)`,
                        zIndex: 100,
                    }}
                >
                    1
                </Box>
            )}
            {selection?.endCoords && (
                <Box
                    onClick={() =>
                        setSelection((prev) => ({
                            ...prev,
                            endCoords: undefined,
                        }))
                    }
                    sx={{
                        position: "absolute",
                        height: `${indicatorDiameter}px`,
                        width: `${indicatorDiameter}px`,
                        cursor: "pointer",
                        border: `2px solid ${colors.black2}`,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        color: colors.black2,
                        transform: `translate(${selection.endCoords.x * gridWidth - indicatorDiameter / 2}px, ${
                            selection.endCoords.y * gridHeight - indicatorDiameter / 2
                        }px)`,
                        zIndex: 100,
                    }}
                >
                    2
                </Box>
            )}
            <canvas
                ref={canvasRef}
                onClick={(e) => {
                    if (mapElement) {
                        const rect = mapElement.getBoundingClientRect()
                        // Mouse position
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        const coords = {
                            x: x / (gridWidth * mapScale),
                            y: y / (gridHeight * mapScale),
                        }

                        setSelection((prev) => {
                            if (prev?.startCoords) {
                                return {
                                    ...prev,
                                    endCoords: coords,
                                }
                            } else if (prev?.endCoords) {
                                return {
                                    ...prev,
                                    startCoords: coords,
                                }
                            }
                            return {
                                startCoords: coords,
                            }
                        })
                    }
                }}
                style={{
                    zIndex: 6,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
        </>
    )
}
