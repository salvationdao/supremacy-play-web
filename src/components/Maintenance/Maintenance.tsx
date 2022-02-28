import { Box, Stack, Typography } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import { MaintenanceJPG } from "../../assets"
import { MAINTENANCE_END_TIME } from "../../constants"
import { useInterval } from "../../hooks"
import { colors } from "../../theme/theme"

export const Maintenance = () => {
    const [endTime] = useState<Date>(new Date(MAINTENANCE_END_TIME))
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
        setHours(Math.max(moment(endTime).diff(moment(), "hours"), 0))
        setMinutes(Math.max(moment(endTime).diff(moment(), "minutes") % 24, 0))
        setSeconds(Math.max(moment(endTime).diff(moment(), "seconds") % 60, 0))
    }, delay)

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#00000090",
                backgroundImage: `url(${MaintenanceJPG})`,
                backgroundSize: "cover",
                backgroundPosition: "bottom right",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Stack
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    px: 4.2,
                    py: 4,
                    borderRadius: 1,
                    zIndex: 999,
                    backgroundColor: "#00000090",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        mb: 0.5,
                        color: colors.text,
                        fontFamily: "Nostromo Regular Bold",
                        textAlign: "center",
                    }}
                >
                    COMING BACK ONLINE SOON
                </Typography>
                {/* <Typography
                    variant="body1"
                    sx={{
                        color: colors.neonBlue,
                        fontFamily: "Nostromo Regular Medium",
                        textAlign: "center",
                    }}
                >
                    SUNDAY 7:30 AM PST
                    <br />
                    (SUNDAY 3:30 PM PERTH TIME)
                </Typography> */}

                {/* <Stack direction="row" justifyContent="space-around" sx={{ mt: 2 }}>
                    <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
                        <Typography sx={{ color: colors.neonBlue }}>{hours}</Typography>
                        <Typography>HOURS</Typography>
                    </Stack>
                    <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
                        <Typography sx={{ color: colors.neonBlue }}>{minutes}</Typography>
                        <Typography>MINUTES</Typography>
                    </Stack>
                    <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
                        <Typography sx={{ color: colors.neonBlue }}>{seconds}</Typography>
                        <Typography>SECONDS</Typography>
                    </Stack>
                </Stack> */}
            </Stack>
        </Box>
    )
}
