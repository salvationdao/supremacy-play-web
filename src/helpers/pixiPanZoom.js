import * as PIXI from "pixi.js"
import { addWheelListener } from "./addWheelListener"

export const pixiPanZoom = (graphics) => {
    addWheelListener(graphics.domContainer, function (e) {
        zoom(e.clientX, e.clientY, e.deltaY < 0)
    })

    addDragNDrop()

    var getGraphCoordinates = (function () {
        var ctx = {
            global: { x: 0, y: 0 }, // store it inside closure to avoid GC pressure
        }

        return function (x, y) {
            ctx.global.x = x
            ctx.global.y = y
            return PIXI.InteractionData.prototype.getLocalPosition.call(ctx, graphics)
        }
    })()

    function zoom(x, y, isZoomIn) {
        var direction = isZoomIn ? 1 : -1
        var factor = 1 + direction * 0.1
        graphics.scale.x *= factor
        graphics.scale.y *= factor

        // Technically code below is not required, but helps to zoom on mouse
        // cursor, instead center of graphics coordinates
        var beforeTransform = getGraphCoordinates(x, y)
        graphics.updateTransform()
        var afterTransform = getGraphCoordinates(x, y)

        graphics.position.x += (afterTransform.x - beforeTransform.x) * graphics.scale.x
        graphics.position.y += (afterTransform.y - beforeTransform.y) * graphics.scale.y
        graphics.updateTransform()
    }

    function addDragNDrop() {
        var stage = graphics.stage
        stage.setInteractive(true)

        var isDragging = false,
            prevX,
            prevY

        stage.mousedown = function (moveData) {
            var pos = moveData.global
            prevX = pos.x
            prevY = pos.y
            isDragging = true
        }

        stage.mousemove = function (moveData) {
            if (!isDragging) {
                return
            }
            var pos = moveData.global
            var dx = pos.x - prevX
            var dy = pos.y - prevY

            graphics.position.x += dx
            graphics.position.y += dy
            prevX = pos.x
            prevY = pos.y
        }

        stage.mouseup = function () {
            isDragging = false
        }
    }
}
