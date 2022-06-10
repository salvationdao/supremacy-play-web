import { ClipThing } from "../Common/ClipThing"
import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../theme/theme"
import { FancyButton } from "../Common/FancyButton"
import { useTheme } from "../../containers/theme"
import { useHistory } from "react-router-dom"
import { RewardResponse } from "../../types"
import { supFormatter } from "../../helpers"
import { RainingSupsPNG, SafePNG } from "../../assets"
import { useTimer } from "../../hooks"

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

export const GenericCountdown = ({ dateTo }: ClaimRewardsCountdownProps) => {
    const { days, hours, minutes, seconds } = useTimer(dateTo)

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem", textAlign: "center" }}>
                        {days}
                    </Typography>
                    <Typography>Days</Typography>
                </Stack>
                <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem", textAlign: "center" }}>
                    :{" "}
                </Typography>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem", textAlign: "center" }}>
                        {hours}
                    </Typography>
                    <Typography>Hours</Typography>
                </Stack>
                <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem", textAlign: "center" }}>
                    :{" "}
                </Typography>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem", textAlign: "center" }}>
                        {minutes}
                    </Typography>
                    <Typography>Minutes</Typography>
                </Stack>
                <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem", textAlign: "center" }}>
                    :{" "}
                </Typography>
                <Stack>
                    <Typography variant={"h2"} sx={{ fontSize: "2.5rem", textAlign: "center" }}>
                        {seconds}
                    </Typography>
                    <Typography>Seconds</Typography>
                </Stack>
            </Box>
        </>
    )
}
