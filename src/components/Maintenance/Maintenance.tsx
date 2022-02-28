import { Box, IconButton, Link, Stack, Typography } from "@mui/material"
import { BottomMechWEBP, LogoWEBP, SvgDiscord, SvgTwitter, SvgYouTube, MaintenanceJPG } from "../../assets"
import { SUPREMACY_PAGE } from "../../constants"
import { colors } from "../../theme/theme"

export const Maintenance = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#040B10",
                backgroundImage: `url(${MaintenanceJPG})`,
                backgroundSize: "cover",
                backgroundPosition: "bottom center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Stack
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: 50,
                    right: 50,
                    transform: "translateY(-100%)",
                    zIndex: 3,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: 120,
                        backgroundImage: `url(${LogoWEBP})`,
                        backgroundSize: "contain",
                        backgroundPosition: "bottom center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

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
                    <Link target="_blank" href={SUPREMACY_PAGE}>
                        <Typography
                            sx={{
                                mb: 0.5,
                                color: "#FFFFFF",
                                textAlign: "center",
                                fontFamily: "Nostromo Regular Heavy",
                                fontSize: "1.9rem",
                            }}
                        >
                            {"WE'LL BE BACK SOON"}
                        </Typography>
                    </Link>

                    <Stack direction="row" spacing={1.6} alignItems="center">
                        <IconButton size="small" target="_blank" href="https://discord.com/invite/supremacygame">
                            <SvgDiscord size="32px" fill="#FFFFFF" />
                        </IconButton>
                        <IconButton size="small" target="_blank" href="https://twitter.com/SupremacyMeta">
                            <SvgTwitter size="32px" fill="#FFFFFF" />
                        </IconButton>
                        <IconButton size="small" target="_blank" href="https://youtube.com/supremacygame">
                            <SvgYouTube size="32px" fill="#FFFFFF" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )

    // return (
    //     <Box
    //         sx={{
    //             position: "fixed",
    //             top: 0,
    //             bottom: 0,
    //             left: 0,
    //             right: 0,
    //             backgroundColor: "#00000090",
    //             backgroundImage: `url(${MaintenanceJPG})`,
    //             backgroundSize: "cover",
    //             backgroundPosition: "bottom right",
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "center",
    //             justifyContent: "center",
    //         }}
    //     >
    //         <Stack
    //             sx={{
    //                 position: "absolute",
    //                 left: "50%",
    //                 top: "50%",
    //                 transform: "translate(-50%, -50%)",
    //                 px: 4.2,
    //                 py: 4,
    //                 borderRadius: 1,
    //                 zIndex: 999,
    //                 backgroundColor: "#00000090",
    //             }}
    //         >
    //             <Typography
    //                 variant="h5"
    //                 sx={{
    //                     mb: 0.5,
    //                     color: colors.text,
    //                     fontFamily: "Nostromo Regular Bold",
    //                     textAlign: "center",
    //                 }}
    //             >
    //                 COMING BACK ONLINE SOON
    //             </Typography>

    //         </Stack>
    //     </Box>
    // )
}

// My code for doing a countdown....
// const CountdownCode = () => {
//     const [endTime] = useState<Date>(new Date(MAINTENANCE_END_TIME))
//     const [, setTimeRemain] = useState<number>(0)
//     const [delay, setDelay] = useState<number | null>(null)
//     const [hours, setHours] = useState<number>()
//     const [minutes, setMinutes] = useState<number>()
//     const [seconds, setSeconds] = useState<number>()

//     useEffect(() => {
//         if (endTime) {
//             setDelay(1000)
//             const d = moment.duration(moment(endTime).diff(moment()))
//             setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
//             return
//         }
//         setDelay(null)
//     }, [])

//     useInterval(() => {
//         setTimeRemain((t) => Math.max(t - 1, 0))
//         setHours(Math.max(moment(endTime).diff(moment(), "hours"), 0))
//         setMinutes(Math.max(moment(endTime).diff(moment(), "minutes") % 24, 0))
//         setSeconds(Math.max(moment(endTime).diff(moment(), "seconds") % 60, 0))
//     }, delay)

//     return (
// <>
// <Typography
//                     variant="body1"
//                     sx={{
//                         color: colors.neonBlue,
//                         fontFamily: "Nostromo Regular Medium",
//                         textAlign: "center",
//                     }}
//                 >
//                     SUNDAY 7:30 AM PST
//                     <br />
//                     (SUNDAY 3:30 PM PERTH TIME)
//                 </Typography>

//                 <Stack direction="row" justifyContent="space-around" sx={{ mt: 2 }}>
//                     <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
//                         <Typography sx={{ color: colors.neonBlue }}>{hours}</Typography>
//                         <Typography>HOURS</Typography>
//                     </Stack>
//                     <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
//                         <Typography sx={{ color: colors.neonBlue }}>{minutes}</Typography>
//                         <Typography>MINUTES</Typography>
//                     </Stack>
//                     <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
//                         <Typography sx={{ color: colors.neonBlue }}>{seconds}</Typography>
//                         <Typography>SECONDS</Typography>
//                     </Stack>
//                 </Stack>
// </>
//     )
//                 }
