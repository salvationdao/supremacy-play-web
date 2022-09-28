import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"
import { HEXToVBColor } from "../../../../../helpers"
import { Dimension, GAME_CLIENT_TILE_SIZE } from "../../../../../types"
import { BlackoutEvent } from "./Blackouts"

const BLACKOUT_COLOR = "#101010"

export class PixiBlackout {
    root: PIXI.Container<PIXI.DisplayObject>
    private circle: PIXI.Graphics

    constructor(
        blackout: BlackoutEvent,
        gridSizeRef: React.MutableRefObject<Dimension>,
        gridCellToViewportPosition: React.MutableRefObject<
            (
                xCell: number,
                yCell: number,
            ) => {
                x: number
                y: number
            }
        >,
    ) {
        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.blackouts
        this.root.sortableChildren = true

        // Create blackout circle
        const radius = (gridSizeRef.current.width * blackout.radius) / GAME_CLIENT_TILE_SIZE
        const pos = gridCellToViewportPosition.current(blackout.coords.x, blackout.coords.y)
        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(3, HEXToVBColor(BLACKOUT_COLOR), 0.8)
        this.circle.beginFill(HEXToVBColor(BLACKOUT_COLOR), 0.82)
        this.circle.drawCircle(pos.x, pos.y, radius)
        this.circle.endFill()
        this.circle.alpha = 0
        ease.add(this.circle, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })

        // Add everything to container
        this.root.addChild(this.circle)
    }

    destroy() {
        ease.add(this.circle, { alpha: 0 }, { duration: 500, ease: "linear", removeExisting: true })
        setTimeout(() => {
            this.root.destroy()
        }, 1000)
    }
}
