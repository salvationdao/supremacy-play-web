import { Box, IconButton, Stack, Typography, useMediaQuery } from "@mui/material"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { SvgHamburger, SvgSupremacyLogo } from "../../assets"
import { VERSION } from "../../constants"
import { useMobile, useOverlayToggles } from "../../containers"
import { colors, fonts } from "../../theme/theme"

export const Logo = React.memo(function Logo() {
    const below1370 = useMediaQuery("(max-width:1370px)")
    const { isMobile } = useMobile()
    const [text, setText] = useState<string>("PROVING GROUNDS")
    const { toggleIsLeftDrawerOpen } = useOverlayToggles()

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="1.3rem"
            sx={{ zIndex: 1, height: "100%", pl: "1.2rem", pr: "2.2rem", borderRight: "#FFFFFF30 1px solid" }}
        >
            {below1370 && (
                <IconButton size="small" onClick={() => toggleIsLeftDrawerOpen(true)}>
                    <SvgHamburger size="2.3rem" />
                </IconButton>
            )}

            <Link to="/">
                <SvgSupremacyLogo width="15rem" />
            </Link>

            {!isMobile && (
                <Box
                    onMouseEnter={() => {
                        setText(`${VERSION.substring(0, 10)}...`)
                    }}
                    onMouseLeave={() => {
                        setText("PROVING GROUNDS")
                    }}
                    sx={{ pb: "2px" }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            px: ".56rem",
                            pt: ".48rem",
                            pb: ".32rem",
                            border: `${colors.neonBlue} 1px solid`,
                            borderRadius: 1,
                            fontSize: ".8rem",
                            color: colors.neonBlue,
                            textAlign: "center",
                            lineHeight: 1,
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        {text}
                    </Typography>
                </Box>
            )}
        </Stack>
    )
})
