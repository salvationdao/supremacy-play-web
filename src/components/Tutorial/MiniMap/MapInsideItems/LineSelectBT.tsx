import { Stack, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapSelection, useTraining } from "../../../../containers"
import { diff } from "../../../../helpers"
import { glowEffect } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { Position } from "../../../../types"

const MIN_CANVAS_HEIGHT = 700

const hintSelection: MapSelection = {
    startCoords: { x: 23.56, y: 18.88 },
    endCoords: {
        x: 26,
        y: 19.8,
    },
}

enum SelectStage {
    StartCoord,
    EndCoord,
    Submit,
}

export const LineSelectBT = ({ mapScale }: { mapScale: number }) => {
    const theme = useTheme()
    const { mapElement, gridWidth, gridHeight, setSelection, map } = useTraining()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const _selection = hintSelection
    const [selectStage, setSelectStage] = useState(SelectStage.StartCoord)

    const indicatorDiameter = useMemo(() => (map?.Cells_X || 50) * 1.8, [map])

    useEffect(() => {
        const c = canvasRef.current?.getContext("2d")
        if (!c || !mapElement.current) return

        const { width, height } = mapElement.current.getBoundingClientRect()
        c.canvas.width = (width / height) * MIN_CANVAS_HEIGHT
        c.canvas.height = MIN_CANVAS_HEIGHT
    }, [mapElement])

    const drawCanvasLine = useCallback(
        (point1: Position, point2: Position, lineWidthMultiplier = 0.09) => {
            const c = canvasRef.current?.getContext("2d")
            if (!c || !map) return

            c.canvas.width = map.Width
            c.clearRect(0, 0, c.canvas.width, c.canvas.height)

            const normalisedStartCoords = {
                x: (point1.x * c.canvas.width) / map.Cells_X,
                y: (point1.y * c.canvas.height) / map.Cells_Y,
            }

            const normalisedEndCoords = {
                x: (point2.x * c.canvas.width) / map.Cells_X,
                y: (point2.y * c.canvas.height) / map.Cells_Y,
            }

            c.beginPath()
            c.moveTo(normalisedStartCoords.x, normalisedStartCoords.y)
            c.lineTo(normalisedEndCoords.x, normalisedEndCoords.y)
            c.lineWidth = indicatorDiameter * lineWidthMultiplier
            c.strokeStyle = selectStage !== SelectStage.Submit ? `${colors.darkGrey}99` : theme.factionTheme.primary
            c.stroke()
        },
        [indicatorDiameter, map, theme.factionTheme.primary, selectStage],
    )

    // Draw line when both points are selected
    const onCanvasClick = useCallback(
        (e) => {
            if (!hintSelection.startCoords || !hintSelection.endCoords) return
            if (mapElement.current) {
                const rect = mapElement.current.getBoundingClientRect()

                // Mouse position
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const coords = {
                    x: x / (gridWidth * mapScale),
                    y: y / (gridHeight * mapScale),
                }

                const tolerance = 0.5
                const startCoordsDiffX = diff(coords.x, hintSelection.startCoords.x)
                const startCoordsDiffY = diff(coords.y, hintSelection.startCoords.y)
                const endCoordsDiffX = diff(coords.x, hintSelection.endCoords.x)
                const endCoordsDiffY = diff(coords.y, hintSelection.endCoords.y)

                if (selectStage === SelectStage.StartCoord && startCoordsDiffX < tolerance && startCoordsDiffY < tolerance) {
                    setSelectStage(SelectStage.EndCoord)
                } else if (selectStage === SelectStage.EndCoord && endCoordsDiffX < tolerance && endCoordsDiffY < tolerance) {
                    setSelectStage(SelectStage.Submit)
                    setSelection(_selection)
                }
            }
        },
        [gridHeight, gridWidth, mapElement, mapScale, setSelectStage, setSelection, _selection, selectStage],
    )

    useEffect(() => {
        if (!_selection?.startCoords || !_selection?.endCoords) return
        drawCanvasLine(_selection.startCoords, _selection.endCoords)
    }, [drawCanvasLine, _selection])

    // Draw line from 1 point to mouse
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!_selection || !mapElement.current) return
            // Make sure only 1 point is selected
            const start = _selection.startCoords
            const end = _selection.endCoords
            if ((!start && end) || (start && !end)) {
                const rect = mapElement.current.getBoundingClientRect()
                const x = (e.clientX - rect.left) / (gridWidth * mapScale)
                const y = (e.clientY - rect.top) / (gridHeight * mapScale)
                drawCanvasLine(start || end || { x: 0, y: 0 }, { x, y }, 0.04)
            }
        },
        [drawCanvasLine, gridHeight, gridWidth, mapElement, mapScale, _selection],
    )

    useEffect(() => {
        const ref = mapElement.current
        if (!_selection || !ref) return
        // Make sure only 1 point is selected
        const start = _selection.startCoords
        const end = _selection.endCoords
        if ((!start && end) || (start && !end)) {
            ref.addEventListener("mousemove", handleMouseMove, false)
            return () => ref?.removeEventListener("mousemove", handleMouseMove, false)
        }
    }, [handleMouseMove, mapElement, _selection])

    return (
        <>
            {_selection?.startCoords && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => {
                        setSelection((prev) => ({
                            ...prev,
                            startCoords: undefined,
                        }))
                    }}
                    sx={{
                        pointerEvents: "none",
                        position: "absolute",
                        height: `${indicatorDiameter}px`,
                        width: `${indicatorDiameter}px`,
                        cursor: "pointer",
                        borderRadius: "50%",
                        backgroundColor: selectStage === SelectStage.StartCoord ? colors.lightGrey : theme.factionTheme.primary,
                        border: `${theme.factionTheme.background} 3px solid`,
                        boxShadow: 2,
                        transform: `translate(${_selection.startCoords.x * gridWidth - indicatorDiameter / 2}px, ${
                            _selection.startCoords.y * gridHeight - indicatorDiameter / 2
                        }px)`,
                        zIndex: 100,
                        animation: selectStage === SelectStage.StartCoord ? (theme) => `${glowEffect(theme.factionTheme.primary, true)} 2s infinite` : "unset",
                        opacity: selectStage === SelectStage.StartCoord ? 0.8 : 1,
                    }}
                >
                    <Typography sx={{ fontSize: `${indicatorDiameter / 2}px`, fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                        1
                    </Typography>
                </Stack>
            )}
            {_selection?.endCoords && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => {
                        setSelection((prev) => ({
                            ...prev,
                            endCoords: undefined,
                        }))
                    }}
                    sx={{
                        pointerEvents: "none",
                        position: "absolute",
                        height: `${indicatorDiameter}px`,
                        width: `${indicatorDiameter}px`,
                        cursor: "pointer",
                        borderRadius: "50%",
                        backgroundColor: selectStage !== SelectStage.Submit ? colors.lightGrey : theme.factionTheme.primary,
                        border: `${theme.factionTheme.background} 3px solid`,
                        boxShadow: 2,
                        transform: `translate(${_selection.endCoords.x * gridWidth - indicatorDiameter / 2}px, ${
                            _selection.endCoords.y * gridHeight - indicatorDiameter / 2
                        }px)`,
                        zIndex: 100,
                        opacity: selectStage !== SelectStage.Submit ? 0.8 : 1,
                        animation: selectStage === SelectStage.EndCoord ? (theme) => `${glowEffect(theme.factionTheme.primary, true)} 2s infinite` : "unset",
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
                    zIndex: 6,
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
