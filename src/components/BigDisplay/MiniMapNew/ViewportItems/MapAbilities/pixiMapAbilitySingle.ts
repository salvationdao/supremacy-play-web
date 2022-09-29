import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"
import { PixiImageIcon } from "../../../../../pixi/pixiImageIcon"
import { Dimension, DisplayedAbility, GAME_CLIENT_TILE_SIZE } from "../../../../../types"

export class PixiMapAbilitySingle {
    root: PIXI.Container<PIXI.DisplayObject>
    private imageIcon: PixiImageIcon

    private ability: DisplayedAbility
    private animationFrame: number | undefined

    constructor(
        ability: DisplayedAbility,
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
        this.ability = ability

        // Create container
        this.root = new PIXI.Container()
        this.root.sortableChildren = true
        this.root.zIndex = ability.show_below_mechs ? pixiViewportZIndexes.mapAbilitiesBelowMechs : pixiViewportZIndexes.mapAbilitiesAboveMechs

        // Create image icon
        const sizeMultiplier = ability.grid_size_multiplier || 1
        this.imageIcon = new PixiImageIcon(
            ability.image_url,
            gridSizeRef.current.width * sizeMultiplier,
            gridSizeRef.current.height * sizeMultiplier,
            ability.colour,
            true,
        )

        // Position
        const pos = ability.location_in_pixels ? ability.location : gridCellToViewportPosition.current(ability.location.x, ability.location.y)
        this.imageIcon.root.position.set(pos.x, pos.y)

        // Radius
        if (ability.radius) {
            const radius = (gridSizeRef.current.width * ability.radius) / GAME_CLIENT_TILE_SIZE
            this.imageIcon.showRangeRadius(radius, ability.border_width)
        }

        // Countdown timer
        if (ability.launching_at) {
            const secondsLeft = (new Date().getTime() - ability.launching_at.getTime()) / 1000
            this.imageIcon.startCountdown(secondsLeft)
        }

        // Add everything to container
        this.root.addChild(this.imageIcon.root)
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.imageIcon.destroy()
        this.root.destroy()
    }
}
