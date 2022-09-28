import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"
import { PixiImageIcon } from "../../../../../helpers/pixiHelpers"
import { Dimension, MechMoveCommandAbility } from "../../../../../types"
import { FactionMechCommand } from "./MechMoveDests"

export class PixiMechMoveDest {
    root: PIXI.Container<PIXI.DisplayObject>
    private icon: PixiImageIcon

    constructor(
        moveCommand: FactionMechCommand,
        gridSizeRef: React.MutableRefObject<Dimension>,
        gridCellToViewportPosition: React.MutableRefObject<
            (
                xCell: number,
                yCell: number,
            ) => {
                x: number
                y: number
            }
        >,
    ) {
        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.mechMoveDests
        this.root.sortableChildren = true

        const moveAbility = MechMoveCommandAbility.ability
        this.icon = new PixiImageIcon(moveAbility.image_url, gridSizeRef.current.width / 2, gridSizeRef.current.height / 2, moveAbility.colour, true)

        const pos = gridCellToViewportPosition.current(moveCommand.cell_x, moveCommand.cell_y)
        this.root.position.set(pos.x, pos.y)

        // Add everything to container
        this.root.addChild(this.icon.root)
    }

    destroy() {
        this.root.destroy()
    }
}
