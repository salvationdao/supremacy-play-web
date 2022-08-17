import { Box } from "@mui/material"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Stream />
        </Box>
    )
}
