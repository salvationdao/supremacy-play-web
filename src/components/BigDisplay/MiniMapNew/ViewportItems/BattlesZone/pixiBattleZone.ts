import merge from "deepmerge"
import { ease } from "pixi-ease"
import * as particles from "pixi-particles"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { CircleParticle } from "../../../../../assets"
import { pixiViewportZIndexes } from "../../../../../containers"
import { ringCloudParticlesConfig } from "../../../../../pixi/particleConfigs"
import { colors } from "../../../../../theme/theme"
import { BattleZoneStruct, Dimension, GAME_CLIENT_TILE_SIZE, Map } from "../../../../../types"
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
        battleZone: BattleZoneStruct,
        mapRef: React.MutableRefObject<Map | undefined>,
    ) {
        this.viewport = viewport
        this.gridSizeRef = gridSizeRef
        this.clientPositionToViewportPosition = clientPositionToViewportPosition

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.battleZone
        this.root.sortableChildren = true
        this.root.alpha = 0

        const pos = this.clientPositionToViewportPosition.current(battleZone.location.x, battleZone.location.y)
        const radius = (this.gridSizeRef.current.width * battleZone.radius) / GAME_CLIENT_TILE_SIZE

        // Particles
        this.particleContainer = new PIXI.Container()
        this.particleContainer.zIndex = 6
        this.particleContainer.position.set(pos.x, pos.y)

        const config = merge(ringCloudParticlesConfig, {
            scale: {
                start: (0.2 * this.gridSizeRef.current.width) / 10,
                end: (0.06 * this.gridSizeRef.current.width) / 10,
            },
            spawnCircle: { r: radius, minR: radius },
            color: { start: colors.niceRed, end: colors.niceRed },
        })
        this.emitter = new particles.Emitter(this.particleContainer, CircleParticle, config)
        this.emitter.emit = true

        // Dim the outside, this is a trick where the outside is darkened, trick is really thick border
        const borderThickness = this.viewport.worldWidth * 3
        const outsideColor = mapRef.current?.Name === "IronDust 5" ? "#000000" : colors.darkRed
        this.darkBackgroundTrick = new PIXI.Graphics()
        this.darkBackgroundTrick.zIndex = 2
        this.darkBackgroundTrick.clear()
        this.darkBackgroundTrick.lineStyle(borderThickness, HEXToVBColor(outsideColor), 0.4)
        this.darkBackgroundTrick.beginFill(HEXToVBColor("#FFFFFF"), 0)
        this.darkBackgroundTrick.drawCircle(0, 0, radius + borderThickness / 2)
        this.darkBackgroundTrick.endFill()
        this.darkBackgroundTrick.position.set(pos.x, pos.y)
        ease.add(this.darkBackgroundTrick, { alpha: 0.3 }, { duration: 1150, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        if (battleZone.warn_time) {
            this.darkBackgroundTrick.scale.set(1 + this.viewport.worldWidth / radius)
            setTimeout(() => {
                ease.add(this.darkBackgroundTrick, { scale: 1 }, { duration: battleZone.shrink_time * 1000, ease: "linear", removeExisting: true })
            }, battleZone.warn_time * 1000)
        }

        // Transition in
        ease.add(this.root, { alpha: 1 }, { duration: 1000, ease: "linear", removeExisting: true })

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

    updateBattleZone(battleZone: BattleZoneStruct) {
        if (!this.emitter) return

        const pos = this.clientPositionToViewportPosition.current(battleZone.location.x, battleZone.location.y)
        const radius = (this.gridSizeRef.current.width * battleZone.radius) / GAME_CLIENT_TILE_SIZE

        // Particles and the outside dark overlay
        const scale = radius / this.emitter.spawnCircle.radius
        ease.add(this.particleContainer, { scale, x: pos.x, y: pos.y }, { duration: 2000, ease: "linear", removeExisting: true })

        if (battleZone.warn_time) {
            setTimeout(() => {
                ease.add(
                    this.darkBackgroundTrick,
                    { scale, x: pos.x, y: pos.y },
                    { duration: battleZone.shrink_time * 1000, ease: "linear", removeExisting: true },
                )
            }, battleZone.warn_time * 1000)
        }
    }
}
