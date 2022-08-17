import { Box, IconButton, Stack, Typography, useMediaQuery } from "@mui/material"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { SvgHamburger, SvgSupremacyLogo } from "../../assets"
import { IS_TESTING_MODE, VERSION } from "../../constants"
import { useMobile, useOverlayToggles } from "../../containers"
import { colors, fonts } from "../../theme/theme"
import { HIDE_NAV_LINKS_WIDTH } from "./NavLinks/NavLinks"

export const Logo = React.memo(function Logo() {
    const hideNavLinks = useMediaQuery(`(max-width:${HIDE_NAV_LINKS_WIDTH}px)`)
    const { isMobile } = useMobile()
    const [text, setText] = useState<string>(IS_TESTING_MODE ? "PROVING GROUNDS" : "EARLY ACCESS")
    const { toggleIsNavLinksDrawerOpen } = useOverlayToggles()

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="1.3rem"
            sx={{ zIndex: 1, height: "100%", pl: "1.2rem", pr: "2.2rem", borderRight: "#FFFFFF30 1px solid" }}
        >
            {hideNavLinks && (
                <IconButton size="small" onClick={() => toggleIsNavLinksDrawerOpen(true)}>
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
                        setText(IS_TESTING_MODE ? "PROVING GROUNDS" : "EARLY ACCESS")
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
