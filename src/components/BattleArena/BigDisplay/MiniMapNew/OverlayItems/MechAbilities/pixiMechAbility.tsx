import * as PIXI from "pixi.js"
import { MECH_ABILITY_KEY } from "../../../../../../containers"
import { HEXToVBColor } from "../../../../../../helpers"
import { PixiImageIcon } from "../../../../../../pixi/pixiImageIcon"
import { colors, fonts } from "../../../../../../theme/theme"
import { AnyAbility } from "../../../../../../types"

const SIZE = 22

export class PixiMechAbility {
    root: PIXI.Container<PIXI.DisplayObject>
    private icon: PixiImageIcon
    private label: PIXI.Text
    private isCountingDown = false
    private onClickHandler: undefined | (() => void)
    private labelText = ""
    private animationFrame: number | undefined

    constructor(index: number, anyAbility: AnyAbility) {
        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = 20
        this.root.sortableChildren = true

        this.icon = new PixiImageIcon(anyAbility.image_url, SIZE, SIZE, anyAbility.colour)

        // Label
        this.labelText = `${anyAbility.label} [${MECH_ABILITY_KEY[index]}]`
        this.label = new PIXI.Text(this.labelText, {
            fontFamily: fonts.rajdhaniMedium,
            fontSize: 12,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.label.anchor.set(0, 0.5)
        this.label.resolution = 4
        this.label.zIndex = 5
        this.label.position.set(SIZE + 5, SIZE / 2)

        // Add everything to container
        this.root.addChild(this.icon.root)
        this.root.addChild(this.label)
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    getDefaultHeight() {
        return this.root.height
    }

    updateOnClick(onClick: () => void) {
        this.onClickHandler = onClick
        this.addOnClick()
    }

    addOnClick() {
        this.removeOnClick()
        if (!this.onClickHandler) return
        this.icon.root.interactive = true
        this.icon.root.buttonMode = true
        this.root.alpha = 1
        this.icon.root.on("pointerup", this.onClickHandler)
    }

    removeOnClick() {
        this.icon.root.interactive = false
        this.icon.root.buttonMode = false
        this.root.alpha = 0.4
        this.icon.root.removeAllListeners("pointerup")
    }

    setCountdown(secondsLeft: number) {
        if (this.isCountingDown) return

        let start: number | undefined
        let isDone = false
        let lastTimestamp = 0

        const step = (timestamp: DOMHighResTimeStamp) => {
            if (start === undefined) {
                start = timestamp
            }

            const elapsed = timestamp - lastTimestamp
            const totalElapsed = timestamp - start

            if (elapsed >= 1000) {
                this.label.style.fill = HEXToVBColor(colors.lightGrey)
                const timeLeft = Math.round(secondsLeft - totalElapsed / 1000)
                this.label.text = timeLeft > 100 ? "∞" : `${timeLeft}s`
                this.removeOnClick()
                lastTimestamp = timestamp
            }

            if (totalElapsed > secondsLeft * 1000) {
                isDone = true
                start = undefined
                lastTimestamp = 0
                this.isCountingDown = false
                this.label.text = this.labelText
                this.label.style.fill = HEXToVBColor("#FFFFFF")
                this.addOnClick()
            }

            if (!isDone) this.animationFrame = requestAnimationFrame(step)
        }

        this.isCountingDown = true
        this.animationFrame = requestAnimationFrame(step)
    }
}
