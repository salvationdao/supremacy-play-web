import { Box } from "@mui/material"
import { useGame } from "../../containers"
import { MiniMap } from "./MiniMap/MiniMap"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    const { isStreamBigDisplay } = useGame()

    return <Box sx={{ position: "relative", width: "100%", height: "100%" }}>{isStreamBigDisplay ? <Stream /> : <MiniMap />}</Box>
}
