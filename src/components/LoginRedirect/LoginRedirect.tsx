import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { colors, fonts } from "../../theme/theme"

export const LoginRedirect = () => {
    // Receives token from the url param and passes it to the parent via postMessage
    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        window.opener.postMessage({ issue_token: search.get("token") })
        // Close the window
        setTimeout(() => window.close(), 500)
    }, [])

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", p: "3.8rem", backgroundColor: colors.darkNavy }}>
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>
                Close this window and navigate back to the Battle Arena.
            </Typography>
        </Stack>
    )
}
