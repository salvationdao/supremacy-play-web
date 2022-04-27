import { Box, Fade, Stack, Typography, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { SvgQuestionMark } from "../../assets"
import { colors } from "../../theme/theme"
import GameGuide from "../GameGuide/GameGuide"
import Tutorial from "../Tutorial/Tutorial"

export const HowToPlay = () => {
    const below1440 = useMediaQuery("(max-width:1440px)")
    const [open, setOpen] = useState(false)

    return (
        <>
            <Box
                component="div"
                tabIndex={0}
                id="tutorial-welcome"
                sx={{ position: "relative" }}
                onFocus={() => {
                    setOpen(true)
                }}
                onBlur={() => {
                    setOpen(false)
                }}
                onMouseEnter={() => {
                    setOpen(true)
                }}
                onMouseLeave={() => {
                    setOpen(false)
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "1.2rem",
                        color: colors.neonBlue,
                        minWidth: 0,
                    }}
                >
                    <SvgQuestionMark size="1.5rem" fill={colors.neonBlue} />
                    {below1440 ? null : (
                        <Typography sx={{ ml: ".6rem", lineHeight: 1, color: colors.neonBlue, textTransform: "uppercase" }}>How To Play</Typography>
                    )}
                </Box>
                <Fade in={open}>
                    <Stack spacing={"1rem"} sx={{ position: "absolute", backgroundColor: colors.darkNavy, top: "100%", left: "0", padding: "1rem" }}>
                        <GameGuide />
                        <Tutorial />
                    </Stack>
                </Fade>
            </Box>
        </>
    )
}
