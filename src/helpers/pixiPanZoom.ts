import * as PIXI from "pixi.js"
import { addWheelListener } from "./addWheelListener"

const MIN_ZOOM_SCALE = 1
const MAX_ZOOM_SCALE = 5

export const pixiPanZoom = (domContainer: HTMLCanvasElement, stage: PIXI.Container<PIXI.DisplayObject>) => {
    addWheelListener(domContainer, function (e: WheelEvent) {
        zoom(e.offsetX, e.offsetY, e.deltaY < 0)
    })

    addDragNDrop()

    // Scroll and zoom around
    function zoom(x: number, y: number, isZoomIn: boolean) {
        const direction = isZoomIn ? 1 : -1

        // Scaling
        const factor = 1 + direction * 0.05
        const newScale = { x: stage.scale.x * factor, y: stage.scale.y * factor }

        // Positioning
        const worldPos = { x: (x - stage.x) / stage.scale.x, y: (y - stage.y) / stage.scale.y }
        const newScreenPos = { x: worldPos.x * newScale.x + stage.x, y: worldPos.y * newScale.y + stage.y }
        const newPos = { x: stage.x - (newScreenPos.x - x), y: stage.y - (newScreenPos.y - y) }

        // Return is at zoom limit bounds
        if (Math.min(newScale.x, newScale.y) < MIN_ZOOM_SCALE || Math.max(newScale.x, newScale.y) > MAX_ZOOM_SCALE) return

        stage.x = newPos.x
        stage.y = newPos.y
        stage.scale.x = newScale.x
        stage.scale.y = newScale.y
    }

    // Drag and pan around
    function addDragNDrop() {
        stage.interactive = true

        let isDragging = false
        let prevX = stage.x
        let prevY = stage.y

        stage.on("pointerdown", mousedown).on("pointerup", mouseup).on("pointerupoutside", mouseup).on("pointermove", mousemove)

        function mousedown(moveData: PIXI.InteractionEvent) {
            const pos = moveData.data.global
            isDragging = true
            prevX = pos.x
            prevY = pos.y
        }

        function mousemove(moveData: PIXI.InteractionEvent) {
            if (!isDragging) {
                return
            }

            const pos = moveData.data.global
            const dx = pos.x - prevX
            const dy = pos.y - prevY

            stage.x += dx
            stage.y += dy
            prevX = pos.x
            prevY = pos.y
        }

        function mouseup() {
            isDragging = false
        }
    }

    // Make sure pan and zoom are within a boundary
    function ApplyBounds() {
        stage.on("zcxzc", () => {
            console.log("A")
        })
    }
}
