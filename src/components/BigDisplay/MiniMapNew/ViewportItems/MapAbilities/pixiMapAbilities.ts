import * as PIXI from "pixi.js"
import { Dimension, DisplayedAbility } from "../../../../../types"
import { PixiMapAbilitySingle } from "./pixiMapAbilitySingle"

export class PixiMapAbilities {
    root: PIXI.Container<PIXI.DisplayObject>
    private pixiAbilities: { [id: string]: PixiMapAbilitySingle } = {}

    private gridSizeRef: React.MutableRefObject<Dimension>
    private gridCellToViewportPosition: React.MutableRefObject<
        (
            xCell: number,
            yCell: number,
        ) => {
            x: number
            y: number
        }
    >
    private basicAbilities: React.MutableRefObject<DisplayedAbility[]>
    private complexAbilities: React.MutableRefObject<DisplayedAbility[]>
    private animationFrame: number | undefined

    constructor(
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
        basicAbilities: React.MutableRefObject<DisplayedAbility[]>,
        complexAbilities: React.MutableRefObject<DisplayedAbility[]>,
    ) {
        this.gridSizeRef = gridSizeRef
        this.gridCellToViewportPosition = gridCellToViewportPosition
        this.basicAbilities = basicAbilities
        this.complexAbilities = complexAbilities

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.sortableChildren = true

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    render() {
        // Every re-render
        const step = () => {
            const abilities = [...this.basicAbilities.current, ...this.complexAbilities.current]

            // Destroy the pixi children that are no longer an ability on the map
            for (const [id, pixiAbility] of Object.entries(this.pixiAbilities)) {
                if (!abilities.find((ab) => ab.offering_id === id)) {
                    pixiAbility.destroy()
                    delete this.pixiAbilities[id]
                }
            }

            // Update the pixi ability with latest ability object, if not in map then create one
            abilities.forEach((ab) => {
                const pixiAbility = this.pixiAbilities[ab.offering_id]

                if (pixiAbility) {
                    // TODO:
                    console.log("a")
                } else {
                    const newPixiAbility = new PixiMapAbilitySingle(ab, this.gridSizeRef, this.gridCellToViewportPosition)
                    this.root.addChild(newPixiAbility.root)
                }
            })

            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }
}
