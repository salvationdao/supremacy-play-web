import { ClipThing } from "../Common/ClipThing"
import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../theme/theme"
import { FancyButton } from "../Common/FancyButton"
import { useTheme } from "../../containers/theme"
import { useHistory } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { RewardResponse } from "../../types"
import { supFormatter } from "../../helpers"
import { RainingSupsPNG, SafePNG } from "../../assets"

interface ClaimedRewardsProps {
    rewards: RewardResponse[]
}
export const ClaimedRewards = ({ rewards }: ClaimedRewardsProps) => {
    return <ClaimedRewardsInner rewards={rewards} />
}

const ClaimedRewardsInner = ({ rewards }: ClaimedRewardsProps) => {
    const theme = useTheme()
    const history = useHistory()

    const mechCrateReward = rewards.find((reward) => reward.label === "MECH")
    const weaponCrateReward = rewards.find((reward) => reward.label === "WEAPON")
    const supReward = rewards.find((reward) => reward.label === "Sups")

    const renderTitle = () => {
        const arr: string[] = []
        if (mechCrateReward) {
            arr.push(`a ${mechCrateReward.label} Crate`)
        }
        if (weaponCrateReward) {
            arr.push(`a ${weaponCrateReward.label} Crate`)
        }
        if (supReward) {
            arr.push(`${supFormatter(supReward.amount)} $SUPS`)
        }

        const rewardString = arr.join(", ")
        rewardString.concat()
        return rewardString
    }
    return (
        <ClipThing
            clipSize="8px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".2rem",
            }}
            sx={{ py: "5rem", px: "2rem", maxWidth: "80%" }}
            opacity={0.9}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontSize: "3rem", mb: "2rem" }}>
                    You have received {renderTitle()}!
                </Typography>
                {(mechCrateReward || weaponCrateReward) && (
                    <>
                        <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", lineHeight: "1.2" }}>
                            You&apos;re crates will be ready to open in:
                        </Typography>

                        <ClipThing
                            clipSize="5px"
                            corners={{
                                topRight: true,
                                bottomLeft: true,
                            }}
                            border={{
                                borderColor: theme.factionTheme.primary,
                                borderThickness: ".1rem",
                            }}
                            sx={{ position: "relative", my: "5rem", py: "1.5rem", px: "3rem" }}
                            backgroundColor={theme.factionTheme.background}
                            opacity={0.9}
                        >
                            {mechCrateReward?.locked_until || weaponCrateReward?.locked_until ? (
                                <GenericCountdown dateTo={mechCrateReward?.locked_until || weaponCrateReward?.locked_until} />
                            ) : null}
                        </ClipThing>
                    </>
                )}

                <Stack direction={"row"} sx={{ display: "flex", justifyContent: "space-around", width: "100%", alignItems: "center" }}>
                    {weaponCrateReward && (
                        <Stack alignItems={"center"} sx={{ minWidth: "33%" }}>
                            {/*weapon crate img*/}
                            <Box component={"img"} src={weaponCrateReward?.image_url || SafePNG} sx={{ width: "80%", height: "auto", mb: "1rem" }} />
                            <Typography variant={"h2"} sx={{ fontSize: "2rem", mb: "2rem" }}>
                                Weapon Crate
                            </Typography>
                        </Stack>
                    )}
                    {mechCrateReward && (
                        <Stack alignItems={"center"} sx={{ minWidth: "33%" }}>
                            {/*mech crate img*/}
                            <Box component={"img"} src={mechCrateReward.image_url || SafePNG} sx={{ width: "80%", height: "auto", mb: "1rem" }} />
                            <Typography variant={"h2"} sx={{ fontSize: "2rem", mb: "2rem" }}>
                                Mech Crate
                            </Typography>
                        </Stack>
                    )}
                    {supReward && (
                        <Stack alignItems={"center"} sx={{ minWidth: "33%" }}>
                            {/*sups img- get amount from be*/}
                            <Box component={"img"} src={RainingSupsPNG} sx={{ width: "80%", maxWidth: "500px", height: "auto", mb: "1rem" }} />
                            <Typography variant={"h2"} sx={{ fontSize: "2rem", mb: "2rem" }}>
                                {supFormatter(supReward.amount)} $SUPS
                            </Typography>
                        </Stack>
                    )}
                </Stack>
                <FancyButton
                    onClick={() => {
                        history.push("/hangar")
                    }}
                    clipThingsProps={{
                        clipSize: "8px",
                        opacity: 0.6,
                        backgroundColor: theme.factionTheme.primary,
                        border: { isFancy: true, borderColor: theme.factionTheme.primary },
                        sx: { mr: "1rem", position: "relative", flexShrink: 0 },
                    }}
                    sx={{ px: "8rem", py: "1rem" }}
                >
                    <Typography sx={{ fontFamily: fonts.nostromoBold, fontSize: "2rem" }}>View in Hangar</Typography>
                </FancyButton>
            </Stack>
        </ClipThing>
    )
}

interface ClaimRewardsCountdownProps {
    dateTo: Date | undefined
}

const GenericCountdown = ({ dateTo }: ClaimRewardsCountdownProps) => {
    const [daysTo, setDaysTo] = useState<number>(-1)
    const [hoursTo, setHoursTo] = useState<number>(-1)
    const [minutesTo, setMinutesTo] = useState<number>(-1)
    const [secondsTo, setSecondsTo] = useState<number>(-1)
    const [hasPassed, setHasPassed] = useState(false)

    const calcTime = useCallback(() => {
        if (hasPassed || !dateTo) return

        const s = 1000
        const m = s * 60
        const h = m * 60
        const d = h * 24

        const timeToDate = dateTo.getTime() - new Date().getTime()

        if (timeToDate < 0) {
            setHasPassed(true)
        }

        const days = Math.floor(timeToDate / d)
        const hours = Math.floor((timeToDate % d) / h)
        const minutes = Math.floor((timeToDate % h) / m)
        const seconds = Math.floor((timeToDate % m) / s)

        setDaysTo(days)
        setHoursTo(hours)
        setMinutesTo(minutes)
        setSecondsTo(seconds)
    }, [dateTo, hasPassed])

    useEffect(() => {
        const timer = setInterval(() => {
            calcTime()
        }, 1000)
        if (hasPassed) {
            clearInterval(timer)
        }
    }, [calcTime, hasPassed])

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem" }}>
                        {daysTo}
                    </Typography>
                    <Typography>Days</Typography>
                </Stack>
                <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem" }}>
                    :{" "}
                </Typography>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem" }}>
                        {hoursTo}
                    </Typography>
                    <Typography>Hours</Typography>
                </Stack>
                <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem" }}>
                    :{" "}
                </Typography>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem" }}>
                        {minutesTo}
                    </Typography>
                    <Typography>Minutes</Typography>
                </Stack>
                <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem" }}>
                    :{" "}
                </Typography>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem" }}>
                        {secondsTo}
                    </Typography>
                    <Typography>Seconds</Typography>
                </Stack>
            </Box>
        </>
    )
}
