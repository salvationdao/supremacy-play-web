import { Box, useTheme } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { useGame, useMiniMap } from "../../../containers"

const MIN_CANVAS_HEIGHT = 700

export const LineSelect = ({ mapScale }: { mapScale: number }) => {
    const theme = useTheme()
    const { map } = useGame()
    const { mapElement, gridWidth, gridHeight, selection, setSelection } = useMiniMap()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const indicatorDiameter = useMemo(() => map?.cells_x || 50, [map])

    useEffect(() => {
        const c = canvasRef.current?.getContext("2d")
        if (!c || !mapElement.current) return

        const { width, height } = mapElement.current.getBoundingClientRect()
        c.canvas.width = (width / height) * MIN_CANVAS_HEIGHT
        c.canvas.height = MIN_CANVAS_HEIGHT
    }, [mapElement])

    // https://stackoverflow.com/questions/24376951/find-new-coordinates-of-point-on-line-in-javascript
    useEffect(() => {
        const c = canvasRef.current?.getContext("2d")
        if (!c || !map) return

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

        c.beginPath()
        c.moveTo(normalisedStartCoords.x, normalisedStartCoords.y)
        c.lineTo(normalisedEndCoords.x, normalisedEndCoords.y)
        c.lineWidth = indicatorDiameter * 0.08
        c.strokeStyle = theme.factionTheme.primary
        c.stroke()
    }, [selection, map, indicatorDiameter, theme.factionTheme.primary])

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
                        borderRadius: "50%",
                        backgroundColor: theme.factionTheme.primary,
                        border: "#000000 2px solid",
                        boxShadow: 2,
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
                        borderRadius: "50%",
                        backgroundColor: theme.factionTheme.primary,
                        border: "#000000 2px solid",
                        boxShadow: 2,
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
                onClick={(e) => {
                    if (mapElement.current) {
                        const rect = mapElement.current.getBoundingClientRect()
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
            />
        </>
    )
}