import merge from "deepmerge"
import { ease } from "pixi-ease"
import * as particles from "pixi-particles"
import * as PIXI from "pixi.js"
import { CircleParticle } from "../../../../../assets"
import { pixiViewportZIndexes } from "../../../../../containers"
import { HEXToVBColor } from "../../../../../helpers"
import { ringCloudParticlesConfig } from "../../../../../pixi/particleConfigs"
import { Dimension, GAME_CLIENT_TILE_SIZE } from "../../../../../types"
import { BlackoutEvent } from "./Blackouts"

export class PixiBlackout {
    root: PIXI.Container<PIXI.DisplayObject>
    private emitter: particles.Emitter
    private animationFrame: number | undefined
    private circle: PIXI.Graphics
    private gridSizeRef: React.MutableRefObject<Dimension>

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
        this.gridSizeRef = gridSizeRef

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.blackouts
        this.root.sortableChildren = true

        // Create blackout circle
        const pos = gridCellToViewportPosition.current(blackout.coords.x, blackout.coords.y)
        const radius = (gridSizeRef.current.width * blackout.radius) / GAME_CLIENT_TILE_SIZE
        this.circle = new PIXI.Graphics()
        this.circle.beginFill(HEXToVBColor("#000000"), 0.82)
        this.circle.drawCircle(0, 0, radius)
        this.circle.endFill()
        this.circle.position.set(pos.x, pos.y)
        this.circle.alpha = 0
        ease.add(this.circle, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })

        // Particles
        const config = merge(ringCloudParticlesConfig, {
            scale: {
                start: (0.25 * this.gridSizeRef.current.width) / 10,
                end: (0.08 * this.gridSizeRef.current.width) / 10,
            },
            spawnCircle: { r: radius, minR: radius },
            color: { start: "#000000", end: "#000000" },
        })
        this.emitter = new particles.Emitter(this.circle, CircleParticle, config)
        this.emitter.emit = true
        this.render()

        // Add everything to container
        this.root.addChild(this.circle)
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
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
