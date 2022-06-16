import { Box, IconButton, Stack, Typography } from "@mui/material"
import { LogoWEBP, MaintenancePNG, SvgDiscord, SvgTwitter, SvgYouTube } from "../../assets"
import { SUPREMACY_PAGE } from "../../constants"
import { colors, fonts, siteZIndex } from "../../theme/theme"

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
                spacing=".8rem"
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "5rem",
                    right: "5rem",
                    transform: "translateY(-60%)",
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
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            px: "4rem",
                            py: "2.4rem",
                            borderRadius: 1,
                            backgroundColor: "#00000099",
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: "center",
                                fontFamily: fonts.nostromoHeavy,
                                fontSize: "3.26rem",
                            }}
                        >
                            {"WE'LL BE BACK SOON"}
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                mb: ".4rem",
                                color: colors.neonBlue,
                                textAlign: "center",
                            }}
                        >
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

                {/* Perth time */}
                {/* <CountdownTimer endTime={new Date("Wed Mar 02 2022 14:00:00 GMT+0800")} /> */}
            </Stack>
        </Box>
    )
}

// const CountdownTimer = ({ endTime }: { endTime: Date }) => {
//     const { hours, minutes, seconds } = useTimer(endTime)

//     return (
//         <Stack
//             direction="row"
//             justifyContent="space-around"
//             sx={{ mt: "1.6rem", backgroundColor: "#00000099", borderRadius: 1 }}
//         >
//             <Stack
//                 alignItems="center"
//                 sx={{ px: "1.6rem", py: "1.2rem", width: "11rem", backgroundColor: "#00000099" }}
//             >
//                 <Typography variant="h5" sx={{ color: colors.neonBlue }}>
//                     {hours}
//                 </Typography>
//                 <Typography variant="h6">HOURS</Typography>
//             </Stack>
//             <Stack
//                 alignItems="center"
//                 sx={{ px: "1.6rem", py: "1.2rem", width: "11rem", backgroundColor: "#00000099" }}
//             >
//                 <Typography variant="h5" sx={{ color: colors.neonBlue }}>
//                     {minutes}
//                 </Typography>
//                 <Typography variant="h6">MINUTES</Typography>
//             </Stack>
//             <Stack
//                 alignItems="center"
//                 sx={{ px: "1.6rem", py: "1.2rem", width: "11rem", backgroundColor: "#00000099" }}
//             >
//                 <Typography variant="h5" sx={{ color: colors.neonBlue }}>
//                     {seconds}
//                 </Typography>
//                 <Typography variant="h6">SECONDS</Typography>
//             </Stack>
//         </Stack>
//     )
// }
