import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, Dimension, GameAbility, GAME_CLIENT_TILE_SIZE, Position } from "../../../../../types"

const SIZE = 30

export class PixiTargetHint {
    stageRoot: PIXI.Container<PIXI.DisplayObject>
    viewportRoot: PIXI.Container<PIXI.DisplayObject>
    private icon: PIXI.Container
    private countdownLabel: PIXI.Text
    private lines: PIXI.Graphics

    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private gridSizeRef: React.MutableRefObject<Dimension>
    private animationFrame: number | undefined

    constructor(
        mapMousePosition: React.MutableRefObject<Position | undefined>,
        gridSizeRef: React.MutableRefObject<Dimension>,
        ability: GameAbility | BlueprintPlayerAbility,
        endTime: Date | undefined,
        onCountdownExpired: () => void | undefined,
    ) {
        this.mapMousePosition = mapMousePosition
        this.gridSizeRef = gridSizeRef

        // Create container for everything
        this.stageRoot = new PIXI.Container()
        this.stageRoot.zIndex = 50

        this.viewportRoot = new PIXI.Container()
        this.viewportRoot.zIndex = 60
        this.viewportRoot.sortableChildren = true

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
        this.lines = new PIXI.Graphics()

        // Add everything to container
        this.viewportRoot.addChild(this.icon)
        this.viewportRoot.addChild(this.countdownLabel)
        this.stageRoot.addChild(this.viewportRoot)

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
