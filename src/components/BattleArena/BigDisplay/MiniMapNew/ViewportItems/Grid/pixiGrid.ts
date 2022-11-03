import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../../containers"
import { HEXToVBColor, intToLetter } from "../../../../../../helpers"
import { colors, fonts } from "../../../../../../theme/theme"
import { Dimension, Position } from "../../../../../../types"

export const MAX_ROWS = 20
export const MAX_COLS = 20

export class PixiGrid {
    root: PIXI.Container<PIXI.DisplayObject>
    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private cellWidth: number
    private cellHeight: number

    private topLabels: PIXI.Text[] = []
    private leftLabels: PIXI.Text[] = []
    private viewport: Viewport
    private animationFrame: number | undefined

    constructor(viewport: Viewport, gridSizeRef: React.MutableRefObject<Dimension>, mapMousePosition: React.MutableRefObject<Position | undefined>) {
        this.viewport = viewport
        this.mapMousePosition = mapMousePosition

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.grid
        this.root.visible = false

        const rowCount = Math.round(Math.min(viewport.worldHeight / gridSizeRef.current.height, MAX_ROWS))
        const colCount = Math.round(Math.min(viewport.worldWidth / gridSizeRef.current.width, MAX_COLS))
        this.cellWidth = viewport.worldWidth / colCount
        this.cellHeight = viewport.worldHeight / rowCount

        // Loop through and render grid
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const posX = this.cellWidth * j
                const posY = this.cellHeight * i

                if (i === 0) {
                    // Top edge labels
                    const label = this.createTextLabel(`${intToLetter(j + 1)}`)
                    label.anchor.set(0.5, 0)
                    label.position.set(posX + this.cellWidth / 2, 0)
                    this.root.addChild(label)
                    this.topLabels.push(label)
                }

                if (j === 0) {
                    // Left edge labels
                    const label = this.createTextLabel(`${i + 1}`)
                    label.anchor.set(0, 0.5)
                    label.position.set(3, posY + this.cellHeight / 2)
                    this.root.addChild(label)
                    this.leftLabels.push(label)
                }

                const graphics = new PIXI.Graphics()
                graphics.lineStyle(1, HEXToVBColor(colors.offWhite))
                graphics.drawRect(0, 0, this.cellWidth, this.cellHeight)
                graphics.position.set(posX, posY)

                graphics.alpha = 0.06
                this.root.addChild(graphics)
            }
        }

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    createTextLabel(text: string) {
        const label = new PIXI.Text(text, {
            fontFamily: fonts.nostromoBold,
            fontSize: this.cellHeight / 4,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        label.resolution = 4
        label.alpha = 0.4
        return label
    }

    render() {
        const step = () => {
            // Get the grid row and column that the mouse is on
            const mousePos = this.mapMousePosition.current
            let highlightColIndex = -1
            let highlightRowIndex = -1
            if (mousePos) {
                highlightColIndex = Math.floor(mousePos.x / this.cellWidth)
                highlightRowIndex = Math.floor(mousePos.y / this.cellHeight)
            }

            // Makes sure the top and left labels are always visible
            this.topLabels.forEach((label, i) => {
                label.y = this.viewport.top

                if (i === highlightColIndex) {
                    label.alpha = 1
                    label.scale.set(1.4)
                } else {
                    label.alpha = 0.4
                    label.scale.set(1)
                }
            })

            this.leftLabels.forEach((label, i) => {
                label.x = this.viewport.left

                if (i === highlightRowIndex) {
                    label.alpha = 1
                    label.scale.set(1.4)
                } else {
                    label.alpha = 0.4
                    label.scale.set(1)
                }
            })

            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }

    showGrid(show: boolean) {
        this.root.visible = show
    }
}
