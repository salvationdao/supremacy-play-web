import merge from "deepmerge"
import { ease } from "pixi-ease"
import * as particles from "pixi-particles"
import * as PIXI from "pixi.js"
import { CircleParticle } from "../../../../../assets"
import { pixiViewportZIndexes } from "../../../../../containers"
import { explosionParticlesConfig, pulseParticlesConfig } from "../../../../../pixi/particleConfigs"
import { PixiImageIcon } from "../../../../../pixi/pixiImageIcon"
import { Dimension, DisplayedAbility, GAME_CLIENT_TILE_SIZE, MiniMapDisplayEffectType } from "../../../../../types"

export class PixiMapAbilitySingle {
    root: PIXI.Container<PIXI.DisplayObject>
    ability: DisplayedAbility
    private rootInner: PIXI.Container<PIXI.DisplayObject>
    private imageIcon: PixiImageIcon
    private emitter: particles.Emitter | undefined
    private animationFrame: number | undefined

    constructor(
        ability: DisplayedAbility,
        gridSizeRef: React.MutableRefObject<Dimension>,
        clientPositionToViewportPosition: React.MutableRefObject<
            (
                x: number,
                y: number,
            ) => {
                x: number
                y: number
            }
        >,
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
        const sizeMultiplier = ability.grid_size_multiplier || 0.7
        this.imageIcon = new PixiImageIcon(
            ability.image_url,
            gridSizeRef.current.width * sizeMultiplier,
            gridSizeRef.current.height * sizeMultiplier,
            ability.colour,
            true,
        )

        // Position
        const radius = ability.radius ? (gridSizeRef.current.width * ability.radius) / GAME_CLIENT_TILE_SIZE : undefined
        const pos = ability.location_in_pixels
            ? clientPositionToViewportPosition.current(ability.location.x, ability.location.y)
            : gridCellToViewportPosition.current(ability.location.x, ability.location.y)
        this.root.position.set(pos.x, pos.y)

        // Radius
        if (radius) this.imageIcon.showRangeRadius(radius, ability.border_width)

        // Countdown timer
        if (ability.launching_at) {
            const secondsLeft = (ability.launching_at.getTime() - new Date().getTime()) / 1000
            this.imageIcon.startCountdown(secondsLeft)
        }

        // Add everything to container
        this.rootInner.addChild(this.imageIcon.root)
        this.root.addChild(this.rootInner)
        this.rootInner.alpha = 0

        // Animations
        ease.add(this.rootInner, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })

        // Drop effect
        if (
            ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Drop ||
            ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Landmine
        ) {
            this.rootInner.scale.set(2)
            ease.add(this.rootInner, { scale: 1 }, { duration: 2000, ease: "easeOutQuad", removeExisting: true })
        }

        // Landmines has a 3s arm delay, change image after 3s
        if (ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Landmine) {
            this.imageIcon.hideBorder()

            if (ability.noAnim) return

            // Show an inactive landmine, then after 3s, show the active version
            if (this.imageIcon.imageSprite) {
                const newTexture = PIXI.Texture.from(
                    "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/mini-map/landmines/landmine.webp",
                )
                this.imageIcon.imageSprite.texture = newTexture
            }

            setTimeout(() => {
                if (this.imageIcon.imageSprite) {
                    const newTexture = PIXI.Texture.from(ability.image_url)
                    this.imageIcon.imageSprite.texture = newTexture
                }
            }, 3000)
        }

        // Pulse effect
        if (ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Pulse && radius) {
            const config = merge(pulseParticlesConfig, {
                color: { start: ability.colour, end: ability.colour },
                scale: {
                    start: 0.6,
                    end: 0.15,
                },
                speed: {
                    start: 150,
                    end: 150,
                },
                lifetime: {
                    min: radius / 150,
                    max: radius / 150,
                },
                frequency: 0.4,
                particlesPerWave: 30,
                particleSpacing: 12,
            })
            this.emitter?.destroy()
            this.emitter = new particles.Emitter(this.rootInner, CircleParticle, config)
            this.emitter.emit = true
        }

        // Explosion / range effect
        if (
            radius &&
            ((ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Explosion && !ability.launching_at) ||
                (ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Range && !ability.launching_at))
        ) {
            // Disabled the range radius
            this.imageIcon.showRangeRadius(undefined)
            const config = merge(explosionParticlesConfig, {
                scale: {
                    start: 0.6,
                    end: 0.11,
                },
                lifetime: {
                    min: 0.16,
                    max: 0.16,
                },
                spawnCircle: { r: radius / 4 },
                emitterLifetime: ability.mini_map_display_effect_type === MiniMapDisplayEffectType.Range ? -1 : 0.3,
            })
            this.emitter?.destroy()
            this.emitter = new particles.Emitter(this.rootInner, CircleParticle, config)
            this.emitter.emit = true
        }

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        ease.add(this.rootInner, { alpha: 0 }, { duration: 500, ease: "linear", removeExisting: true })
        setTimeout(() => {
            this.emitter?.destroy()
            this.imageIcon.destroy()
            this.root.destroy()
        }, 1000)
    }

    render() {
        let elapsed = Date.now()

        const step = () => {
            const now = Date.now()
            this.emitter?.update((now - elapsed) * 0.001)
            elapsed = now
            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }
}
