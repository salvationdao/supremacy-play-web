import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useInterval } from "../hooks"
import { colors, fonts } from "../theme/theme"

export const LoginRedirect = () => {
    const [time, setTime] = useState(5000)
    // Receives token from the url param and passes it to the parent via postMessage
    useEffect(() => {
        // Close the window
        if (time <= 0) {
            window.close()
        }
    }, [time])

    useInterval(() => {
        setTime((prevState) => {
            if (prevState <= 0) return prevState
            return prevState - 1000
        })
    }, 1000)

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", p: "3.8rem", backgroundColor: colors.darkNavy }}>
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>
                You can now close this window and navigate back to the Battle Arena.
                <br />
                <br /> <span style={{ fontSize: "1.7rem" }}>Automatically closing this window in </span>
                <span style={{ fontSize: "3rem" }}> {parseInt(`${time / 1000}`)}</span>...
            </Typography>
        </Stack>
    )
}
