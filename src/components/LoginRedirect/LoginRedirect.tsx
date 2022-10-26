import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { colors, fonts } from "../../theme/theme"

export const LoginRedirect = () => {
    // Receives token from the url param and passes it to the parent via postMessage
    useEffect(() => {
        // Close the window
        window.close()
    }, [])

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", p: "3.8rem", backgroundColor: colors.darkNavy }}>
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>
                Close this window and navigate back to the Battle Arena.
            </Typography>
        </Stack>
    )
}
