import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { colors, fonts } from "../theme/theme"

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
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>
                LOADING...
            </Typography>
        </Stack>
    )
}
