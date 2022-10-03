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

    constructor(viewport: Viewport, gridSizeRef: React.MutableRefObject<Dimension>) {
        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.grid
        this.root.visible = false

        const rowCount = Math.round(Math.min(viewport.worldHeight / gridSizeRef.current.height, MAX_ROWS))
        const colCount = Math.round(Math.min(viewport.worldWidth / gridSizeRef.current.width, MAX_COLS))
        const cellWidth = viewport.worldWidth / colCount
        const cellHeight = viewport.worldHeight / rowCount

        // Loop through and render grid
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const posX = cellWidth * j
                const posY = cellHeight * i

                const graphics = new PIXI.Graphics()
                graphics.lineStyle(1, HEXToVBColor("#FFFFFF"))
                graphics.drawRect(0, 0, cellWidth, cellHeight)
                graphics.position.set(posX, posY)

                const label = new PIXI.Text(`${intToLetter(j + 1)}${i + 1}`, {
                    fontFamily: fonts.shareTech,
                    fontSize: cellHeight / 2,
                    fill: "#FFFFFF",
                    lineHeight: 1,
                })
                label.resolution = 4
                graphics.alpha = 0.1

                graphics.addChild(label)
                this.root.addChild(graphics)
            }
        }
    }

    destroy() {
        this.root.destroy()
    }

    showGrid(show: boolean) {
        this.root.visible = show
    }
}
