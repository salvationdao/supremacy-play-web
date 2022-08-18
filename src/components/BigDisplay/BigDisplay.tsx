import { Box } from "@mui/material"
import { MiniMap } from "./MiniMap/MiniMap"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    return (
        <Box id="big-display-space" sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Stream />
            <MiniMap />
        </Box>
    )
}
