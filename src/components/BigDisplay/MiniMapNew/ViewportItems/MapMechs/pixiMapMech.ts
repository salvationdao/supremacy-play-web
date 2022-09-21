import { DashLine } from "pixi-dashed-line"
import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import { CrossPNG, DeadSkullPNG } from "../../../../../assets"
import { deg2rad, HEXToVBColor } from "../../../../../helpers"
import { PixiProgressBar } from "../../../../../helpers/pixiHelpers"
import { colors, fonts } from "../../../../../theme/theme"
import { Dimension, Position } from "../../../../../types"

export class PixiMapMech {
    root: PIXI.Container<PIXI.DisplayObject>
    rootInner: PIXI.Container<PIXI.DisplayObject>
    private rectGraphics: PIXI.Graphics
    private arrowGraphics: PIXI.Graphics
    private numberText: PIXI.Text
    private hpBar: PixiProgressBar
    private shieldBar: PixiProgressBar
    private mechMoveSprite: PIXI.Sprite
    private mechMoveDashedLine: PIXI.Graphics
    private highlightedCircle: PIXI.Graphics
    private skull: PIXI.Sprite
    private mechMovePosition: Position | undefined
    private animationFrame: number | undefined
    private iconDimension: Dimension | undefined
    private primaryColor: string | undefined
    private cachedZIndex = 10

    constructor(label: number) {
        // Create container for everything
        this.root = new PIXI.Container()
        this.root.sortableChildren = true
        this.root.zIndex = this.cachedZIndex

        // Root inner
        this.rootInner = new PIXI.Container()
        this.rootInner.x = -100
        this.rootInner.y = -100
        this.rootInner.sortableChildren = true
        this.rootInner.interactive = true
        this.rootInner.buttonMode = true
        this.rootInner.zIndex = 3

        // Rect
        this.rectGraphics = new PIXI.Graphics()

        // Rotation arrow
        this.arrowGraphics = new PIXI.Graphics()
        this.arrowGraphics.zIndex = 9

        // Number text
        this.numberText = new PIXI.Text(label, {
            fontFamily: fonts.nostromoBlack,
            fontSize: 15,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.numberText.anchor.set(0.5, 0.5)
        this.numberText.resolution = 4

        // Progress bars
        this.hpBar = new PixiProgressBar(0, 0, colors.health, 0)
        this.shieldBar = new PixiProgressBar(0, 0, colors.shield, 0)

        // Highlighted mech circle
        this.highlightedCircle = new PIXI.Graphics()
        this.highlightedCircle.zIndex = 20
        ease.add(this.highlightedCircle, { rotation: deg2rad(360) }, { duration: 3000, ease: "linear", repeat: true, removeExisting: true })
        ease.add(this.highlightedCircle, { scale: 1.2 }, { duration: 1000, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        // Skull
        this.skull = PIXI.Sprite.from(DeadSkullPNG)
        this.skull.anchor.set(0.5, 0.42)
        this.skull.width = 3
        this.skull.height = 3

        // Mech move sprite
        this.mechMoveDashedLine = new PIXI.Graphics()
        this.mechMoveSprite = PIXI.Sprite.from(CrossPNG)
        this.mechMoveSprite.visible = false
        this.mechMoveSprite.zIndex = 2
        this.mechMoveDashedLine.zIndex = 1

        // Add everything to container
        this.rootInner.addChild(this.rectGraphics)
        this.rootInner.addChild(this.arrowGraphics)
        this.rootInner.addChild(this.numberText)
        this.rootInner.addChild(this.hpBar.root)
        this.rootInner.addChild(this.shieldBar.root)
        this.rootInner.addChild(this.highlightedCircle)
        this.rootInner.addChild(this.skull)
        this.root.addChild(this.rootInner)
        this.root.addChild(this.mechMoveSprite)
        this.root.addChild(this.mechMoveDashedLine)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    updateStyles(primaryColor: string, iconDimension: Dimension) {
        this.iconDimension = iconDimension
        this.primaryColor = primaryColor

        // Update number text
        this.numberText.style.fill = primaryColor
        this.numberText.style.fontSize = iconDimension.height / 1.8
        this.numberText.position.set(iconDimension.width / 2, iconDimension.height / 2.3)

        // Update rect box
        this.rectGraphics.clear()
        this.rectGraphics.beginFill(HEXToVBColor("#000000"), 0.8)
        this.rectGraphics.lineStyle(iconDimension.height * 0.08, HEXToVBColor(primaryColor))
        this.rectGraphics.drawRoundedRect(0, 0, iconDimension.width, iconDimension.height, 6)
        this.rectGraphics.endFill()
        this.skull.position.set(iconDimension.width / 2, iconDimension.height / 2.3)
        this.skull.width = iconDimension.width / 1.5
        this.skull.height = iconDimension.height / 1.5
        this.skull.tint = HEXToVBColor(primaryColor)

        // Update rotation arrow
        // Draw the rotation arrow
        const triangleWidth = iconDimension.width / 4.2
        const triangleHeight = triangleWidth * 0.9
        const triangleHalfway = triangleWidth / 2

        const triPoint1 = [0, 0]
        const triPoint2 = [triangleWidth, 0]
        const triPoint3 = [triangleHalfway, -triangleHeight]
        // Draw the triangle
        this.arrowGraphics.beginFill(HEXToVBColor(primaryColor))
        this.arrowGraphics.lineStyle(1, HEXToVBColor(primaryColor))
        this.arrowGraphics.moveTo(triPoint1[0], triPoint1[1])
        this.arrowGraphics.lineTo(triPoint2[0], triPoint2[1])
        this.arrowGraphics.lineTo(triPoint3[0], triPoint3[1])
        this.arrowGraphics.lineTo(triPoint1[0], triPoint1[1])
        this.arrowGraphics.closePath()
        this.arrowGraphics.endFill()
        this.arrowGraphics.position.set(iconDimension.width / 2, iconDimension.height / 2)
        this.arrowGraphics.pivot.set(triangleHalfway, iconDimension.height / 2 + iconDimension.height / 3.4)

        // Update mech move sprite
        // Update the mech move sprite dimension
        this.mechMoveSprite.width = iconDimension.width / 2
        this.mechMoveSprite.height = iconDimension.height / 2
        this.mechMoveSprite.tint = HEXToVBColor(primaryColor)
    }

    updateHpShieldBars(iconDimension: Dimension) {
        // Update bars dimension and position
        const barHeight = iconDimension.height / 5
        const barGap = iconDimension.height * 0.1
        this.hpBar.updateDimension(iconDimension.width, barHeight)
        this.shieldBar.updateDimension(iconDimension.width, barHeight)
        this.hpBar.updatePosition(0, iconDimension.height + barGap)
        this.shieldBar.updatePosition(0, iconDimension.height + barHeight + 2 * barGap)
    }

    updateZIndex(zIndex: number, cache?: boolean) {
        if (cache) this.cachedZIndex = this.root.zIndex
        this.root.zIndex = zIndex
    }

    highlightMech(iconDimension: Dimension) {
        this.highlightedCircle.clear()
        const dash = new DashLine(this.highlightedCircle, {
            dash: [4, 2],
            width: iconDimension.height * 0.09,
            color: HEXToVBColor(colors.orange),
            alpha: 1,
        })

        const center = [iconDimension.width / 2, iconDimension.height / 2]
        const radius = iconDimension.width / 1.4
        dash.drawCircle(0, 0, radius)
        this.highlightedCircle.position.set(center[0], center[1])

        this.updateZIndex(10, true)

        // Enlarge the map mech
        ease.add(this.rootInner, { scale: 1.5 }, { duration: 100, ease: "linear", removeExisting: true })
    }

    unhighlightMech() {
        this.highlightedCircle.clear()
        ease.add(this.rootInner, { scale: 1 }, { duration: 100, ease: "linear", removeExisting: true })
        this.updateZIndex(this.cachedZIndex)
    }

    updateHpBar(percent: number) {
        this.hpBar.updateColor(percent < 45 ? colors.red : colors.health)
        this.hpBar.updatePercent(percent)

        // If it's dead, show dead stuff
        if (percent <= 0) {
            this.numberText.visible = false
            this.hpBar.root.visible = false
            this.shieldBar.root.visible = false
            this.arrowGraphics.visible = false
            this.mechMoveSprite.visible = false
            this.mechMoveDashedLine.visible = false
            this.root.alpha = 0.6
            this.skull.visible = true
        } else {
            this.numberText.visible = true
            this.hpBar.root.visible = true
            this.shieldBar.root.visible = true
            this.arrowGraphics.visible = true
            this.mechMoveSprite.visible = true
            this.mechMoveDashedLine.visible = true
            this.root.alpha = 1
            this.skull.visible = false
        }
    }

    updateShieldBar(percent: number) {
        this.shieldBar.updatePercent(percent)
    }

    updatePosition(x: number, y: number) {
        // Default its the top left corner, so center it
        const newX = x - this.rectGraphics.width / 2
        const newY = y - this.rectGraphics.height / 2
        ease.add(this.rootInner, { x: newX, y: newY }, { duration: 275, ease: "linear", removeExisting: true })
    }

    updateRotation(newRotRad: number) {
        ease.add(this.arrowGraphics, { rotation: newRotRad }, { duration: 275, ease: "linear" })
    }

    updateMechMovePosition(x: number, y: number) {
        this.mechMovePosition = { x, y }
    }

    hideMechMovePosition() {
        this.mechMoveDashedLine.clear()
        this.mechMoveSprite.visible = false
        this.mechMovePosition = undefined
    }

    updateVisibility(isVisible: boolean) {
        this.rootInner.visible = isVisible
    }

    render() {
        const step = () => {
            if (this.iconDimension && this.primaryColor && this.mechMovePosition) {
                this.mechMoveDashedLine.clear()

                // Default its the top left corner, so center it
                const newX = this.mechMovePosition.x
                const newY = this.mechMovePosition.y
                this.mechMoveSprite.anchor.set(0.5, 0.5)
                this.mechMoveSprite.position.set(newX, newY)
                this.mechMoveSprite.visible = true

                // Draw dashed line
                const dash = new DashLine(this.mechMoveDashedLine, {
                    dash: [5, 4],
                    width: this.iconDimension.height * 0.08,
                    color: HEXToVBColor(this.primaryColor),
                    alpha: 0.8,
                })
                dash.moveTo(this.rootInner.x + this.rectGraphics.width / 2, this.rootInner.y + this.rectGraphics.height / 2).lineTo(newX, newY)
            }

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }
}
