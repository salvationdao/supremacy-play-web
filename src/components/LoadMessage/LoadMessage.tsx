import { Box, Typography } from "@mui/material"
import { useGameServerWebsocket } from "../../containers"
import { pulseEffect } from "../../theme/keyframes"

export const LoadMessage = () => {
    const { state, isServerUp } = useGameServerWebsocket()

    let message = ""
    if (state !== WebSocket.OPEN) {
        if (!isServerUp) {
            message = "GAME SERVER OFFLINE."
        } else {
            message = "CONNECTING TO SERVER..."
        }
    }

    if (!message) return null

    return (
        <Box
            sx={{
                position: "absolute",
                top: "1.5rem",
                left: "2rem",
                px: "1.28rem",
                py: ".4rem",
                backgroundColor: "#000000",
                animation: `${pulseEffect} 5s infinite`,
                filter: "drop-shadow(0 3px 3px #00000060)",
                zIndex: 999,
                pointerEvents: "none",
            }}
        >
            <Typography variant="h6" sx={{ fontFamily: "Nostromo Regular Bold", fontWeight: "fontWeightBold" }}>
                {message}
            </Typography>
        </Box>
    )
}
