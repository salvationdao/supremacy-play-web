import { Box } from "@mui/material"
import { Dispatch, SetStateAction, useMemo } from "react"
import { MapSelection } from "../.."
import { GameAbility, PlayerAbility } from "../../../types"

export const SelectionIcon = ({
    selection,
    gameAbility,
    gridWidth,
    gridHeight,
    setSelection,
    targeting,
}: {
    selection: MapSelection | undefined
    gridWidth: number
    gridHeight: number
    gameAbility?: GameAbility | PlayerAbility
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    targeting?: boolean
}) => {
    const sizeX = useMemo(() => gridWidth * 1.5, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.5, [gridHeight])

    if (!selection?.startCoords || !gameAbility || !targeting) return null
    if ("location_select_type" in gameAbility && (gameAbility.location_select_type === "MECH_SELECT" || gameAbility.location_select_type === "GLOBAL"))
        return null
    const { colour, image_url } = gameAbility

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
                transform: `translate(${selection.startCoords.x * gridWidth - sizeX / 2}px, ${selection.startCoords.y * gridHeight - sizeY / 2}px)`,
                zIndex: 100,
            }}
        />
    )
}
