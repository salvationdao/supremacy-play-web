import { mergeDeep } from "./../../../../../helpers/index"
import { ease } from "pixi-ease"
import * as particles from "pixi-particles"
import * as PIXI from "pixi.js"
import { CircleParticle } from "../../../../../assets"
import { pixiViewportZIndexes } from "../../../../../containers"
import { HEXToVBColor } from "../../../../../helpers"
import { blackoutParticlesConfig } from "../../../../../pixi/particleConfigs"
import { Dimension, GAME_CLIENT_TILE_SIZE } from "../../../../../types"
import { BlackoutEvent } from "./Blackouts"

export class PixiBlackout {
    root: PIXI.Container<PIXI.DisplayObject>
    private emitter: particles.Emitter
    private animationFrame: number | undefined
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
        // Create blackout circle
        const radius = (gridSizeRef.current.width * blackout.radius) / GAME_CLIENT_TILE_SIZE
        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(2, HEXToVBColor("#000000"), 0.8)
        this.circle.beginFill(HEXToVBColor("#000000"), 0.82)
        this.circle.drawCircle(0, 0, radius)
        this.circle.endFill()

        // Create container for everything
        const pos = gridCellToViewportPosition.current(blackout.coords.x, blackout.coords.y)
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.blackouts
        this.root.sortableChildren = true
        this.root.alpha = 0
        this.root.position.set(pos.x, pos.y)
        ease.add(this.root, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })

        // Particles
        const config = mergeDeep(blackoutParticlesConfig, { spawnCircle: { r: radius, minR: radius } })
        this.emitter = new particles.Emitter(this.root, CircleParticle, config)
        this.emitter.emit = true
        this.render()

        // Add everything to container
        this.root.addChild(this.circle)
    }

    destroy() {
        ease.add(this.root, { alpha: 0 }, { duration: 500, ease: "linear", removeExisting: true })
        setTimeout(() => {
            this.root.destroy()
        }, 1000)
    }

    render() {
        let elapsed = Date.now()

        const step = () => {
            const now = Date.now()
            this.emitter.update((now - elapsed) * 0.001)
            elapsed = now

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }
}
