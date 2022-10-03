import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"
import { HEXToVBColor, intToLetter } from "../../../../../helpers"
import { fonts } from "../../../../../theme/theme"
import { Dimension } from "../../../../../types"

const MAX_ROWS = 20
const MAX_COLS = 20

export class PixiGrid {
    root: PIXI.Container<PIXI.DisplayObject>
    private topLabels: PIXI.Container<PIXI.DisplayObject>
    private leftLabels: PIXI.Container<PIXI.DisplayObject>
    private viewport: Viewport
    private animationFrame: number | undefined

    constructor(viewport: Viewport, gridSizeRef: React.MutableRefObject<Dimension>) {
        this.viewport = viewport

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.grid
        this.root.visible = false

        this.topLabels = new PIXI.Container()
        this.leftLabels = new PIXI.Container()

        const rowCount = Math.round(Math.min(viewport.worldHeight / gridSizeRef.current.height, MAX_ROWS))
        const colCount = Math.round(Math.min(viewport.worldWidth / gridSizeRef.current.width, MAX_COLS))
        const cellWidth = viewport.worldWidth / colCount
        const cellHeight = viewport.worldHeight / rowCount

        // Loop through and render grid
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const posX = cellWidth * j
                const posY = cellHeight * i

                if (i === 0) {
                    const label = new PIXI.Text(`${intToLetter(j + 1)}`, {
                        fontFamily: fonts.shareTech,
                        fontSize: cellHeight / 3,
                        fill: "#FFFFFF",
                        lineHeight: 1,
                    })
                    label.resolution = 4
                    label.alpha = 0.9
                    label.anchor.set(0.5, 0)
                    label.position.set(posX + cellWidth / 2, 0)
                    this.topLabels.addChild(label)
                }

                if (j === 0) {
                    const label = new PIXI.Text(`${i + 1}`, {
                        fontFamily: fonts.shareTech,
                        fontSize: cellHeight / 3,
                        fill: "#FFFFFF",
                        lineHeight: 1,
                    })
                    label.resolution = 4
                    label.alpha = 0.9
                    label.anchor.set(0, 0.5)
                    label.position.set(3, posY + cellHeight / 2)
                    this.leftLabels.addChild(label)
                }

                const graphics = new PIXI.Graphics()
                graphics.lineStyle(1, HEXToVBColor("#FFFFFF"))
                graphics.drawRect(0, 0, cellWidth, cellHeight)
                graphics.position.set(posX, posY)

                graphics.alpha = 0.1
                this.root.addChild(graphics)
            }
        }

        this.root.addChild(this.topLabels)
        this.root.addChild(this.leftLabels)
        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    render() {
        const step = () => {
            // Makes sure the top and left labels are always visible
            this.topLabels.y = this.viewport.top
            this.leftLabels.x = this.viewport.left

            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }

    showGrid(show: boolean) {
        this.root.visible = show
    }
}
