import { Viewport } from "pixi-viewport"
import { Dimension, DisplayedAbility } from "../../../../../types"
import { PixiMapAbilitySingle } from "./pixiMapAbilitySingle"

export class PixiMapAbilities {
    private viewport: Viewport
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
        viewport: Viewport,
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
        // We use viewport to add children instead of using a root because zIndexing
        this.viewport = viewport
        this.gridSizeRef = gridSizeRef
        this.gridCellToViewportPosition = gridCellToViewportPosition
        this.basicAbilities = basicAbilities
        this.complexAbilities = complexAbilities

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        for (const [id, pixiAbility] of Object.entries(this.pixiAbilities)) {
            pixiAbility.destroy()
            delete this.pixiAbilities[id]
        }
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

                // If pixi item already in there, and no need to replace, return
                if (pixiAbility && !shouldReplaceAbility(pixiAbility.ability, ab)) {
                    return
                }

                if (pixiAbility) {
                    pixiAbility.destroy()
                    delete this.pixiAbilities[ab.offering_id]
                }

                const newPixiAbility = new PixiMapAbilitySingle(ab, this.gridSizeRef, this.gridCellToViewportPosition)
                this.viewport.addChild(newPixiAbility.root)
                this.pixiAbilities[ab.offering_id] = newPixiAbility
            })

            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }
}

// This checks whether the new ability and old ability are different (only checks important fields)
const shouldReplaceAbility = (oldAbility: DisplayedAbility, newAbility: DisplayedAbility) => {
    return (
        oldAbility.mini_map_display_effect_type !== newAbility.mini_map_display_effect_type ||
        oldAbility.mech_display_effect_type !== newAbility.mech_display_effect_type ||
        oldAbility.location_select_type !== newAbility.location_select_type ||
        oldAbility.image_url !== newAbility.image_url ||
        oldAbility.location.x !== newAbility.location.x ||
        oldAbility.location.y !== newAbility.location.y ||
        oldAbility.radius !== newAbility.radius ||
        oldAbility.launching_at !== newAbility.launching_at ||
        oldAbility.show_below_mechs !== newAbility.show_below_mechs ||
        oldAbility.grid_size_multiplier !== newAbility.grid_size_multiplier
    )
}
