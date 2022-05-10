import { Box } from "@mui/material"
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { colors } from "../../../theme/theme"
import { MapSelection } from "../MiniMapInside"

interface LineSelectProps {
    selection?: MapSelection
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    mapElement?: HTMLDivElement
    gridWidth: number
    gridHeight: number
    mapScale: number
}

export const LineSelect = ({ selection, setSelection, mapElement, gridWidth, gridHeight, mapScale }: LineSelectProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const c = canvas?.getContext("2d")
        if (!c) return

        let frameCount = 0
        let animationFrameID: number | null = null
        const render = (timestamp?: number) => {
            frameCount++
            animationFrameID = requestAnimationFrame(render)

            c.clearRect(0, 0, c.canvas.width, c.canvas.height)
            c.fillStyle = "#000000"
            c.beginPath()
            c.arc(c.canvas.width / 2, c.canvas.height / 2, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
            c.fill()
        }
        render()

        return () => {
            if (!animationFrameID) return
            window.cancelAnimationFrame(animationFrameID)
        }
    }, [])

    const sizeX = gridWidth * 1.2
    const sizeY = gridHeight * 1.2

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
                        height: `${sizeX}px`,
                        width: `${sizeY}px`,
                        cursor: "pointer",
                        border: `2px solid ${colors.black2}`,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        transform: `translate(${selection.startCoords.x * gridWidth - sizeX / 2}px, ${selection.startCoords.y * gridHeight - sizeY / 2}px)`,
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
                        height: `${sizeX}px`,
                        width: `${sizeY}px`,
                        cursor: "pointer",
                        border: `2px solid ${colors.black2}`,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        color: colors.black2,
                        transform: `translate(${selection.endCoords.x * gridWidth - sizeX / 2}px, ${selection.endCoords.y * gridHeight - sizeY / 2}px)`,
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
