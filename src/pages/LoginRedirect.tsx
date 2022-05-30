import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { colors } from "../theme/theme"

/**
 * This componeny will be rendered as a page.
 * Back end opens this page with a url param "token" in an iframe.
 * This page will pass this token to the parent window (play-web) via postMessage.
 */
export const LoginRedirect = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get("token")
    const [message, setMessage] = useState("Logging you in...")

    const failed = useCallback(() => {
        setMessage("Failed to authenticate, please close this window and try again.")
        return
    }, [])

    // Receives token from the url param and passes it to the parent via postMessage
    useEffect(() => {
        if (!token) failed()

        try {
            // Send the auth token to the parent
            window.opener.postMessage({ token })
        } catch {
            failed()
        }

        // Close the window
        setTimeout(() => {
            window.close()
        }, 1200)
    }, [failed, token])

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", p: "3.8rem", backgroundColor: colors.darkNavy }}>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
                {message}
            </Typography>
        </Stack>
    )
}
