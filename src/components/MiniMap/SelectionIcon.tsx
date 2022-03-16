import { Box } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { MapSelection } from ".."
import { Crosshair } from "../../assets"
import { GAME_SERVER_HOSTNAME } from "../../constants"
import { httpProtocol } from "../../containers"
import { GameAbility } from "../../types"

export const SelectionIcon = ({
    selection,
    gameAbility,
    gridWidth,
    gridHeight,
    setSelection,
    targeting,
    mapElement,
    location,
}: {
    selection: MapSelection | undefined
    gridWidth: number
    gridHeight: number
    gameAbility?: GameAbility
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    targeting?: boolean
    mapElement: React.MutableRefObject<any>
    location: { x: number; y: number }
}) => {
    if (!selection || !gameAbility || !targeting) return null

    const { colour, image_url } = gameAbility

    return (
        <Box
            sx={{
                position: "absolute",
                height: `${gridWidth}px`,
                width: `${gridHeight}px`,
                mt: "1px",
                zIndex: 6,
                border: `2px solid ${colour}`,
                borderRadius: 1,
                transform: `translate3d(${selection.x * gridWidth}px, ${selection.y * gridHeight}px, 0)`,
                cursor: `url(${Crosshair}) 10 10, auto`,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                }}
            >
                <Box
                    onClick={() => setSelection(undefined)}
                    sx={{
                        height: "100%",
                        width: "100%",
                        backgroundImage: `url(${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />
            </Box>
        </Box>
    )
}
