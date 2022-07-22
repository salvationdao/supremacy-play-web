import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { RainingSupsPNG, SafePNG, SvgClose } from "../../assets"
import { useAuth, useSnackbar, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { supFormatter } from "../../helpers"
import { useTimer } from "../../hooks"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MysteryCrateType, OpenCrateResponse, RewardResponse } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"
import { OpeningCrate } from "../Hangar/MysteryCratesHangar/MysteryCratesHangar"

interface ClaimedRewardsProps {
    rewards: RewardResponse[]
    onClose?: () => void
    setOpeningCrate?: React.Dispatch<React.SetStateAction<OpeningCrate | undefined>>
    setOpenedRewards?: React.Dispatch<React.SetStateAction<OpenCrateResponse | undefined>>
}

export const ClaimedRewards = ({ rewards, onClose, setOpeningCrate, setOpenedRewards }: ClaimedRewardsProps) => {
    const { getFaction } = useSupremacy()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { factionID } = useAuth()
    const theme = useTheme()
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])
    const mechRewards = useMemo(() => rewards.filter((reward) => reward.label === "MECH"), [rewards])
    const weaponRewards = useMemo(() => rewards.filter((reward) => reward.label === "WEAPON"), [rewards])
    const isSupReward = useMemo(() => rewards.find((reward) => reward.label === "Sups"), [rewards])

    const crateToOpen = rewards[0].mystery_crate
    const isLocked = new Date() < (mechRewards[0]?.locked_until || weaponRewards[0]?.locked_until || Date.now)

    const openCrate = useCallback(async () => {
        try {
            if (!crateToOpen) return

            setOpeningCrate &&
                setOpeningCrate({
                    factionID: crateToOpen.faction_id,
                    crateType: crateToOpen.label.toLowerCase().includes("weapon") ? MysteryCrateType.Weapon : MysteryCrateType.Mech,
                })

            setLoading(true)

            const resp = await send<OpenCrateResponse>(GameServerKeys.OpenCrate, {
                id: crateToOpen.id,
            })

            if (!resp) return
            setOpenedRewards && setOpenedRewards({ ...resp })
            onClose && onClose()
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get mystery crates."
            newSnackbarMessage(message, "error")
            console.error(message)
        } finally {
            setLoading(false)
        }
    }, [crateToOpen, setOpeningCrate, send, setOpenedRewards, onClose, newSnackbarMessage])

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            sx={{ m: "4rem", width: "110rem", maxWidth: "80%" }}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack spacing="2rem" justifyContent="center" alignItems="center" sx={{ position: "relative", py: "5rem", px: "5.5rem", textAlign: "center" }}>
                {/* Background image */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0.08,
                        background: `url(${faction.background_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        zIndex: -1,
                    }}
                />

                <Typography variant={"h1"} sx={{ fontFamily: fonts.nostromoBlack, fontSize: "3rem" }}>
                    CONGRATULATIONS!
                </Typography>

                {(mechRewards.length > 0 || weaponRewards.length > 0) && isLocked ? (
                    <Stack spacing="1.8rem" alignItems="center">
                        <Typography sx={{ fontFamily: fonts.nostromoBold }}>Your crates will be ready to open in:</Typography>
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
                                <Countdown dateTo={mechRewards[0]?.locked_until || weaponRewards[0]?.locked_until} />
                            </Box>
                        </ClipThing>
                    </Stack>
                ) : (
                    <Typography sx={{ fontFamily: fonts.nostromoBold }}>You have purchased:</Typography>
                )}

                <Stack direction="row" justifyContent="space-around" alignItems="center">
                    {weaponRewards.length > 0 && (
                        <CrateItem quantity={weaponRewards.length} label="Weapon Crate" imageUrl={weaponRewards[0]?.image_url || SafePNG} />
                    )}
                    {mechRewards.length > 0 && <CrateItem quantity={mechRewards.length} label="Mech Crate" imageUrl={mechRewards[0]?.image_url || SafePNG} />}
                    {isSupReward && <CrateItem label={`${supFormatter(isSupReward.amount)} $SUPS`} imageUrl={RainingSupsPNG} />}
                </Stack>

                <Stack alignItems="center" spacing="1.4rem" sx={{ mt: "auto" }}>
                    {!isLocked && crateToOpen && (
                        <FancyButton
                            loading={loading}
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: theme.factionTheme.primary,
                                opacity: 1,
                                border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                sx: { position: "relative", width: "32rem" },
                            }}
                            sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                            onClick={openCrate}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.factionTheme.secondary,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                OPEN NOW
                            </Typography>
                        </FancyButton>
                    )}

                    <FancyButton
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.background,
                            opacity: 1,
                            border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                            sx: { position: "relative", width: "32rem" },
                        }}
                        sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                        to={`/fleet/mystery-crates${location.hash}`}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.factionTheme.primary,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            VIEW IN FLEET
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>

            {onClose && (
                <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
                    <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                </IconButton>
            )}
        </ClipThing>
    )
}

const CrateItem = ({ label, imageUrl, quantity }: { label: string; imageUrl: string; quantity?: number }) => {
    return (
        <Stack alignItems="center" spacing=".8rem" sx={{ flex: 1 }}>
            <Box component="img" src={imageUrl} alt={label} sx={{ width: "55%", height: "auto", objectFit: "contain", objectPosition: "center" }} />
            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                {quantity && (
                    <>
                        {quantity} <span>x</span>
                    </>
                )}{" "}
                {label}
            </Typography>
        </Stack>
    )
}

const Countdown = ({ dateTo }: { dateTo: Date | undefined }) => {
    const { days, hours, minutes, seconds, totalSecRemain } = useTimer(dateTo)

    if (seconds === undefined || totalSecRemain <= 0) return null

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
