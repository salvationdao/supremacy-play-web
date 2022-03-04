import { Box, Divider, Link, Stack, Typography } from "@mui/material"
import { SvgNinjaSyndicateLogo, SvgSupremacyLogo } from "../../assets"
import { PASSPORT_WEB, SUPREMACY_PAGE } from "../../constants"
import { colors } from "../../theme/theme"

export const Logo = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={1.8} sx={{ px: 2, zIndex: 1 }}>
            <Link href={PASSPORT_WEB} target="_blank">
                <SvgNinjaSyndicateLogo size="26px" />
            </Link>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "#FFFFFF", borderRightWidth: 2 }} />
            <Link href={SUPREMACY_PAGE} target="_blank">
                <SvgSupremacyLogo width="150px" />
            </Link>
            <Box sx={{ pb: "2px" }}>
                <Typography
                    variant="caption"
                    sx={{
                        px: 0.7,
                        py: 0.4,
                        pb: 0.6,
                        border: `${colors.neonBlue} 1px solid`,
                        borderRadius: 1,
                        fontSize: ".6rem",
                        color: colors.neonBlue,
                        textAlign: "center",
                        lineHeight: 1,
                        fontFamily: "Nostromo Regular Bold",
                    }}
                >
                    EARLY ACCESS
                </Typography>
            </Box>
        </Stack>
    )
}
