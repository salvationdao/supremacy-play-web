import { ease } from "pixi-ease"
import * as particles from "pixi-particles"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { CircleParticle } from "../../../../../assets"
import { pixiViewportZIndexes } from "../../../../../containers"
import { mergeDeep } from "../../../../../helpers"
import { battleZoneParticlesConfig } from "../../../../../pixi/particleConfigs"
import { colors } from "../../../../../theme/theme"
import { BattleZoneStruct, Dimension, GAME_CLIENT_TILE_SIZE } from "../../../../../types"
import { HEXToVBColor } from "./../../../../../helpers/index"

export class PixiBattleZone {
    root: PIXI.Container<PIXI.DisplayObject>
    private emitter: particles.Emitter | undefined
    private particleContainer: PIXI.Container
    private darkBackgroundTrick: PIXI.Graphics

    private animationFrame: number | undefined
    private viewport: Viewport
    private gridSizeRef: React.MutableRefObject<Dimension>
    private clientPositionToViewportPosition: React.MutableRefObject<
        (
            x: number,
            y: number,
        ) => {
            x: number
            y: number
        }
    >

    constructor(
        viewport: Viewport,
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
    ) {
        this.viewport = viewport
        this.gridSizeRef = gridSizeRef
        this.clientPositionToViewportPosition = clientPositionToViewportPosition

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.battleZone
        this.root.sortableChildren = true

        this.particleContainer = new PIXI.Container()
        this.darkBackgroundTrick = new PIXI.Graphics()

        // Add everything to container
        this.root.addChild(this.particleContainer)
        this.root.addChild(this.darkBackgroundTrick)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
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

    updateBattleZone(battleZone: BattleZoneStruct | undefined) {
        this.emitter?.destroy()
        this.darkBackgroundTrick.clear()
        if (!battleZone) return

        const pos = this.clientPositionToViewportPosition.current(battleZone.location.x, battleZone.location.y)
        const radius = (this.gridSizeRef.current.width * battleZone.radius) / GAME_CLIENT_TILE_SIZE
        this.particleContainer.position.set(pos.x, pos.y)
        this.particleContainer.alpha = 0
        ease.add(this.particleContainer, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })

        // Particles
        const config = mergeDeep(battleZoneParticlesConfig, { spawnCircle: { r: radius, minR: radius }, color: { start: colors.niceRed, end: colors.niceRed } })
        this.emitter = new particles.Emitter(this.particleContainer, CircleParticle, config)
        this.emitter.emit = true

        // Dim the outside, this is a trick where the outside is darkened, trick is really thick border
        this.darkBackgroundTrick.lineStyle(6000, HEXToVBColor("#000000"), 0.8)
        this.darkBackgroundTrick.beginFill(HEXToVBColor("#FF0000"), 0)
        this.darkBackgroundTrick.drawCircle(0, 0, radius)
        this.darkBackgroundTrick.endFill()
        this.darkBackgroundTrick.position.set(pos.x, pos.y)
    }
}
