import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { GameAbility } from "../../../../../types"

const SIZE = 26

export class PixiMechAbility {
    root: PIXI.Container<PIXI.DisplayObject>
    private ability: GameAbility
    private image: PIXI.Sprite
    private imageBorder: PIXI.Graphics
    private label: PIXI.Text
    private isCountingDown = false
    private onClickHandler: undefined | (() => void)

    constructor(ability: GameAbility) {
        const { colour, image_url, label } = ability

        this.ability = ability

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = 20
        this.root.sortableChildren = true

        // Image border
        this.imageBorder = new PIXI.Graphics()
        this.imageBorder.lineStyle(1, HEXToVBColor(colour))
        this.imageBorder.drawRoundedRect(0, 0, SIZE, SIZE, 2)
        this.imageBorder.zIndex = 4

        // Image
        this.image = PIXI.Sprite.from(image_url)
        this.image.width = SIZE
        this.image.height = SIZE
        this.image.zIndex = 3

        // Label
        const labelStyle = new PIXI.TextStyle({
            fontFamily: fonts.shareTech,
            fontSize: 15,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.label = new PIXI.Text(label, labelStyle)
        this.label.anchor.set(0, 0.5)
        this.label.resolution = 4
        this.label.zIndex = 5
        this.label.position.set(SIZE + 5, SIZE / 2)

        // Add everything to container
        this.root.addChild(this.imageBorder)
        this.root.addChild(this.image)
        this.root.addChild(this.label)
    }

    destroy() {
        this.root.destroy(true)
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
        this.image.interactive = true
        this.image.buttonMode = true
        this.root.alpha = 1
        this.image.on("pointerup", this.onClickHandler)
    }

    removeOnClick() {
        this.image.interactive = false
        this.image.buttonMode = false
        this.root.alpha = 0.5
        this.image.removeAllListeners("pointerup")
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
                this.label.text = this.ability.label
                this.label.style.fill = HEXToVBColor("#FFFFFF")
                this.addOnClick()
            }

            if (!isDone) requestAnimationFrame(step)
        }

        this.isCountingDown = true
        requestAnimationFrame(step)
    }
}
