import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router"
import { useAuth, useMobile, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { StorefrontMysteryCrate } from "../../../types"
import { ClipThing } from "../ClipThing"
import { FancyButton } from "../FancyButton"

const LOCKED_UNTIL = "2022-14-15T00:00:00+08:00"

export const MysteryCrateBanner = () => {
    const { isMobile } = useMobile()
    const location = useLocation()
    const theme = useTheme()
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [crates, setCrate] = useState<StorefrontMysteryCrate[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<StorefrontMysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
                    page: 1,
                    page_size: 2,
                })

                if (!resp) return
                setCrate(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get mystery crates."
                console.error(message)
            }
        })()
    }, [send])

    const faction = useMemo(() => getFaction(factionID), [factionID, getFaction])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            backgroundColor={backgroundColor}
            sx={{ flex: 1, alignSelf: "stretch" }}
        >
            <Stack
                direction="row"
                alignItems="stretch"
                justifyContent="center"
                sx={{
                    position: "relative",
                    px: "2rem",
                    zIndex: 2,
                    height: "100%",
                }}
            >
                {/* Images */}
                {!isMobile && crates && crates.length > 0 && (
                    <Stack direction="row" alignItems="stretch" spacing="-1.3rem">
                        {crates.map((c) => {
                            return (
                                <Box
                                    key={c.id}
                                    sx={{
                                        width: "12rem",
                                        height: "100%",
                                        backgroundColor,
                                        background: `url(${c.image_url || c.avatar_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        transform: "scale(1.1)",
                                    }}
                                />
                            )
                        })}
                    </Stack>
                )}

                {/* Countdown and CTA button */}
                <Stack direction="row" alignItems="center" spacing="2.2rem" sx={{ py: ".5rem" }}>
                    <Stack alignItems="center">
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>MYSTERY CRATE OPENING IN </Typography>
                        <Countdown dateTo={new Date(LOCKED_UNTIL)} />
                    </Stack>

                    <FancyButton
                        clipThingsProps={{
                            clipSize: "6px",
                            backgroundColor: primaryColor,
                            opacity: 1,
                            border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "4rem", py: ".8rem", color: secondaryColor }}
                        to={`/storefront/mystery-crates${location.hash}`}
                    >
                        <Stack justifyContent="center" sx={{ height: "100%" }}>
                            <Typography variant="body2" sx={{ fontWeight: "fontWeightBold", color: secondaryColor }}>
                                SHOP NOW
                            </Typography>
                        </Stack>
                    </FancyButton>
                </Stack>

                {/* Background */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        background: `url(${faction.background_url})`,
                        backgroundColor: backgroundColor,
                        borderLeft: `${primaryColor}20 2px solid`,
                        zIndex: -1,
                        opacity: 0.6,
                    }}
                />
            </Stack>
        </ClipThing>
    )
}

const Countdown = ({ dateTo }: { dateTo: Date | undefined }) => {
    const { days, hours, minutes, seconds } = useTimer(dateTo)

    if (seconds === undefined) return null

    return (
        <Stack direction="row">
            <SingleCountDown value={`${days}`} label="DD" />
            <Typography sx={{ fontSize: "1.8rem", mx: "1rem" }}>: </Typography>
            <SingleCountDown value={`${hours}`} label="HH" />
            <Typography sx={{ fontSize: "1.8rem", mx: "1rem" }}>: </Typography>
            <SingleCountDown value={`${minutes}`} label="MM" />
            <Typography sx={{ fontSize: "1.8rem", mx: "1rem" }}>: </Typography>
            <SingleCountDown value={`${seconds}`} label="SS" />
        </Stack>
    )
}

const SingleCountDown = ({ value, label }: { value: string; label: string }) => {
    return (
        <Stack direction="row" alignItems="center" spacing=".3rem">
            <Typography variant="h6" sx={{ color: colors.neonBlue, fontFamily: fonts.nostromoHeavy }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ pt: ".3rem", fontFamily: fonts.nostromoBlack }}>
                {label}
            </Typography>
        </Stack>
    )
}
