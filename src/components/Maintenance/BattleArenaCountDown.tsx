import { Stack, Typography, useMediaQuery } from "@mui/material"
import { useEffect } from "react"
import { BattleArenaOpeningWebP } from "../../assets"
import { BATTLE_ARENA_OPEN_DATE } from "../../constants"
import { useTimer } from "../../hooks"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"

export const BattleArenaCountDown = () => {
    const below1080 = useMediaQuery("(max-width:1080px)")

    return (
        <Stack
            spacing="12rem"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                width: "100%",
                height: "100%",
                p: "5rem 6rem",
                zIndex: siteZIndex.RoutePage,
                fontFamily: fonts.nostromoBlack,
                background: `url(${BattleArenaOpeningWebP})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <span style={{ textAlign: "center" }}>
                <Typography variant={below1080 ? "h2" : "h1"} sx={{ display: "inline", fontFamily: fonts.nostromoHeavy }}>
                    &nbsp;BATTLE ARENA OPENS&nbsp;
                </Typography>
            </span>

            <Countdown />
        </Stack>
    )
}

const Countdown = () => {
    const below1080 = useMediaQuery("(max-width:1080px)")
    const { days, hours, minutes, seconds, totalSecRemain } = useTimer(BATTLE_ARENA_OPEN_DATE)

    useEffect(() => {
        if (totalSecRemain <= 0) {
            location.reload()
        }
    }, [totalSecRemain])

    if (!BATTLE_ARENA_OPEN_DATE || seconds === undefined || totalSecRemain <= 0) {
        return null
    }

    return (
        <Stack alignItems="center" spacing="1.6rem">
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

            <Stack direction="row" alignItems="center">
                <SingleCountDown value={`${days}`} label="Days" />

                <Typography variant={below1080 ? "h4" : "h3"} sx={{ mx: "1rem" }}>
                    :{" "}
                </Typography>

                <SingleCountDown value={`${hours}`} label="Hours" />

                <Typography variant={below1080 ? "h4" : "h3"} sx={{ mx: "1rem" }}>
                    :{" "}
                </Typography>

                <SingleCountDown value={`${minutes}`} label="Minutes" />

                <Typography variant={below1080 ? "h4" : "h3"} sx={{ mx: "1rem" }}>
                    :{" "}
                </Typography>

                <SingleCountDown value={`${seconds}`} label="Seconds" />
            </Stack>
        </Stack>
    )
}

const SingleCountDown = ({ value, label }: { value: string; label: string }) => {
    const below1080 = useMediaQuery("(max-width:1080px)")

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: colors.darkerNeonBlue,
                borderThickness: ".3rem",
            }}
            opacity={0.8}
            backgroundColor={colors.darkestNeonBlue}
            sx={{ height: "100%" }}
        >
            <Stack alignItems="center" sx={{ minWidth: below1080 ? "16rem" : "20rem", p: "1rem 1rem" }}>
                <Typography variant="h1" sx={{ fontSize: below1080 ? "4rem" : "6.3rem", fontFamily: fonts.nostromoBlack }}>
                    {value}
                </Typography>
                <Typography variant={below1080 ? "body1" : "h6"} sx={{ fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
            </Stack>
        </ClipThing>
    )
}
