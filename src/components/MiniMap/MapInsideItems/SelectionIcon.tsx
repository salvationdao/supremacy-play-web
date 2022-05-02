import { Box } from "@mui/material"
import { Dispatch, SetStateAction, useMemo } from "react"
import { MapSelection } from "../.."
import { GameAbility } from "../../../types"

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
    gameAbility?: GameAbility
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    targeting?: boolean
}) => {
    const sizeX = useMemo(() => gridWidth * 1.5, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.5, [gridHeight])

    if (!selection || !gameAbility || !targeting) return null
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
                transform: `translate(${selection.x * gridWidth - sizeX / 2}px, ${selection.y * gridHeight - sizeY / 2}px)`,
                zIndex: 100,
            }}
        />
    )
}
