import * as PIXI from "pixi.js"
import { clamp, HEXToVBColor } from "."
import { fonts } from "../theme/theme"

export class PixiProgressBar {
    root: PIXI.Container
    private trackRect: PIXI.Graphics
    private barRect: PIXI.Graphics
    private color: string
    private percent: number
    private width: number
    private height: number

    constructor(width: number, height: number, color: string, initialPercent = 80) {
        this.root = new PIXI.Container()
        this.trackRect = new PIXI.Graphics()
        this.barRect = new PIXI.Graphics()
        this.color = color
        this.percent = clamp(0, initialPercent, 100)
        this.width = width
        this.height = height

        this.trackRect.zIndex = 0
        this.barRect.zIndex = 1

        this.root.sortableChildren = true
        this.root.addChild(this.trackRect)
        this.root.addChild(this.barRect)

        this.render()
    }

    updateColor(color: string) {
        this.color = color
    }

    updatePercent(percent: number) {
        this.percent = clamp(0, percent, 100)
        this.render()
    }

    updatePosition(x: number, y: number) {
        this.root.position.set(x, y)
    }

    updateDimension(width: number, height: number) {
        this.width = width
        this.height = height
        this.render()
    }

    private render() {
        this.trackRect.clear()
        this.trackRect.beginFill(HEXToVBColor("#000000"), 0.65)
        this.trackRect.drawRoundedRect(0, 0, this.width, this.height, 0.5)
        this.trackRect.endFill

        this.barRect.clear()
        this.barRect.beginFill(HEXToVBColor(this.color))
        this.barRect.drawRoundedRect(0, 0, (this.percent * this.width) / 100, this.height, 0.5)
        this.barRect.endFill
    }
}

export class PixiImageIcon {
    root: PIXI.Container<PIXI.DisplayObject>
    private icon: PIXI.Container
    private countdownLabel: PIXI.Text
    private animationFrame: number | undefined

    constructor(imageUrl: string, width: number, height: number, borderColor: string, centerPivot?: boolean, alpha = 0.8) {
        this.root = new PIXI.Container()
        this.root.zIndex = 60
        this.root.sortableChildren = true

        // Image border
        const imageBorder = new PIXI.Graphics()
        imageBorder.lineStyle(1.2, HEXToVBColor(borderColor))
        imageBorder.drawRoundedRect(0, 0, width, height, 2)
        imageBorder.zIndex = 4

        // Image
        const iconImage = PIXI.Sprite.from(imageUrl)
        iconImage.width = width
        iconImage.height = height
        iconImage.zIndex = 3

        this.icon = new PIXI.Container()
        this.icon.sortableChildren = true
        this.icon.addChild(imageBorder)
        this.icon.addChild(iconImage)
        this.icon.alpha = alpha

        // Countdown label
        this.countdownLabel = new PIXI.Text(0, {
            fontFamily: fonts.shareTech,
            fontSize: 12,
            fontWeight: "bold",
            fill: "#FFFFFF",
            stroke: "#00000050",
            strokeThickness: 0.2,
            lineHeight: 1,
        })
        this.countdownLabel.anchor.set(0.5, 0)
        this.countdownLabel.resolution = 4
        this.countdownLabel.zIndex = 5
        this.countdownLabel.position.set(width / 2, -16)
        this.countdownLabel.visible = false

        this.root.addChild(this.icon)
        this.root.addChild(this.countdownLabel)

        if (centerPivot) this.root.pivot.set(this.root.width / 2, this.root.height / 2)
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    startCountdown(secondsLeft: number, countdownSpeed = 1, onExpired?: () => void) {
        let start: number | undefined
        let isDone = false
        this.countdownLabel.visible = true

        const step = (timestamp: DOMHighResTimeStamp) => {
            if (start === undefined) {
                start = timestamp
            }

            const totalElapsed = timestamp - start
            const timeLeft = secondsLeft - (totalElapsed * countdownSpeed) / 1000

            this.countdownLabel.text = Math.max(timeLeft, 0).toFixed(1)
            if (timeLeft <= 5) {
                this.countdownLabel.style.fill = HEXToVBColor("#FF0000")
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
    }

    showIcon(toShow: boolean) {
        this.root.visible = toShow
    }
}
