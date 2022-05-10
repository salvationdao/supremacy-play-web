import { Box } from "@mui/material"
import { Dispatch, SetStateAction, useMemo } from "react"
import { MapSelection } from "../.."
import { GameAbility, PlayerAbility } from "../../../types"

export const SelectionIcon = ({
    selection,
    setSelection,
    ability,
    gridWidth,
    gridHeight,
    targeting,
}: {
    selection: MapSelection | undefined
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    gridWidth: number
    gridHeight: number
    ability?: GameAbility | PlayerAbility
    targeting?: boolean
}) => {
    const sizeX = useMemo(() => gridWidth * 1.5, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.5, [gridHeight])

    const coords = selection?.startCoords
    if (!coords || !ability || !targeting) return null
    if (
        "location_select_type" in ability &&
        (ability.location_select_type === "LINE_SELECT" || ability.location_select_type === "MECH_SELECT" || ability.location_select_type === "GLOBAL")
    )
        return null
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
