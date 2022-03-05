import { Box, IconButton, Link, Stack, Typography } from "@mui/material"
import { LogoWEBP, SvgDiscord, SvgTwitter, SvgYouTube, MaintenancePNG } from "../../assets"
import { SUPREMACY_PAGE } from "../../constants"
import { useTimer } from "../../hooks"
import { colors } from "../../theme/theme"

export const Maintenance = () => {
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#040B10",
                backgroundImage: `url(${MaintenancePNG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Stack
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: 50,
                    right: 50,
                    transform: "translateY(-60%)",
                    zIndex: 3,
                }}
            >
                <Link target="_blank" href={SUPREMACY_PAGE} sx={{ width: "100%", height: 120 }}>
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
                </Link>

                <Box sx={{ backgroundColor: "#00000099" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            px: 5,
                            py: 3,
                            borderRadius: 1,
                            backgroundColor: "#00000099",
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: "center",
                                fontFamily: "Nostromo Regular Heavy",
                                fontSize: "1.9rem",
                            }}
                        >
                            {"WE'LL BE BACK SOON"}
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                mb: 0.5,
                                color: colors.neonBlue,
                                textAlign: "center",
                            }}
                        >
                            FOLLOW OUR SOCIALS FOR MORE UPDATES
                        </Typography>

                        <Stack direction="row" spacing={1.6} alignItems="center">
                            <IconButton size="small" target="_blank" href="https://discord.com/invite/supremacygame">
                                <SvgDiscord size="32px" />
                            </IconButton>
                            <IconButton size="small" target="_blank" href="https://twitter.com/SupremacyMeta">
                                <SvgTwitter size="32px" />
                            </IconButton>
                            <IconButton size="small" target="_blank" href="https://youtube.com/supremacygame">
                                <SvgYouTube size="32px" />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>

                {/* Perth time */}
                {/* <CountdownTimer endTime={new Date("Wed Mar 02 2022 14:00:00 GMT+0800")} /> */}
            </Stack>
        </Box>
    )
}

const CountdownTimer = ({ endTime }: { endTime: Date }) => {
    const { hours, minutes, seconds } = useTimer(endTime)

    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            sx={{ mt: 2, backgroundColor: "#00000099", borderRadius: 1 }}
        >
            <Stack alignItems="center" sx={{ px: 2, py: 1.5, width: 110, backgroundColor: "#00000099" }}>
                <Typography variant="h5" sx={{ color: colors.neonBlue }}>
                    {hours}
                </Typography>
                <Typography variant="h6">HOURS</Typography>
            </Stack>
            <Stack alignItems="center" sx={{ px: 2, py: 1.5, width: 110, backgroundColor: "#00000099" }}>
                <Typography variant="h5" sx={{ color: colors.neonBlue }}>
                    {minutes}
                </Typography>
                <Typography variant="h6">MINUTES</Typography>
            </Stack>
            <Stack alignItems="center" sx={{ px: 2, py: 1.5, width: 110, backgroundColor: "#00000099" }}>
                <Typography variant="h5" sx={{ color: colors.neonBlue }}>
                    {seconds}
                </Typography>
                <Typography variant="h6">SECONDS</Typography>
            </Stack>
        </Stack>
    )
}
