import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { GameAbility } from "../../../../../types"

export class PixiMechAbility {
    root: PIXI.Container<PIXI.DisplayObject>
    private bgRect: PIXI.Graphics
    private isCountingDown = false

    constructor(ability: GameAbility) {
        const { colour, image_url, label } = ability

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.x = 2
        this.root.y = 2
        this.root.zIndex = 20
        this.root.sortableChildren = true

        // Rect
        this.bgRect = new PIXI.Graphics()

        this.bgRect.beginFill(HEXToVBColor("#FF0000"))
        this.bgRect.drawRect(0, 0, 60, 30)
        this.bgRect.endFill()

        // Add everything to container
        this.root.addChild(this.bgRect)
    }

    destroy() {
        this.root.destroy(true)
    }

    getDefaultHeight() {
        return this.root.height
    }

    setCountdown(secondsLeft: number) {
        if (this.isCountingDown) return

        let start: number | undefined
        let isDone = false
        let lastTimestamp = 0

        const step = (timestamp: DOMHighResTimeStamp) => {
            if (start === undefined) {
                start = timestamp
            }

            const elapsed = timestamp - lastTimestamp
            const totalElapsed = timestamp - start

            if (elapsed >= 1000) {
                // TODO: update countdown text
                lastTimestamp = timestamp
            }

            if (totalElapsed > secondsLeft * 1000) {
                isDone = true
                start = undefined
                lastTimestamp = 0
                this.isCountingDown = false
            }

            if (!isDone) requestAnimationFrame(step)
        }

        this.isCountingDown = true
        requestAnimationFrame(step)
    }
}
