import { addWheelListener } from "./addWheelListener"

export const pixiPanZoom = (domContainer, stage) => {
    addWheelListener(domContainer, function (e) {
        zoom(e.offsetX, e.offsetY, e.deltaY < 0)
    })

    addDragNDrop()

    // Scroll and zoom around
    function zoom(x, y, isZoomIn) {
        const direction = isZoomIn ? 1 : -1
        const factor = 1 + direction * 0.05

        const worldPos = { x: (x - stage.x) / stage.scale.x, y: (y - stage.y) / stage.scale.y }
        const newScale = { x: stage.scale.x * factor, y: stage.scale.y * factor }
        const newScreenPos = { x: worldPos.x * newScale.x + stage.x, y: worldPos.y * newScale.y + stage.y }

        stage.x -= newScreenPos.x - x
        stage.y -= newScreenPos.y - y
        stage.scale.x = newScale.x
        stage.scale.y = newScale.y
    }

    // Drag and pan around
    function addDragNDrop() {
        stage.interactive = true

        let isDragging = false
        let prevX = stage.x
        let prevY = stage.y

        stage.mousedown = function (moveData) {
            const pos = moveData.data.global
            isDragging = true
            prevX = pos.x
            prevY = pos.y
        }

        stage.mousemove = function (moveData) {
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

        stage.mouseup = function () {
            isDragging = false
        }
    }
}
