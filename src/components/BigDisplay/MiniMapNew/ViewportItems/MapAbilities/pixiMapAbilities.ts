import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"

export class PixiMapAbilities {
    root: PIXI.Container<PIXI.DisplayObject>
    private graphics: PIXI.Graphics
    private color: string
    private animationFrame: number | undefined

    constructor(color: string) {
        this.color = color

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.mapAbilitiesBelowMechs
        // this.root.zIndex = pixiViewportZIndexes.mapAbilitiesAboveMechs
        this.root.sortableChildren = true

        this.graphics = new PIXI.Graphics()

        // Add everything to container
        this.root.addChild(this.graphics)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    render() {
        const step = () => {
            // Perform something every render

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }
}
