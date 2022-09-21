import { ease } from "pixi-ease"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { AbilityCancelPNG } from "../../../../../assets"
import { HEXToVBColor } from "../../../../../helpers"
import { fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, Dimension, GameAbility, LocationSelectType, Position } from "../../../../../types"

const getAbilityLabel = (ability: GameAbility | BlueprintPlayerAbility): string => {
    let label = "Select a location to use"

    switch (ability.location_select_type) {
        case LocationSelectType.LocationSelect:
        case LocationSelectType.MechCommand:
            label = "Select a location to deploy"
            break
        case LocationSelectType.MechSelect:
            label = "Select a mech to activate"
            break
        case LocationSelectType.MechSelectAllied:
            label = "Select an allied mech to activate"
            break
        case LocationSelectType.MechSelectOpponent:
            label = "Select an opponent mech to activate"
            break
        case LocationSelectType.LineSelect:
            label = "Draw a line by selecting two locations to deploy"
            break
    }

    return `${label} ${ability.label}.`
}

export class PixiTargetHint {
    stageRoot: PIXI.Container<PIXI.DisplayObject>
    viewportRoot: PIXI.Container<PIXI.DisplayObject>
    private icon: PIXI.Container
    private countdownLabel: PIXI.Text
    private colorOverlay: PIXI.Sprite
    private outerBorder: PIXI.Graphics
    private bottomContainer: PIXI.Graphics
    private cancelButton: PIXI.Sprite | undefined

    private viewport: Viewport
    private ability: GameAbility | BlueprintPlayerAbility
    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private animationFrame: number | undefined
    private onCountdownExpired: () => void | undefined

    constructor(
        viewport: Viewport,
        mapMousePosition: React.MutableRefObject<Position | undefined>,
        gridSizeRef: React.MutableRefObject<Dimension>,
        ability: GameAbility | BlueprintPlayerAbility,
        endTime: Date | undefined,
        onCountdownExpired: () => void | undefined,
        onCancel: (() => void) | undefined,
    ) {
        this.viewport = viewport
        this.ability = ability
        this.mapMousePosition = mapMousePosition
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
        this.countdownLabel = new PIXI.Text(secondsLeft, {
            fontFamily: fonts.nostromoBlack,
            fontSize: 13,
            fill: "#FFFFFF",
            stroke: "#00000050",
            strokeThickness: 0.2,
            lineHeight: 1,
        })
        this.countdownLabel.anchor.set(0.5, 0)
        this.countdownLabel.resolution = 4
        this.countdownLabel.zIndex = 5
        this.countdownLabel.position.set(gridSizeRef.current.width / 2, -18)

        // Border line
        this.outerBorder = new PIXI.Graphics()
        this.outerBorder.zIndex = 8

        // Label and cancel button at bottom
        this.bottomContainer = new PIXI.Graphics()
        const label = new PIXI.Text(getAbilityLabel(ability), {
            fontFamily: fonts.nostromoBlack,
            fontSize: 11,
            fill: ability.colour,
            lineHeight: 1,
        })
        label.resolution = 4
        label.pivot.set(0, label.height / 2)
        label.position.set(16, 13)
        this.bottomContainer.addChild(label)
        this.bottomContainer.zIndex = 7

        // Cancel button
        if (onCancel) {
            this.cancelButton = PIXI.Sprite.from(AbilityCancelPNG)
            this.cancelButton.scale.set(0.9)
            this.cancelButton.pivot.set(this.cancelButton.width, this.cancelButton.height / 2)
            this.cancelButton.buttonMode = true
            this.cancelButton.interactive = true
            this.cancelButton
                .on("pointerup", onCancel)
                .on("pointerover", () => this.cancelButton?.scale.set(0.95))
                .on("pointerout", () => this.cancelButton?.scale.set(0.9))
            this.bottomContainer.addChild(this.cancelButton)
        }

        // Add everything to container
        this.viewportRoot.addChild(this.icon)
        this.viewportRoot.addChild(this.countdownLabel)
        this.stageRoot.addChild(this.colorOverlay)
        this.stageRoot.addChild(this.outerBorder)
        this.stageRoot.addChild(this.bottomContainer)

        this.viewportRoot.pivot.set(this.viewportRoot.width / 2, this.countdownLabel.height / 2)
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
                this.viewportRoot.position.set(this.mapMousePosition.current.x, this.mapMousePosition.current.y)
            }

            // Color overlay
            this.colorOverlay.width = this.viewport.screenWidth
            this.colorOverlay.height = this.viewport.screenHeight

            // Position the bottom labe stuff
            this.bottomContainer.clear()
            this.bottomContainer.beginFill(HEXToVBColor("#000000"), 0.5)
            this.bottomContainer.drawRect(0, 0, this.viewport.screenWidth, 30)
            this.bottomContainer.endFill()
            this.bottomContainer.pivot.set(0, this.bottomContainer.height)
            this.bottomContainer.position.set(0, this.viewport.screenHeight)
            this.cancelButton?.position.set(this.viewport.screenWidth - 16, 13)

            // Line graphics
            this.outerBorder.clear()
            this.outerBorder.lineStyle(4, HEXToVBColor(this.ability.colour))
            this.outerBorder.drawRect(0, 0, this.viewport.screenWidth, this.viewport.screenHeight)

            // Repeat
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
