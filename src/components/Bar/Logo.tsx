import { Box, Divider, Link, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import { SvgNinjaSyndicateLogo, SvgSupremacyLogo } from "../../assets"
import { PASSPORT_WEB, SUPREMACY_PAGE, VERSION } from "../../constants"
import { colors, fonts } from "../../theme/theme"

export const Logo = React.memo(function Logo() {
    const [text, setText] = useState<string>("EARLY ACCESS")

    return (
        <Stack direction="row" alignItems="center" spacing="1.44rem" sx={{ px: "1.6rem", zIndex: 1 }}>
            <Link href={PASSPORT_WEB} target="_blank">
                <SvgNinjaSyndicateLogo size="2.6rem" />
            </Link>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "#FFFFFF", borderRightWidth: 2 }} />
            <Link href={SUPREMACY_PAGE} target="_blank">
                <SvgSupremacyLogo width="15rem" />
            </Link>
            <Box
                onMouseEnter={() => {
                    setText(`${VERSION.substring(0, 10)}...`)
                }}
                onMouseLeave={() => {
                    setText("EARLY ACCESS")
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
        </Stack>
    )
})
