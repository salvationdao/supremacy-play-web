import { Box, Typography } from "@mui/material"
import { useAuth, useWebsocket } from "../../containers"
import { colors } from "../../theme/theme"

export const LoadMessage = () => {
    const { state } = useWebsocket()
    const { authSessionIDGetLoading, authSessionIDGetError } = useAuth()

    let message = ""
    if (state !== WebSocket.OPEN) {
        message = "Connecting to server..."
    } else if (authSessionIDGetLoading) {
        message = "Getting session..."
    } else if (authSessionIDGetError) {
        message = "Failed to get session..."
    }

    return (
        <Box sx={{ position: "absolute", top: 10, left: 16 }}>
            <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", color: colors.text }}>
                {message}
            </Typography>
        </Box>
    )
}
