import * as PIXI from "pixi.js"
import { clamp, HEXToVBColor } from "."

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
