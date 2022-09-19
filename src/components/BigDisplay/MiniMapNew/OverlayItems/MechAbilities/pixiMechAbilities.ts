import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { colors } from "../../../../../theme/theme"
import { PixiMechAbility } from "./pixiMechAbility"

const GAP = 7

export class PixiMechAbilities {
    root: PIXI.Container<PIXI.DisplayObject>
    private bgRect: PIXI.Graphics
    private abilities: PixiMechAbility[]

    constructor() {
        // Create container for everything
        this.root = new PIXI.Container()
        this.root.x = 9
        this.root.y = 8
        this.root.zIndex = 20
        this.root.sortableChildren = true

        this.abilities = []

        // Rect
        this.bgRect = new PIXI.Graphics()

        // Add everything to container
        this.root.addChild(this.bgRect)
    }

    destroy() {
        this.root.destroy(true)
    }

    addMechAbility(ability: PixiMechAbility, index: number) {
        this.abilities.push(ability)
        ability.root.x = GAP
        ability.root.y = (ability.getDefaultHeight() + GAP) * index + GAP
        this.root.addChild(ability.root)

        // Resize bg rectangle
        this.bgRect.clear()
        this.bgRect.lineStyle(1, HEXToVBColor(colors.gold), 0.5)
        this.bgRect.beginFill(HEXToVBColor("#000000"), 0.3)
        this.bgRect.drawRoundedRect(0, 0, this.root.width + 2 * GAP, this.root.height + 2 * GAP, 2.5)
        this.bgRect.endFill()
    }

    updateVisibility(isVisible: boolean) {
        this.root.visible = isVisible
    }
}
