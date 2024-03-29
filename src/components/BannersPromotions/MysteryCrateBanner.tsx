import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTimer } from "use-timer"
import { useAuth, useMobile, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { msToTime } from "../../helpers"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { StorefrontMysteryCrate } from "../../types"
import { FancyButton } from "../Common/Deprecated/FancyButton"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"

const LOCKED_UNTIL = "2022-07-22T00:00:00+08:00"

export const MysteryCrateBanner = () => {
    const { isMobile } = useMobile()
    const theme = useTheme()
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [crates, setCrate] = useState<StorefrontMysteryCrate[]>([])

    const [unlocked, setUnlocked] = useState(new Date() > new Date(LOCKED_UNTIL))

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
    const secondaryColor = theme.factionTheme.text
    const backgroundColor = theme.factionTheme.u800

    return (
        <NiceBoxThing
            border={{ color: primaryColor }}
            background={{
                colors: [backgroundColor],
            }}
            sx={{ flex: 1, alignSelf: "stretch", flexShrink: 0 }}
        >
            <Stack
                spacing="1.7rem"
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
                    <Stack direction="row" alignItems="stretch">
                        {crates.map((c) => {
                            return (
                                <Box
                                    key={c.id}
                                    sx={{
                                        width: "6rem",
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
                    {unlocked ? (
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                fontFamily: fonts.nostromoHeavy,
                                whiteSpace: "nowrap",
                                animation: `${zoomEffect(1.05)} 10s infinite`,
                            }}
                        >
                            OPEN YOUR CRATES NOW!
                        </Typography>
                    ) : (
                        <Stack alignItems="center" spacing="-.5rem">
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>MYSTERY CRATE OPENING IN </Typography>
                            <Countdown initialTime={(new Date(LOCKED_UNTIL).getTime() - new Date().getTime()) / 1000} setUnlocked={setUnlocked} />
                        </Stack>
                    )}

                    <FancyButton
                        clipThingsProps={{
                            clipSize: "6px",
                            backgroundColor: primaryColor,
                            opacity: 1,
                            border: { borderColor: primaryColor, borderThickness: "1.5px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "3rem", py: ".4rem", color: secondaryColor, flexWrap: 0, whiteSpace: "nowrap" }}
                        to={`/storefront/mystery-crates`}
                    >
                        <Stack justifyContent="center" sx={{ height: "100%" }}>
                            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack, color: secondaryColor }}>
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
        </NiceBoxThing>
    )
}

const Countdown = ({ initialTime, setUnlocked }: { initialTime: number | undefined; setUnlocked: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: initialTime ? Math.round(initialTime) : initialTime,
        endTime: 0,
        timerType: "DECREMENTAL",
        onTimeOver: () => setUnlocked(true),
    })

    if (time < 0) return null

    const { days, hours, minutes, seconds } = msToTime(time * 1000)

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
