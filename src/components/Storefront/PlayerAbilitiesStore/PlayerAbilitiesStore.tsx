import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { ClipThing, FancyButton } from "../.."
import { HangarBg, PlayerAbilityPNG } from "../../../assets"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { GetSaleAbilityAvailability } from "../../../fetching"
import { secondsToWords } from "../../../helpers"
import { useGameServerSubscriptionSecured, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { PlayerAbility, SaleAbility, SaleAbilityAvailability } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { PlayerAbilityStoreItem } from "./PlayerAbilityStoreItem"

export const PlayerAbilitiesStore = () => {
    const theme = useTheme()
    const { userID } = useAuth()

    const { query: queryAvailability } = useParameterizedQuery(GetSaleAbilityAvailability)
    const [availability, setAvailability] = useState<SaleAbilityAvailability>(SaleAbilityAvailability.CanPurchase)
    const [availabilityError, setAvailabilityError] = useState<string>()

    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])

    const [ownedAbilities, setOwnedAbilities] = useState<Map<string, number>>(new Map())

    const refetchSaleAvailability = useCallback(async () => {
        if (!userID) return
        try {
            const resp = await queryAvailability(userID)
            if (resp.error || resp.payload == null) return
            setAvailability(resp.payload)
            setAvailabilityError(undefined)
        } catch (e) {
            let message = "Failed to obtain purchase availability during this sale period."
            if (typeof e === "string") {
                message = e
            } else if (e instanceof Error) {
                message = e.message
            }
            console.error(e)
            setAvailabilityError(message)
        }
    }, [queryAvailability, userID])

    useEffect(() => {
        if (!userID) return
        ;(async () => {
            try {
                const resp = await queryAvailability(userID)
                if (resp.error || resp.payload == null) return
                setAvailability(resp.payload)
            } catch (e) {
                let message = "Failed to obtain purchase availability during this sale period."
                if (typeof e === "string") {
                    message = e
                } else if (e instanceof Error) {
                    message = e.message
                }
                console.error(e)
                setAvailabilityError(message)
            }
        })()
    }, [queryAvailability, userID])

    useGameServerSubscriptionSecured<{ id: string; current_price: string }>(
        {
            URI: "/sale_abilities",
            key: GameServerKeys.SubSaleAbilitiesPrice,
        },
        (payload) => {
            if (!payload) return
            setPriceMap((prev) => {
                return new Map(prev.set(payload.id, payload.current_price))
            })
        },
    )

    useGameServerSubscriptionSecured<{
        next_refresh_time: Date | null
        time_left_seconds: number
        sale_abilities: SaleAbility[]
    }>(
        {
            URI: "/sale_abilities",
            key: GameServerKeys.SubSaleAbilitiesList,
        },
        (payload) => {
            if (!payload) return

            const t = new Date()
            t.setSeconds(t.getSeconds() + Math.max(payload.time_left_seconds, 1))
            setNextRefreshTime(t)
            setSaleAbilities(payload.sale_abilities)

            // Fetch sale availability
            refetchSaleAvailability()

            if (isLoaded) return
            setIsLoaded(true)
        },
    )

    useGameServerSubscriptionSecuredUser<PlayerAbility[]>(
        {
            URI: "/player_abilities",
            key: GameServerKeys.SubPlayerAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setOwnedAbilities((prev) => {
                const updated = new Map(prev)
                for (const p of payload) {
                    updated.set(p.blueprint_id, p.count)
                }
                return updated
            })
        },
    )

    const timeLeft = useMemo(() => {
        if (nextRefreshTime) {
            return (
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold, textTransform: "uppercase" }}>
                    <TimeLeft key={nextRefreshTime.getTime()} dateTo={nextRefreshTime} />
                </Typography>
            )
        }

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>Less than an hour</Typography>
    }, [nextRefreshTime])

    const content = useMemo(() => {
        if (!isLoaded) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "10rem" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (saleAbilities.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            overflow: "visible",
                            display: "grid",
                            width: "100%",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gridTemplateRows: "repeat(1, min-content)",
                            gap: "10rem",
                            alignItems: "stretch",
                            justifyContent: "center",
                            py: "1rem",
                        }}
                    >
                        {saleAbilities.map((s, index) => (
                            <PlayerAbilityStoreItem
                                key={`${s.id}-${index}`}
                                saleAbility={s}
                                price={priceMap.get(s.id)}
                                amount={ownedAbilities.get(s.blueprint_id)}
                                onPurchase={() => refetchSaleAvailability()}
                                availability={availability}
                            />
                        ))}
                    </Box>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "43rem" }}>
                    <Box
                        sx={{
                            width: "9rem",
                            height: "9rem",
                            opacity: 0.6,
                            filter: "grayscale(100%)",
                            border: "#FFFFFF10 1px solid",
                            background: `url(${PlayerAbilityPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "top center",
                            backgroundSize: "contain",
                        }}
                    />

                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        There are no abilities on sale at this time, come back later.
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [isLoaded, saleAbilities, theme.factionTheme.primary, priceMap, ownedAbilities, availability, refetchSaleAvailability])

    return (
        <Box
            alignItems="center"
            sx={{
                height: "100%",
                p: "1rem",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack
                    sx={{
                        flex: 1,
                        position: "relative",
                        height: "100%",
                    }}
                >
                    <PageHeader
                        imageUrl={PlayerAbilityPNG}
                        title="PLAYER ABILITIES"
                        description={
                            <Stack>
                                <Typography sx={{ fontSize: "1.85rem" }}>
                                    Player abilities are abilities that can be claimed and used on the battle arena.
                                </Typography>
                                {availabilityError && (
                                    <Typography variant="body2" sx={{ color: colors.red }}>
                                        {availabilityError}
                                    </Typography>
                                )}
                            </Stack>
                        }
                    >
                        <Box sx={{ flexShrink: 0, pr: "1.5rem", ml: "auto !important" }}>
                            <FancyButton
                                to={`/fleet/abilities`}
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: theme.factionTheme.primary,
                                    border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    px: "1.6rem",
                                    py: ".6rem",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.factionTheme.secondary,
                                        whiteSpace: "nowrap",
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    VIEW OWNED ABILITIES
                                </Typography>
                            </FancyButton>
                        </Box>
                    </PageHeader>

                    <Stack direction="row" spacing=".6rem" alignItems="center" sx={{ ml: "3rem", mt: "2rem", mb: ".6rem" }}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Next refresh in:</Typography>
                        {timeLeft}
                    </Stack>

                    <Stack
                        sx={{
                            flex: 1,
                            width: "100%",
                            maxWidth: "1400px",
                            mx: "auto",
                            px: "2rem",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",

                                "::-webkit-scrollbar": {
                                    width: "1rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: theme.factionTheme.primary,
                                },
                            }}
                        >
                            <Box sx={{ height: 0 }}>{content}</Box>
                        </Box>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}

interface TimeLeftProps {
    dateTo: Date
}

export const TimeLeft = ({ dateTo }: TimeLeftProps) => {
    const secondsLeftRef = useRef(Math.round((dateTo.getTime() - new Date().getTime()) / 1000))
    const containerRef = useRef<HTMLDivElement>()

    useEffect(() => {
        const t = setInterval(() => {
            if (secondsLeftRef.current < 1) return
            secondsLeftRef.current -= 1

            if (!containerRef.current) return
            containerRef.current.innerText = secondsLeftRef.current > 0 ? secondsToWords(secondsLeftRef.current) : "REFRESHING"
        }, 1000)

        return () => clearInterval(t)
    }, [dateTo])

    return (
        <Box ref={containerRef} component="span">
            {secondsLeftRef.current > 0 ? secondsToWords(secondsLeftRef.current) : "REFRESHING"}
        </Box>
    )
}
