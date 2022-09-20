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
    private onCountdownExpired: () => void | undefined

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
        this.onCountdownExpired = onCountdownExpired
        const secondsLeft = endTime ? Math.max(Math.round((endTime.getTime() - new Date().getTime()) / 1000), 0) : undefined

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
            fill: "#FFFFFF",
            stroke: "#00000050",
            strokeThickness: 0.2,
            lineHeight: 1,
        })
        this.countdownLabel = new PIXI.Text(secondsLeft, labelStyle)
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

        ease.add(this.viewportRoot, { scale: 1.2 }, { duration: 500, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        this.render()

        if (secondsLeft) {
            if (secondsLeft > 0) {
                this.setCountdown(secondsLeft)
            } else {
                this.onCountdownExpired()
            }
        }
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.viewportRoot.destroy()
        this.stageRoot.destroy()
    }

    render() {
        const step = () => {
            if (this.mapMousePosition.current) {
                this.viewportRoot.position.set(this.mapMousePosition.current.x - this.icon.width / 2, this.mapMousePosition.current.y - this.icon.height / 2)
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

    setCountdown(secondsLeft: number) {
        let start: number | undefined
        let isDone = false
        let lastTimestamp = 0

        const step = (timestamp: DOMHighResTimeStamp) => {
            if (start === undefined) {
                start = timestamp
            }

            const elapsed = timestamp - lastTimestamp
            const totalElapsed = timestamp - start

            // Count per second
            if (elapsed >= 1000) {
                const timeLeft = Math.round(secondsLeft - totalElapsed / 1000)
                lastTimestamp = timestamp

                this.countdownLabel.text = Math.round(Math.max(timeLeft, 0))
                if (timeLeft <= 5) {
                    this.countdownLabel.style.fill = HEXToVBColor("#FF0000")
                }
            }

            if (totalElapsed > secondsLeft * 1000) {
                isDone = true
                start = undefined
                lastTimestamp = 0
                this.onCountdownExpired()
            }

            if (!isDone) this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    showIcon(toShow: boolean) {
        this.viewportRoot.visible = toShow
    }
}
