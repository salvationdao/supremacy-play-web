import { Box } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { MapSelection } from ".."
import { GAME_SERVER_HOSTNAME } from "../../constants"
import { httpProtocol } from "../../containers"
import { GameAbility } from "../../types"

export const SelectionIcon = ({
    selection,
    gameAbility,
    setSelection,
}: {
    selection: MapSelection | undefined
    gameAbility: GameAbility
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
}) => {
    if (!selection || !gameAbility) return null

    const { colour, image_url } = gameAbility

    return (
        <Box
            sx={{
                position: "absolute",
                height: "54px",
                width: "54px",
                mt: "1px",
                zIndex: 6,
                border: `2px solid ${colour}`,
                borderRadius: 1,
                transform: `translate3d(${selection.x * 50}px, ${selection.y * 50}px, 0)`,
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
