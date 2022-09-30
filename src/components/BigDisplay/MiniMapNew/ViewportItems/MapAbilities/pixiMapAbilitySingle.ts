import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"
import { PixiImageIcon } from "../../../../../pixi/pixiImageIcon"
import { Dimension, DisplayedAbility, GAME_CLIENT_TILE_SIZE, MiniMapDisplayEffectType } from "../../../../../types"

export class PixiMapAbilitySingle {
    root: PIXI.Container<PIXI.DisplayObject>
    private rootInner: PIXI.Container<PIXI.DisplayObject>
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
        this.root.zIndex = ability.show_below_mechs ? pixiViewportZIndexes.mapAbilitiesBelowMechs : pixiViewportZIndexes.mapAbilitiesAboveMechs
        this.rootInner = new PIXI.Container()
        this.rootInner.sortableChildren = true

        // Create image icon
        const sizeMultiplier = ability.grid_size_multiplier || 0.5
        this.imageIcon = new PixiImageIcon(
            ability.image_url,
            gridSizeRef.current.width * sizeMultiplier,
            gridSizeRef.current.height * sizeMultiplier,
            ability.colour,
            true,
        )

        // Position
        const pos = ability.location_in_pixels ? ability.location : gridCellToViewportPosition.current(ability.location.x, ability.location.y)
        this.root.position.set(pos.x, pos.y)

        // Radius
        if (ability.radius) {
            console.log(ability)
            const radius = (gridSizeRef.current.width * ability.radius) / GAME_CLIENT_TILE_SIZE
            this.imageIcon.showRangeRadius(radius, ability.border_width)
        }

        // Countdown timer
        if (ability.launching_at) {
            const secondsLeft = (new Date().getTime() - ability.launching_at.getTime()) / 1000
            this.imageIcon.startCountdown(secondsLeft)
        }

        // Add everything to container
        this.rootInner.addChild(this.imageIcon.root)
        this.root.addChild(this.rootInner)
        this.rootInner.alpha = 0

        // Animations
        ease.add(this.rootInner, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })

        // Drop effect
        if (ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Drop) {
            this.rootInner.scale.set(2)
            ease.add(this.rootInner, { scale: 1 }, { duration: 3000, ease: "easeOutQuad", removeExisting: true })
        }
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        ease.add(this.rootInner, { alpha: 0 }, { duration: 500, ease: "linear", removeExisting: true })
        setTimeout(() => {
            this.imageIcon.destroy()
            this.root.destroy()
        }, 1000)
    }
}
