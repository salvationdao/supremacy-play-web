import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, GameAbility, GAME_CLIENT_TILE_SIZE } from "../../../../../types"

const SIZE = 30

export class PixiTargetHint {
    root: PIXI.Container<PIXI.DisplayObject>
    mouseRoot: PIXI.Container<PIXI.DisplayObject>
    private icon: PIXI.Container
    private countdownLabel: PIXI.Text
    private lines: PIXI.Graphics

    private viewport: Viewport
    private animationFrame: number | undefined

    constructor(viewport: Viewport, ability: GameAbility | BlueprintPlayerAbility, endTime: Date | undefined, onCountdownExpired: () => void | undefined) {
        this.viewport = viewport

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = 50

        this.mouseRoot = new PIXI.Container()
        this.mouseRoot.interactive = true

        // Icon
        // Image border
        const imageBorder = new PIXI.Graphics()
        imageBorder.lineStyle(1.2, HEXToVBColor(ability.colour))
        imageBorder.drawRoundedRect(0, 0, SIZE, SIZE, 2)
        imageBorder.zIndex = 4

        // Image
        const iconImage = PIXI.Sprite.from(ability.image_url)
        iconImage.width = SIZE
        iconImage.height = SIZE
        iconImage.zIndex = 3

        this.icon = new PIXI.Container()
        this.icon.sortableChildren = true
        this.icon.addChild(imageBorder)
        this.icon.addChild(iconImage)

        // Label
        const labelStyle = new PIXI.TextStyle({
            fontFamily: fonts.shareTech,
            fontSize: 12,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.countdownLabel = new PIXI.Text(`${Math.round(GAME_CLIENT_TILE_SIZE / 100)}m`, labelStyle)
        this.countdownLabel.anchor.set(0.5, 0)
        this.countdownLabel.resolution = 4
        this.countdownLabel.zIndex = 5

        // Angle lines
        this.lines = new PIXI.Graphics()

        // Add everything to container
        this.mouseRoot.addChild(this.icon)
        this.root.addChild(this.mouseRoot)

        this.mouseRoot.on("mousemove", (event) => {
            const mousePos = viewport.toWorld(event.data.global)
            this.mouseRoot.x = mousePos.x
            this.mouseRoot.y = mousePos.y
            console.log(event.data.global)
        })

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy(true)
    }

    render() {
        const step = () => {
            // Rect
            // this.line.clear()
            // this.line.lineStyle(1, HEXToVBColor("#FFFFFF"))
            // this.line.moveTo(0, 0)
            // this.line.lineTo(0, 4)
            // this.line.lineTo(width, 4)
            // this.line.lineTo(width, 0)

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }
}
