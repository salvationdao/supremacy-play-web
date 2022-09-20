import { ease } from "pixi-ease"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, Dimension, GameAbility, Position } from "../../../../../types"

const SIZE = 30

export class PixiTargetHint {
    stageRoot: PIXI.Container<PIXI.DisplayObject>
    viewportRoot: PIXI.Container<PIXI.DisplayObject>
    private icon: PIXI.Container
    private countdownLabel: PIXI.Text
    private colorOverlay: PIXI.Sprite
    private outerBorder: PIXI.Graphics

    private viewport: Viewport
    private ability: GameAbility | BlueprintPlayerAbility
    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private gridSizeRef: React.MutableRefObject<Dimension>
    private animationFrame: number | undefined

    constructor(
        viewport: Viewport,
        mapMousePosition: React.MutableRefObject<Position | undefined>,
        gridSizeRef: React.MutableRefObject<Dimension>,
        ability: GameAbility | BlueprintPlayerAbility,
        endTime: Date | undefined,
        onCountdownExpired: () => void | undefined,
    ) {
        this.viewport = viewport
        this.ability = ability
        this.mapMousePosition = mapMousePosition
        this.gridSizeRef = gridSizeRef

        // Create container for everything
        this.stageRoot = new PIXI.Container()
        this.stageRoot.zIndex = 50
        this.stageRoot.sortableChildren = true

        this.viewportRoot = new PIXI.Container()
        this.viewportRoot.zIndex = 60
        this.viewportRoot.sortableChildren = true

        // Big color overlay
        this.colorOverlay = PIXI.Sprite.from(PIXI.Texture.WHITE)
        this.colorOverlay.alpha = 0.05
        this.colorOverlay.tint = HEXToVBColor(this.ability.colour)
        this.colorOverlay.zIndex = 6

        // Icon
        // Image border
        const imageBorder = new PIXI.Graphics()
        imageBorder.lineStyle(1.2, HEXToVBColor(ability.colour))
        imageBorder.drawRoundedRect(0, 0, gridSizeRef.current.width, gridSizeRef.current.height, 2)
        imageBorder.zIndex = 4

        // Image
        const iconImage = PIXI.Sprite.from(ability.image_url)
        iconImage.width = gridSizeRef.current.width
        iconImage.height = gridSizeRef.current.height
        iconImage.zIndex = 3

        this.icon = new PIXI.Container()
        this.icon.sortableChildren = true
        this.icon.addChild(imageBorder)
        this.icon.addChild(iconImage)
        this.icon.alpha = 0.8

        // Countdown label
        const labelStyle = new PIXI.TextStyle({
            fontFamily: fonts.nostromoBlack,
            fontSize: 13,
            fill: "#FF0000",
            stroke: "#00000050",
            strokeThickness: 0.2,
            lineHeight: 1,
        })
        this.countdownLabel = new PIXI.Text(`15`, labelStyle)
        this.countdownLabel.anchor.set(0.5, 0)
        this.countdownLabel.resolution = 4
        this.countdownLabel.zIndex = 5
        this.countdownLabel.position.set(gridSizeRef.current.width / 2, -18)

        // Angle lines
        this.outerBorder = new PIXI.Graphics()
        this.outerBorder.zIndex = 8

        // Add everything to container
        this.viewportRoot.addChild(this.icon)
        this.viewportRoot.addChild(this.countdownLabel)
        this.stageRoot.addChild(this.colorOverlay)
        this.stageRoot.addChild(this.outerBorder)

        ease.add(this.viewportRoot, { scale: 1.2 }, { duration: 1000, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.viewportRoot.destroy()
        this.stageRoot.destroy()
    }

    render() {
        const step = () => {
            if (this.mapMousePosition.current) {
                this.viewportRoot.position.set(
                    this.mapMousePosition.current.x - this.viewportRoot.width / 2,
                    this.mapMousePosition.current.y - this.viewportRoot.height / 2,
                )
            }

            // Color overlay
            this.colorOverlay.width = this.viewport.screenWidth
            this.colorOverlay.height = this.viewport.screenHeight

            // Line graphics
            this.outerBorder.clear()
            this.outerBorder.lineStyle(4, HEXToVBColor(this.ability.colour))
            this.outerBorder.drawRect(0, 0, this.viewport.screenWidth, this.viewport.screenHeight)

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    showIcon(toShow: boolean) {
        this.viewportRoot.visible = toShow
    }
}
