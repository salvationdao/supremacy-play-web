import { Box, Typography } from "@mui/material"
import { useAuth, useWebsocket } from "../../containers"
import { pulseEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

export const LoadMessage = () => {
    const { state } = useWebsocket()
    const { authSessionIDGetLoading, authSessionIDGetError } = useAuth()

    let message = ""
    if (state !== WebSocket.OPEN) {
        message = "CONNECTING TO THE GAME SERVER..."
    } else if (authSessionIDGetLoading) {
        message = "GETTING SESSION..."
    } else if (authSessionIDGetError) {
        message = "Failed to get session..."
    }

    return (
        <Box
            sx={{
                position: "absolute",
                top: 20,
                left: 26,
                zIndex: 99,
                animation: `${pulseEffect} 5s infinite`,
                filter: "drop-shadow(0 3px 3px #00000060)",
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontFamily: "Nostromo Regular Bold", fontWeight: "fontWeightBold", color: colors.text }}
            >
                {message}
            </Typography>
        </Box>
    )
}
