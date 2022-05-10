import React, { useEffect, useRef } from "react"
import { GameCoords } from "../../../types"

interface MapCanvasProps {
    startCoords?: GameCoords
    endCoords?: GameCoords
}

export const MapCanvas = ({ startCoords, endCoords }: MapCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const delta = 10 // distance in pixels that the mouse must move horizontally or vertically before it is considered a drag rather than a click
        let startX: number | null
        let startY: number | null
        const handleMouseDown = (e: MouseEvent) => {
            startX = e.pageX
            startY = e.pageY
            console.log(startX, startY)
        }
        const handleMouseUp = (e: MouseEvent) => {
            if (!startX || !startY) return
            const diffX = Math.abs(e.pageX - startX)
            const diffY = Math.abs(e.pageY - startY)

            if (diffX < delta && diffY < delta) return // is a click

            const endX = e.pageX
            const endY = e.pageY
            console.log(endX, endY)
        }
        canvas.addEventListener("mousedown", handleMouseDown)
        canvas.addEventListener("mouseup", handleMouseUp)

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown)
            canvas.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

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

    return (
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
        />
    )
}
