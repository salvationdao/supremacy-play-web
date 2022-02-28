import { Box, IconButton, Link, Stack, Typography } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import { LogoWEBP, SvgDiscord, SvgTwitter, SvgYouTube, MaintenanceJPG } from "../../assets"
import { SUPREMACY_PAGE } from "../../constants"
import { useInterval } from "../../hooks"
import { colors } from "../../theme/theme"

export const Maintenance = () => {
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#040B10",
                backgroundImage: `url(${MaintenanceJPG})`,
                backgroundSize: "cover",
                backgroundPosition: "bottom left",
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
                    transform: "translateY(-90%)",
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
                                color: "#FFFFFF",
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
                            03/01/2022 10PM PST
                        </Typography>

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
                </Box>

                {/* Perth time */}
                <CountdownTimer endTime={new Date("Wed Mar 02 2022 14:00:00 GMT+0800")} />
            </Stack>
        </Box>
    )
}

const CountdownTimer = ({ endTime }: { endTime: Date }) => {
    const [, setTimeRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, 0))
        const d = moment.duration(moment(endTime).diff(moment()))
        const hours = Math.floor(d.asHours())
        const minutes = Math.floor(d.asMinutes()) - hours * 60
        const seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - minutes * 60
        setHours(Math.max(hours, 0))
        setMinutes(Math.max(minutes, 0))
        setSeconds(Math.max(seconds, 0))
    }, delay)

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
