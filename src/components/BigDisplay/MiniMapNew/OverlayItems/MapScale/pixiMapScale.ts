import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { pixiStageZIndexes } from "../../../../../containers"
import { HEXToVBColor, intToLetter } from "../../../../../helpers"
import { fonts } from "../../../../../theme/theme"
import { Dimension, GAME_CLIENT_TILE_SIZE, Position } from "../../../../../types"
import { MAX_COLS, MAX_ROWS } from "../../ViewportItems/Grid/pixiGrid"

const GAP = 8

export class PixiMapScale {
    root: PIXI.Container<PIXI.DisplayObject>
    private label: PIXI.Text
    private coordLabel: PIXI.Text
    private line: PIXI.Graphics
    private viewport: Viewport
    private gridSizeRef: React.MutableRefObject<Dimension>
    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private animationFrame: number | undefined

    constructor(viewport: Viewport, gridSizeRef: React.MutableRefObject<Dimension>, mapMousePosition: React.MutableRefObject<Position | undefined>) {
        this.viewport = viewport
        this.gridSizeRef = gridSizeRef
        this.mapMousePosition = mapMousePosition

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiStageZIndexes.mapScale

        // Co-ordinate text
        this.coordLabel = new PIXI.Text("", {
            fontFamily: fonts.nostromoBold,
            fontSize: 10,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.coordLabel.resolution = 4
        this.coordLabel.zIndex = 5

        // Line
        this.line = new PIXI.Graphics()

        // Label
        this.label = new PIXI.Text(`${Math.round(GAME_CLIENT_TILE_SIZE / 100)}m`, {
            fontFamily: fonts.nostromoBold,
            fontSize: 10,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.label.anchor.set(0, 0)
        this.label.resolution = 4
        this.label.zIndex = 5

        // Add everything to container
        this.root.addChild(this.coordLabel)
        this.root.addChild(this.line)
        this.root.addChild(this.label)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    render() {
        const step = () => {
            // Get the grid row and column that the mouse is on
            const mousePos = this.mapMousePosition.current
            let highlightColIndex = -1
            let highlightRowIndex = -1
            if (mousePos) {
                const rowCount = Math.round(Math.min(this.viewport.worldHeight / this.gridSizeRef.current.height, MAX_ROWS))
                const colCount = Math.round(Math.min(this.viewport.worldWidth / this.gridSizeRef.current.width, MAX_COLS))
                const cellWidth = this.viewport.worldWidth / colCount
                const cellHeight = this.viewport.worldHeight / rowCount
                highlightColIndex = Math.floor(mousePos.x / cellWidth)
                highlightRowIndex = Math.floor(mousePos.y / cellHeight)
                this.coordLabel.text = `[${intToLetter(highlightColIndex + 1)}${highlightRowIndex}]`
            }

            // Rect
            const width = this.gridSizeRef.current.width * this.viewport.scale.x
            this.line.clear()
            this.line.lineStyle(1, HEXToVBColor("#FFFFFF"))
            this.line.moveTo(0, 0)
            this.line.lineTo(0, 4)
            this.line.lineTo(width, 4)
            this.line.lineTo(width, 0)
            this.line.position.set(this.coordLabel.width + GAP, 5)
            this.label.position.set(this.line.x + this.line.width + GAP, 0)

            this.root.pivot.set(this.root.width, this.root.height)
            this.root.x = this.viewport.screenWidth - GAP * 1.4
            this.root.y = this.viewport.screenHeight - GAP

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    updateVisibility(isVisible: boolean) {
        this.root.visible = isVisible
    }
}
