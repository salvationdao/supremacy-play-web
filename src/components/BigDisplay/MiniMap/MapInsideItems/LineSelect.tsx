import { Stack, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useGame, useMiniMap } from "../../../../containers"
import { fonts } from "../../../../theme/theme"
import { Position } from "../../../../types"

const MIN_CANVAS_HEIGHT = 700

export const LineSelect = ({ mapScale }: { mapScale: number }) => {
    const theme = useTheme()
    const { map } = useGame()
    const { gridWidth, gridHeight, selection, setSelection } = useMiniMap()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const indicatorDiameter = useMemo(() => (gridWidth || 50) * 1.8, [gridWidth])

    useEffect(() => {
        const c = canvasRef.current?.getContext("2d")
        const mapElement = document.getElementById("minimap-grid")
        if (!c || !mapElement) return

        const { width, height } = mapElement.getBoundingClientRect()
        c.canvas.width = (width / height) * MIN_CANVAS_HEIGHT
        c.canvas.height = MIN_CANVAS_HEIGHT
    }, [])

    const drawCanvasLine = useCallback(
        (point1: Position, point2: Position, lineWidthMultiplier = 0.09) => {
            const c = canvasRef.current?.getContext("2d")
            if (!c || !map) return

            c.clearRect(0, 0, c.canvas.width, c.canvas.height)

            const normalisedStartCoords = {
                x: (point1.x * c.canvas.width) / map.cells_x,
                y: (point1.y * c.canvas.height) / map.cells_y,
            }

            const normalisedEndCoords = {
                x: (point2.x * c.canvas.width) / map.cells_x,
                y: (point2.y * c.canvas.height) / map.cells_y,
            }

            c.beginPath()
            c.moveTo(normalisedStartCoords.x, normalisedStartCoords.y)
            c.lineTo(normalisedEndCoords.x, normalisedEndCoords.y)
            c.lineWidth = indicatorDiameter * lineWidthMultiplier
            c.strokeStyle = theme.factionTheme.primary
            c.stroke()
        },
        [indicatorDiameter, map, theme.factionTheme.primary],
    )

    // Draw line when both points are selected
    const onCanvasClick = useCallback(
        (e) => {
            const mapElement = document.getElementById("minimap-grid")
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
        },
        [gridHeight, gridWidth, mapScale, setSelection],
    )

    useEffect(() => {
        if (!selection?.startCoords || !selection?.endCoords) return
        drawCanvasLine(selection.startCoords, selection.endCoords)
    }, [drawCanvasLine, selection])

    // Draw line from 1 point to mouse
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const mapElement = document.getElementById("minimap-grid")
            if (!selection || !mapElement) return
            // Make sure only 1 point is selected
            const start = selection.startCoords
            const end = selection.endCoords
            if ((!start && end) || (start && !end)) {
                const rect = mapElement.getBoundingClientRect()
                const x = (e.clientX - rect.left) / (gridWidth * mapScale)
                const y = (e.clientY - rect.top) / (gridHeight * mapScale)
                drawCanvasLine(start || end || { x: 0, y: 0 }, { x, y }, 0.04)
            }
        },
        [drawCanvasLine, gridHeight, gridWidth, mapScale, selection],
    )

    useEffect(() => {
        const mapElement = document.getElementById("minimap-grid")
        const ref = mapElement
        if (!selection || !ref) return
        // Make sure only 1 point is selected
        const start = selection.startCoords
        const end = selection.endCoords
        if ((!start && end) || (start && !end)) {
            ref.addEventListener("mousemove", handleMouseMove, false)
            return () => ref?.removeEventListener("mousemove", handleMouseMove, false)
        }
    }, [handleMouseMove, selection])

    return (
        <>
            {selection?.startCoords && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
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
                        border: `${theme.factionTheme.background} 3px solid`,
                        boxShadow: 2,
                        transform: `translate(${selection.startCoords.x * gridWidth - indicatorDiameter / 2}px, ${
                            selection.startCoords.y * gridHeight - indicatorDiameter / 2
                        }px)`,
                        zIndex: 910,
                    }}
                >
                    <Typography sx={{ fontSize: `${indicatorDiameter / 2}px`, fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                        1
                    </Typography>
                </Stack>
            )}

            {selection?.endCoords && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
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
                        border: `${theme.factionTheme.background} 3px solid`,
                        boxShadow: 2,
                        transform: `translate(${selection.endCoords.x * gridWidth - indicatorDiameter / 2}px, ${
                            selection.endCoords.y * gridHeight - indicatorDiameter / 2
                        }px)`,
                        zIndex: 910,
                    }}
                >
                    <Typography sx={{ fontSize: `${indicatorDiameter / 2}px`, fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                        2
                    </Typography>
                </Stack>
            )}

            <canvas
                ref={canvasRef}
                style={{
                    zIndex: 909,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                }}
                onClick={onCanvasClick}
            />
        </>
    )
}
