import { Box, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { SvgSupremacyLogo } from "../../assets"
import { STAGING_ONLY, VERSION } from "../../constants"
import { useMobile } from "../../containers"
import { colors, fonts } from "../../theme/theme"

export const Logo = React.memo(function Logo() {
    const { isMobile } = useMobile()
    const [text, setText] = useState<string>(STAGING_ONLY ? "PROVING GROUNDS" : "EARLY ACCESS")

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="1.3rem"
            sx={{ zIndex: 1, height: "100%", pl: "1.2rem", pr: "2.2rem", borderRight: "#FFFFFF30 1px solid" }}
        >
            <Link to="/">
                <SvgSupremacyLogo width="15rem" />
            </Link>

            {!isMobile && (
                <Box
                    onMouseEnter={() => {
                        setText(`${VERSION.substring(0, 10)}...`)
                    }}
                    onMouseLeave={() => {
                        setText(STAGING_ONLY ? "PROVING GROUNDS" : "EARLY ACCESS")
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
