import { Box, Stack, Typography } from "@mui/material"
import { BATTLE_ARENA_OPEN_DATE } from "../../constants"
import { useTimer } from "../../hooks"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"

export const BattleArenaCountDown = () => {
    return (
        <Stack
            spacing="12rem"
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", height: "100%", p: "4rem", zIndex: siteZIndex.RoutePage, fontFamily: fonts.nostromoBlack }}
        >
            <Box sx={{ position: "relative" }}>
                <Typography variant="h1" sx={{ fontFamily: fonts.nostromoHeavy }}>
                    BATTLE ARENA
                </Typography>

                <Typography variant="h2" sx={{ position: "absolute", left: 0, bottom: "100%" }}>
                    THE
                </Typography>

                <Typography variant="h2" sx={{ position: "absolute", right: 0, top: "100%" }}>
                    IS REOPENING
                </Typography>
            </Box>

            <Countdown />
        </Stack>
    )
}

const Countdown = () => {
    const { days, hours, minutes, seconds, totalSecRemain } = useTimer(BATTLE_ARENA_OPEN_DATE)

    if (!BATTLE_ARENA_OPEN_DATE || seconds === undefined || totalSecRemain <= 0) {
        return null
    }

    return (
        <Stack alignItems="center" spacing="3rem">
            <Stack direction="row">
                <SingleCountDown value={`${days}`} label="Days" />

                <Typography variant={"h3"} sx={{ mx: "1rem", mt: "2rem" }}>
                    :{" "}
                </Typography>

                <SingleCountDown value={`${hours}`} label="Hours" />

                <Typography variant={"h3"} sx={{ mx: "1rem", mt: "2rem" }}>
                    :{" "}
                </Typography>

                <SingleCountDown value={`${minutes}`} label="Minutes" />

                <Typography variant={"h3"} sx={{ mx: "1rem", mt: "2rem" }}>
                    :{" "}
                </Typography>

                <SingleCountDown value={`${seconds}`} label="Seconds" />
            </Stack>

            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBold }}>
                {BATTLE_ARENA_OPEN_DATE?.toLocaleDateString("en-us", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                    hour12: false,
                })}
            </Typography>
        </Stack>
    )
}

const SingleCountDown = ({ value, label }: { value: string; label: string }) => {
    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: colors.darkerNeonBlue,
                borderThickness: ".3rem",
            }}
            opacity={0.7}
            backgroundColor={colors.darkerNeonBlue}
            sx={{ height: "100%" }}
        >
            <Stack alignItems="center" sx={{ minWidth: "20rem", p: "1rem 1rem" }}>
                <Typography variant="h1" sx={{ fontSize: "6.3rem", color: colors.offWhite, fontFamily: fonts.nostromoBlack }}>
                    {value}
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
            </Stack>
        </ClipThing>
    )
}
