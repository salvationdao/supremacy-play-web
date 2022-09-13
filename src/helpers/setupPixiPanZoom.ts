import * as PIXI from "pixi.js"
import { clamp } from "."
import { addWheelListener } from "./addWheelListener"

const MAX_ZOOM_SCALE = 5

export const setupPixiPanZoom = (
    renderer: PIXI.Renderer | PIXI.AbstractRenderer,
    domContainer: HTMLCanvasElement,
    stage: PIXI.Container<PIXI.DisplayObject>,
) => {
    addWheelListener(domContainer, function (e: WheelEvent) {
        zoom(e.offsetX, e.offsetY, e.deltaY < 0)
    })

    addDragNDrop()

    // Scroll and zoom around
    function zoom(x: number, y: number, isZoomIn: boolean) {
        const direction = isZoomIn ? 1 : -1

        // Scaling
        const factor = 1 + direction * 0.05
        const newScale = {
            x: clamp(renderer.width / stage.width, stage.scale.x * factor, MAX_ZOOM_SCALE),
            y: clamp(renderer.height / stage.height, stage.scale.y * factor, MAX_ZOOM_SCALE),
        }

        // Positioning
        const worldPos = { x: (x - stage.x) / stage.scale.x, y: (y - stage.y) / stage.scale.y }
        const newScreenPos = { x: worldPos.x * newScale.x + stage.x, y: worldPos.y * newScale.y + stage.y }
        const newPos = { x: stage.x - (newScreenPos.x - x), y: stage.y - (newScreenPos.y - y) }

        stage.x = newPos.x
        stage.y = newPos.y
        stage.scale.x = newScale.x
        stage.scale.y = newScale.y

        applyBounds(renderer, stage)
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

            applyBounds(renderer, stage)
        }

        function mouseup() {
            isDragging = false
        }
    }
}

// Make sure pan and zoom are within a boundary
export const applyBounds = (renderer: PIXI.Renderer | PIXI.AbstractRenderer, stage: PIXI.Container<PIXI.DisplayObject>) => {
    const newScales = { x: stage.scale.x, y: stage.scale.y }

    // if (stage.width < renderer.width) {
    //     newScales.x = 1 //renderer.width / stage.width
    //     newScales.y = 1 //renderer.width / stage.width
    //     console.log(newScales, stage.width, renderer.width)
    // }

    // if (stage.height < renderer.height) {
    //     newScales.x = 1 //renderer.height / stage.height
    //     newScales.y = 1 //renderer.height / stage.height
    // }

    stage.x = clamp(-(stage.width - renderer.width), stage.x, 0)
    stage.y = clamp(-(stage.height - renderer.height), stage.y, 0)
    stage.scale.x = newScales.x
    stage.scale.y = newScales.y
}
