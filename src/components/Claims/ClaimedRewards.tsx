import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useHistory } from "react-router-dom"
import { RainingSupsPNG, SafePNG, SvgClose } from "../../assets"
import { useTheme } from "../../containers/theme"
import { supFormatter } from "../../helpers"
import { useTimer } from "../../hooks"
import { colors, fonts } from "../../theme/theme"
import { RewardResponse } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"

interface ClaimedRewardsProps {
    rewards: RewardResponse[]
    onClose?: () => void
}

export const ClaimedRewards = ({ rewards, onClose }: ClaimedRewardsProps) => {
    const theme = useTheme()
    const history = useHistory()

    const isMechCrateReward = useMemo(() => rewards.find((reward) => reward.label === "MECH"), [rewards])
    const isWeaponCrateReward = useMemo(() => rewards.find((reward) => reward.label === "WEAPON"), [rewards])
    const isSupReward = useMemo(() => rewards.find((reward) => reward.label === "Sups"), [rewards])

    return (
        <ClipThing
            clipSize="10px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            sx={{ m: "4rem", width: "110rem", maxWidth: "80%" }}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack spacing="3rem" justifyContent="center" alignItems="center" sx={{ py: "5rem", px: "5.5rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontFamily: fonts.nostromoBlack, fontSize: "3rem" }}>
                    CONGRATULATIONS!
                </Typography>

                {(isMechCrateReward || isWeaponCrateReward) && (
                    <Stack spacing="1.8rem" alignItems="center">
                        <Typography sx={{ fontFamily: fonts.nostromoBold }}>Your crates will be ready to open in:</Typography>

                        {(isMechCrateReward?.locked_until || isWeaponCrateReward?.locked_until) && (
                            <ClipThing
                                clipSize="8px"
                                border={{
                                    borderColor: theme.factionTheme.primary,
                                    borderThickness: ".2rem",
                                }}
                                sx={{ position: "relative" }}
                                backgroundColor={theme.factionTheme.background}
                            >
                                <Box sx={{ py: "2rem", px: "3rem" }}>
                                    <Countdown dateTo={isMechCrateReward?.locked_until || isWeaponCrateReward?.locked_until} />
                                </Box>
                            </ClipThing>
                        )}
                    </Stack>
                )}

                <Stack direction="row" justifyContent="space-around" alignItems="center">
                    {isWeaponCrateReward && <CrateItem label="Weapon Crate" imageUrl={isWeaponCrateReward.image_url || SafePNG} />}
                    {isMechCrateReward && <CrateItem label="Mech Crate" imageUrl={isMechCrateReward.image_url || SafePNG} />}
                    {isSupReward && <CrateItem label={`${supFormatter(isSupReward.amount)} $SUPS`} imageUrl={RainingSupsPNG} />}
                </Stack>

                <FancyButton
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "9px",
                        backgroundColor: theme.factionTheme.primary,
                        opacity: 1,
                        border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                        sx: { position: "relative", width: "32rem" },
                    }}
                    sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                    onClick={() => {
                        history.push("/fleet/mystery-crates")
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.factionTheme.secondary,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        View in Hangar
                    </Typography>
                </FancyButton>
            </Stack>

            {onClose && (
                <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
                    <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                </IconButton>
            )}
        </ClipThing>
    )
}

const CrateItem = ({ label, imageUrl }: { label: string; imageUrl: string }) => {
    return (
        <Stack alignItems={"center"} spacing="1rem" sx={{ flex: 1 }}>
            <Box component={"img"} src={imageUrl} alt={label} sx={{ width: "55%", height: "auto", objectFit: "contain", objectPosition: "center" }} />
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                {label}
            </Typography>
        </Stack>
    )
}

const Countdown = ({ dateTo }: { dateTo: Date | undefined }) => {
    const { days, hours, minutes, seconds } = useTimer(dateTo)

    if (seconds === undefined) return null

    return (
        <Stack direction="row">
            <SingleCountDown value={`${days}`} label="Days" />
            <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem" }}>
                :{" "}
            </Typography>
            <SingleCountDown value={`${hours}`} label="Hours" />
            <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem" }}>
                :{" "}
            </Typography>
            <SingleCountDown value={`${minutes}`} label="Minutes" />
            <Typography variant={"h2"} sx={{ fontSize: "2.5rem", mx: "1rem" }}>
                :{" "}
            </Typography>
            <SingleCountDown value={`${seconds}`} label="Seconds" />
        </Stack>
    )
}

const SingleCountDown = ({ value, label }: { value: string; label: string }) => {
    return (
        <Stack alignItems="center">
            <Typography variant="h4" sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>
                {value}
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBold }}>
                {label}
            </Typography>
        </Stack>
    )
}
