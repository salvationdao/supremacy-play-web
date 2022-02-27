import { Box, Divider, Link, Stack, Typography } from "@mui/material"
import { SvgNinjaSyndicateLogo, SvgSupremacyLogo } from "../../assets"
import { colors } from "../../theme"

export const Logo = ({ supremacyPage }: { supremacyPage: string }) => {
    return (
        <Link href={supremacyPage} target="_blank">
            <Stack direction="row" alignItems="center" spacing={1.8} sx={{ px: 2, zIndex: 1 }}>
                <SvgNinjaSyndicateLogo size="26px" />
                <Divider orientation="vertical" flexItem sx={{ borderColor: colors.white, borderRightWidth: 2 }} />
                <SvgSupremacyLogo width="150px" />
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
                        }}
                    >
                        EARLY ACCESS
                    </Typography>
                </Box>
            </Stack>
        </Link>
    )
}
