import { ease } from "pixi-ease"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { AbilityCancelPNG } from "../../../../../assets"
import { pixiStageZIndexes, pixiViewportZIndexes } from "../../../../../containers"
import { HEXToVBColor } from "../../../../../helpers"
import { PixiImageIcon } from "../../../../../helpers/pixiHelpers"
import { fonts } from "../../../../../theme/theme"
import { AbilityDetail, BlueprintPlayerAbility, Dimension, GameAbility, GAME_CLIENT_TILE_SIZE, LocationSelectType, Position } from "../../../../../types"

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

export class PixiMapTargetSelect {
    stageRoot: PIXI.Container<PIXI.DisplayObject>
    viewportRoot: PIXI.Container<PIXI.DisplayObject>
    mouseIcon: PixiImageIcon
    private colorOverlay: PIXI.Sprite
    private outerBorder: PIXI.Graphics
    private bottomContainer: PIXI.Graphics
    private cancelButton: PIXI.Sprite | undefined

    private viewport: Viewport
    private ability: GameAbility | BlueprintPlayerAbility
    private gridSizeRef: React.MutableRefObject<Dimension>
    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private animationFrame: number | undefined

    // Actual selecting
    private startCoord: PixiImageIcon
    private endCoord: PixiImageIcon
    private startEndLine: PIXI.Graphics

    onTargetConfirm:
        | undefined
        | (({ startCoord, endCoord, mechHash }: { startCoord?: Position | undefined; endCoord?: Position | undefined; mechHash?: string | undefined }) => void)

    constructor(
        viewport: Viewport,
        mapMousePosition: React.MutableRefObject<Position | undefined>,
        gridSizeRef: React.MutableRefObject<Dimension>,
        ability: GameAbility | BlueprintPlayerAbility,
        endTime: Date | undefined,
        onExpired: () => void | undefined,
        onCancel: (() => void) | undefined,
    ) {
        this.viewport = viewport
        this.ability = ability
        this.gridSizeRef = gridSizeRef
        this.mapMousePosition = mapMousePosition
        const secondsLeft = endTime ? Math.max(Math.round((endTime.getTime() - new Date().getTime()) / 1000), 0) : undefined

        // Create container for everything
        this.stageRoot = new PIXI.Container()
        this.stageRoot.zIndex = pixiStageZIndexes.targetSelect = 50
        this.stageRoot.sortableChildren = true

        this.viewportRoot = new PIXI.Container()
        this.viewportRoot.zIndex = pixiViewportZIndexes.targetSelect = 60
        this.viewportRoot.sortableChildren = true

        // Big color overlay
        this.colorOverlay = PIXI.Sprite.from(PIXI.Texture.WHITE)
        this.colorOverlay.alpha = 0.05
        this.colorOverlay.tint = HEXToVBColor(this.ability.colour)
        this.colorOverlay.zIndex = 6

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

        // Mouse icon
        this.mouseIcon = new PixiImageIcon(ability.image_url, gridSizeRef.current.width / 1.6, gridSizeRef.current.height / 1.6, ability.colour, true)
        if (secondsLeft) {
            this.mouseIcon.startCountdown(secondsLeft, 1, onExpired)
        }

        // Start and end coord icons, made invisible
        this.startCoord = new PixiImageIcon(ability.image_url, gridSizeRef.current.width, gridSizeRef.current.height, ability.colour, true)
        this.endCoord = new PixiImageIcon(ability.image_url, gridSizeRef.current.width, gridSizeRef.current.height, ability.colour, true)
        this.startEndLine = new PIXI.Graphics()
        this.startCoord.showIcon(false)
        this.endCoord.showIcon(false)
        this.startCoord.root.interactive = true
        this.startCoord.root.buttonMode = true
        this.endCoord.root.interactive = true
        this.endCoord.root.buttonMode = true

        // Add everything to container
        this.viewportRoot.addChild(this.mouseIcon.root)
        this.viewportRoot.addChild(this.startCoord.root)
        this.viewportRoot.addChild(this.endCoord.root)
        this.viewportRoot.addChild(this.startEndLine)
        this.stageRoot.addChild(this.colorOverlay)
        this.stageRoot.addChild(this.outerBorder)
        this.stageRoot.addChild(this.bottomContainer)

        ease.add(this.mouseIcon.root, { scale: 1.05 }, { duration: 500, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.mouseIcon.resetCountdown()
        this.viewportRoot.destroy()
        this.stageRoot.destroy()
    }

    render() {
        const step = () => {
            if (this.mapMousePosition.current) {
                this.mouseIcon.root.position.set(this.mapMousePosition.current.x, this.mapMousePosition.current.y)
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

            // Draw a line to connect start and end coord if both coord are populated
            this.startEndLine.clear()
            if (this.startCoord.root.visible && this.endCoord.root.visible) {
                this.startEndLine.lineStyle(this.gridSizeRef.current.width / 4, HEXToVBColor(this.ability.colour))
                this.startEndLine.moveTo(this.startCoord.root.position.x, this.startCoord.root.y)
                this.startEndLine.lineTo(this.endCoord.root.position.x, this.endCoord.root.y)
            }

            // Repeat
            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    setStartCoord(pos: Position | undefined, onClick?: () => void) {
        this.startCoord.showIcon(!!pos)
        if (pos) {
            this.startCoord.root.position.set(pos.x, pos.y)
            if (onClick) this.startCoord.root.once("pointerup", onClick)
        } else {
            this.mouseIcon.showIcon(true)
        }
    }

    setEndCoord(pos: Position | undefined, onClick?: () => void) {
        this.endCoord.showIcon(!!pos)
        if (pos) {
            this.endCoord.root.position.set(pos.x, pos.y)
            if (onClick) this.endCoord.root.once("pointerup", onClick)
        } else {
            this.mouseIcon.showIcon(true)
        }
    }

    startCountdown(timeLeft = 3, speed = 3, destroyOnConfirm = true) {
        this.resetCountdown()
        this.endCoord.startCountdown(timeLeft, speed)
        this.startCoord.startCountdown(timeLeft, speed, () => {
            this.onTargetConfirm && this.onTargetConfirm({ startCoord: this.startCoord.root.position, endCoord: this.endCoord.root.position })
            if (destroyOnConfirm) this.destroy()
        })
    }

    resetCountdown() {
        this.endCoord.resetCountdown()
        this.startCoord.resetCountdown()
    }

    updateAbilityDetail(abilityDetail: AbilityDetail | undefined) {
        const radius = abilityDetail ? (this.gridSizeRef.current.width * abilityDetail.radius) / GAME_CLIENT_TILE_SIZE : undefined
        this.mouseIcon.showRangeRadius(radius)
        this.startCoord.showRangeRadius(radius)
        this.endCoord.showRangeRadius(radius)
    }
}
