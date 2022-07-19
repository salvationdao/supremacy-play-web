import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { colors } from "../theme/theme"

/**
 * This componeny will be rendered as a page.
 * Back end opens this page with a url param "token" in an iframe.
 * This page will pass this token to the parent window (play-web) via postMessage.
 */
export const LoginRedirect = () => {
    // Receives token from the url param and passes it to the parent via postMessage
    useEffect(() => {
        // Close the window
        setTimeout(() => {
            window.close()
        }, 1200)
    }, [])

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", p: "3.8rem", backgroundColor: colors.darkNavy }}>
            <Typography sx={{ textAlign: "center", fontSize: "32px" }}>Loading...</Typography>
        </Stack>
    )
}
