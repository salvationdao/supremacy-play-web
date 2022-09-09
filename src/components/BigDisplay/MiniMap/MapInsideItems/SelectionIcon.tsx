import { useMemo } from "react"
import { SvgDrag } from "../../../../assets"
import { useMiniMap } from "../../../../containers"
import { LocationSelectType } from "../../../../types"
import { MapIcon } from "./Common/MapIcon"

export const SelectionIcon = () => {
    const { selectionInstant, setSelection, isTargeting, playerAbility, winner } = useMiniMap()

    const ability = winner?.game_ability || playerAbility?.ability
    const coords = selectionInstant?.startCoords

    return useMemo(() => {
        if (!coords || !ability || !isTargeting) return null

        // Will return null if the ability doesnt involve selection icon.
        if (
            "location_select_type" in ability &&
            (ability.location_select_type === LocationSelectType.LineSelect ||
                ability.location_select_type === LocationSelectType.MechSelect ||
                ability.location_select_type === LocationSelectType.MechSelectAllied ||
                ability.location_select_type === LocationSelectType.MechSelectOpponent ||
                ability.location_select_type === LocationSelectType.Global)
        ) {
            return null
        }

        const isMechMoveCommand = "location_select_type" in ability && ability.location_select_type === LocationSelectType.MechCommand

        return (
            <MapIcon
                position={coords}
                sizeGrid={1.8}
                primaryColor={ability.colour}
                backgroundImageUrl={ability.image_url}
                insideRender={isMechMoveCommand ? <SvgDrag size="4.5rem" fill={ability.colour} /> : undefined}
                onClick={() => setSelection(undefined)}
            />
        )
    }, [ability, coords, isTargeting, setSelection])
}
