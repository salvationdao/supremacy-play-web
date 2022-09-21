import { ease } from "pixi-ease"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { AbilityCancelPNG } from "../../../../../assets"
import { MapSelection } from "../../../../../containers"
import { HEXToVBColor } from "../../../../../helpers"
import { PixiImageIcon } from "../../../../../helpers/pixiHelpers"
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

export class PixiTargetSelect {
    stageRoot: PIXI.Container<PIXI.DisplayObject>
    viewportRoot: PIXI.Container<PIXI.DisplayObject>
    private colorOverlay: PIXI.Sprite
    private outerBorder: PIXI.Graphics
    private bottomContainer: PIXI.Graphics
    private cancelButton: PIXI.Sprite | undefined
    private mouseIcon: PixiImageIcon

    private viewport: Viewport
    private ability: GameAbility | BlueprintPlayerAbility
    private mapMousePosition: React.MutableRefObject<Position | undefined>
    private animationFrame: number | undefined

    // Actual selecting
    private startCoord: PixiImageIcon
    private endCoord: PixiImageIcon

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
        this.mapMousePosition = mapMousePosition
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
        this.mouseIcon = new PixiImageIcon(
            ability.image_url,
            gridSizeRef.current.width / 1.6,
            gridSizeRef.current.height / 1.6,
            ability.colour,
            true,
            onExpired,
            secondsLeft,
        )

        // Start and end coord icons, made invisible
        this.startCoord = new PixiImageIcon(
            ability.image_url,
            gridSizeRef.current.width,
            gridSizeRef.current.height,
            ability.colour,
            true,
            onExpired,
            secondsLeft,
        )
        this.endCoord = new PixiImageIcon(
            ability.image_url,
            gridSizeRef.current.width,
            gridSizeRef.current.height,
            ability.colour,
            true,
            onExpired,
            secondsLeft,
        )
        this.startCoord.showIcon(false)
        this.endCoord.showIcon(false)

        // Add everything to container
        this.viewportRoot.addChild(this.mouseIcon.root)
        this.viewportRoot.addChild(this.startCoord.root)
        this.viewportRoot.addChild(this.endCoord.root)
        this.stageRoot.addChild(this.colorOverlay)
        this.stageRoot.addChild(this.outerBorder)
        this.stageRoot.addChild(this.bottomContainer)

        ease.add(this.mouseIcon.root, { scale: 1.2 }, { duration: 500, ease: "linear", repeat: true, reverse: true, removeExisting: true })

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

            // Repeat
            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    setStartCoord(pos: Position | undefined, onClick?: () => void) {
        this.startCoord.showIcon(!!pos)
        if (pos) this.startCoord.root.position.set(pos.x, pos.y)
    }

    setEndCoord(pos: Position | undefined, onClick?: () => void) {
        this.endCoord.showIcon(!!pos)
        if (pos) this.endCoord.root.position.set(pos.x, pos.y)
    }
}
