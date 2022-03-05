import { Box, Typography } from "@mui/material"
import { useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { pulseEffect } from "../../theme/keyframes"

export const LoadMessage = () => {
    const { state, isServerUp } = useGameServerWebsocket()
    const { authSessionIDGetLoading } = useGameServerAuth()

    let message = ""
    if (state !== WebSocket.OPEN) {
        if (!isServerUp) {
            message = "GAME SERVER OFFLINE."
        } else {
            message = "CONNECTING TO SERVER..."
        }
    } else if (authSessionIDGetLoading) {
        message = "GETTING SESSION..."
    }

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
                sx={{ fontFamily: "Nostromo Regular Bold", fontWeight: "fontWeightBold", color: "#FFFFFF" }}
            >
                {message}
            </Typography>
        </Box>
    )
}
