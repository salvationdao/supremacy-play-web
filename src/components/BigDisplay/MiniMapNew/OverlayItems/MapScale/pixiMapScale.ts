import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { fonts } from "../../../../../theme/theme"
import { Dimension, GAME_CLIENT_TILE_SIZE, Vector2i } from "../../../../../types"

export class PixiMapScale {
    root: PIXI.Container<PIXI.DisplayObject>
    private label: PIXI.Text
    private line: PIXI.Graphics
    private viewport: Viewport
    private gridSizeRef: React.MutableRefObject<Dimension>
    private mapScalingRef: React.MutableRefObject<Vector2i>
    private animationFrame: number | undefined

    constructor(viewport: Viewport, gridSizeRef: React.MutableRefObject<Dimension>, mapScalingRef: React.MutableRefObject<Vector2i>) {
        this.viewport = viewport
        this.gridSizeRef = gridSizeRef
        this.mapScalingRef = mapScalingRef

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = 20

        // Label
        const labelStyle = new PIXI.TextStyle({
            fontFamily: fonts.shareTech,
            fontSize: 12,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.label = new PIXI.Text(`${Math.round(GAME_CLIENT_TILE_SIZE / 100)}m`, labelStyle)
        this.label.anchor.set(0, 0)
        this.label.resolution = 4
        this.label.zIndex = 5

        // Line
        this.line = new PIXI.Graphics()
        this.line.position.set(this.label.width + 8, 5)

        // Add everything to container
        this.root.addChild(this.label)
        this.root.addChild(this.line)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy(true)
    }

    render() {
        const step = () => {
            const width = this.gridSizeRef.current.width * this.viewport.scale.x

            // Rect
            this.line.clear()
            this.line.lineStyle(1, HEXToVBColor("#FFFFFF"))
            this.line.moveTo(0, 0)
            this.line.lineTo(0, 4)
            this.line.lineTo(width, 4)
            this.line.lineTo(width, 0)

            this.root.x = 9
            this.root.y = this.viewport.screenHeight - this.root.height - 8

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }
}
