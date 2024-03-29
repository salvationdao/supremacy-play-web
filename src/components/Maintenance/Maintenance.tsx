import { Box, IconButton, Stack, Typography } from "@mui/material"
import { HangarBg, LogoWEBP, SvgDiscord, SvgTwitter, SvgYouTube } from "../../assets"
import { SUPREMACY_PAGE } from "../../constants"
import { colors, fonts, siteZIndex } from "../../theme/theme"

export const Maintenance = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#040B10",
                backgroundImage: `url(${HangarBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: siteZIndex.Modal,
            }}
        >
            <Stack
                spacing=".8rem"
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: siteZIndex.RoutePage,
                }}
            >
                <a target="_blank" href={SUPREMACY_PAGE} style={{ width: "100%", height: "12rem" }} rel="noreferrer">
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${LogoWEBP})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                </a>

                <Box sx={{ backgroundColor: "#00000099" }}>
                    <Stack alignItems="center" justifyContent="center" spacing=".6rem" sx={{ px: "4rem", py: "2.8rem", backgroundColor: "#00000099" }}>
                        <Typography
                            sx={{
                                fontSize: "3.26rem",
                                textAlign: "center",
                                fontFamily: fonts.nostromoHeavy,
                            }}
                        >
                            {"WE'LL BE BACK SOON"}
                        </Typography>

                        <Typography variant="h5" sx={{ color: colors.neonBlue, textAlign: "center" }}>
                            FOLLOW OUR SOCIALS FOR MORE UPDATES
                        </Typography>

                        <Stack direction="row" spacing="1.28rem" alignItems="center">
                            <IconButton size="small" target="_blank" href="https://discord.com/invite/supremacygame">
                                <SvgDiscord size="3.2rem" />
                            </IconButton>
                            <IconButton size="small" target="_blank" href="https://twitter.com/SupremacyMeta">
                                <SvgTwitter size="3.2rem" />
                            </IconButton>
                            <IconButton size="small" target="_blank" href="https://youtube.com/supremacygame">
                                <SvgYouTube size="3.2rem" />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}
