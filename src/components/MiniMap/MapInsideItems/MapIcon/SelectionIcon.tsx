import { useMemo } from "react"
import { SvgDrag } from "../../../../assets"
import { useMiniMap } from "../../../../containers"
import { LocationSelectType } from "../../../../types"
import { MapIcon } from "./MapIcon"

export const SelectionIcon = () => {
    const { selection, setSelection, isTargeting, playerAbility, winner } = useMiniMap()

    const ability = winner?.game_ability || playerAbility?.ability
    const coords = selection?.startCoords

    return useMemo(() => {
        if (!coords || !ability || !isTargeting) return null

        // Will return null if the ability doesnt involve selection icon.
        if (
            "location_select_type" in ability &&
            (ability.location_select_type === LocationSelectType.LINE_SELECT ||
                ability.location_select_type === LocationSelectType.MECH_SELECT ||
                ability.location_select_type === LocationSelectType.GLOBAL)
        ) {
            return null
        }

        const isMechMoveCommand = "location_select_type" in ability && ability.location_select_type === LocationSelectType.MECH_COMMAND

        return (
            <MapIcon
                primaryColor={ability.colour}
                imageUrl={ability.image_url}
                onClick={() => setSelection(undefined)}
                position={coords}
                icon={isMechMoveCommand ? <SvgDrag size="4.5rem" /> : undefined}
            />
        )
    }, [ability, coords, isTargeting, setSelection])
}
