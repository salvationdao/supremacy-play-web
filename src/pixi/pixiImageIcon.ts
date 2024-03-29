import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../helpers"
import { colors, fonts } from "../theme/theme"

export class PixiImageIcon {
    root: PIXI.Container<PIXI.DisplayObject>
    imageSprite: PIXI.Sprite | undefined
    private icon: PIXI.Container
    private countdownLabel: PIXI.Text
    private animationFrame: number | undefined
    private imageBorder: PIXI.Graphics
    private rangeRadius: PIXI.Graphics
    private borderColor: string

    constructor(imageUrl: string, width: number, height: number, borderColor: string, centerPivot?: boolean, alpha = 0.8, hideBorder = false) {
        this.borderColor = borderColor

        this.root = new PIXI.Container()
        this.root.zIndex = 60
        this.root.sortableChildren = true

        // Image border
        this.imageBorder = new PIXI.Graphics()
        this.imageBorder.zIndex = 4

        this.icon = new PIXI.Container()
        this.icon.sortableChildren = true
        this.icon.addChild(this.imageBorder)
        this.icon.alpha = alpha

        // Image
        if (imageUrl) {
            this.imageBorder.lineStyle(1.2, HEXToVBColor(borderColor))
            this.imageBorder.drawRoundedRect(0, 0, width, height, 2)
            if (hideBorder) this.hideBorder()

            this.imageSprite = PIXI.Sprite.from(imageUrl)
            this.imageSprite.width = width
            this.imageSprite.height = height
            this.imageSprite.zIndex = 3
            this.icon.addChild(this.imageSprite)
        }

        // Countdown label
        this.countdownLabel = new PIXI.Text("", {
            fontFamily: fonts.rajdhaniMedium,
            fontSize: height,
            fontWeight: "bold",
            fill: "#FFFFFF",
            stroke: "#00000050",
            strokeThickness: 0.2,
            lineHeight: 1,
        })
        this.countdownLabel.anchor.set(0.5, 0)
        this.countdownLabel.resolution = 4
        this.countdownLabel.zIndex = 5
        this.countdownLabel.position.set(width / 2, -height - 2)
        this.countdownLabel.visible = false

        // Range radius
        this.rangeRadius = new PIXI.Graphics()
        this.rangeRadius.pivot.set(-width / 2, -height / 2)
        this.rangeRadius.zIndex = 2

        this.root.addChild(this.icon)
        this.root.addChild(this.countdownLabel)
        this.root.addChild(this.rangeRadius)

        if (centerPivot) this.root.pivot.set(this.root.width / 2, this.root.height / 2)
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    startCountdown(secondsLeft: number, countdownSpeed = 1, onExpired?: undefined | (() => void), showCountdownLabel = true) {
        if (secondsLeft < 0) return

        let start: number | undefined
        let isDone = false
        this.countdownLabel.visible = showCountdownLabel

        const step = (timestamp: DOMHighResTimeStamp) => {
            if (start === undefined) {
                start = timestamp
            }

            const totalElapsed = timestamp - start
            const timeLeft = secondsLeft - (totalElapsed * countdownSpeed) / 1000

            const text = Math.max(timeLeft, 0)
            this.countdownLabel.text = text <= 0 ? "" : text.toFixed(1)
            if (timeLeft <= 5) {
                this.countdownLabel.style.fill = HEXToVBColor(colors.niceRed)
            }

            if (totalElapsed * countdownSpeed > secondsLeft * 1000) {
                isDone = true
                start = undefined
                this.countdownLabel.visible = false
                onExpired && onExpired()
            }

            if (!isDone) this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    resetCountdown() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.countdownLabel.visible = false
    }

    showIcon(toShow: boolean) {
        this.root.visible = toShow
    }

    showRangeRadius(radius: number | undefined, borderWidth = 2) {
        // Draw the range
        this.rangeRadius.clear()
        if (radius) {
            this.rangeRadius.lineStyle(borderWidth, HEXToVBColor(this.borderColor))
            this.rangeRadius.beginFill(HEXToVBColor(this.borderColor), 0.4)
            this.rangeRadius.drawCircle(0, 0, radius)
            this.rangeRadius.endFill()
        }
    }

    hideBorder() {
        this.imageBorder.clear()
    }
}
