import { Box } from "@mui/material"
import { useMemo } from "react"
import { useMiniMap } from "../../../containers"
import { LocationSelectType } from "../../../types"

export const SelectionIcon = () => {
    const { gridWidth, gridHeight, selection, setSelection, isTargeting, playerAbility, winner } = useMiniMap()

    const sizeX = useMemo(() => gridWidth * 1.5, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.5, [gridHeight])

    const ability = winner?.game_ability || playerAbility?.ability
    const coords = selection?.startCoords

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

    const { colour, image_url } = ability

    return (
        <Box
            onClick={() => setSelection(undefined)}
            sx={{
                position: "absolute",
                height: `${sizeX}px`,
                width: `${sizeY}px`,
                cursor: "pointer",
                border: `2px solid ${colour}`,
                borderRadius: 1,
                backgroundImage: `url(${image_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                transform: `translate(${coords.x * gridWidth - sizeX / 2}px, ${coords.y * gridHeight - sizeY / 2}px)`,
                zIndex: 100,
            }}
        />
    )
}
