import { Box, Typography } from "@mui/material"
import { useAuth, useWebsocket } from "../../containers"
import { pulseEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

export const LoadMessage = () => {
    const { state } = useWebsocket()
    const { authSessionIDGetLoading, authSessionIDGetError } = useAuth()

    let message = ""
    if (state !== WebSocket.OPEN) {
        message = "GAME SERVER OFFLINE."
    } else if (authSessionIDGetLoading) {
        message = "GETTING SESSION..."
    }
    // } else if (authSessionIDGetError) {
    //     message = "Failed to get session..."
    // }

    if (!message) return null

    return (
        <Box
            sx={{
                position: "absolute",
                top: 15,
                left: 20,
                px: 1.6,
                py: 0.5,
                backgroundColor: "#000000",
                animation: `${pulseEffect} 5s infinite`,
                filter: "drop-shadow(0 3px 3px #00000060)",
                zIndex: 999,
                pointerEvents: "none",
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
