import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { ClipThing, FancyButton } from "../.."
import { PlayerAbilityPNG } from "../../../assets"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { GetSaleAbilityAvailability } from "../../../fetching"
import { timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerSubscription, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HANGAR_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { PlayerAbility, SaleAbility, SaleAbilityAvailability } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { PlayerAbilityStoreItem } from "./PlayerAbilityStoreItem"

export const PlayerAbilitiesStore = () => {
    const theme = useTheme()
    const { userID } = useAuth()

    const { query: queryAvailability } = useParameterizedQuery(GetSaleAbilityAvailability)
    const [availability, setAvailability] = useState<SaleAbilityAvailability>(SaleAbilityAvailability.CanClaim)
    const [availabilityError, setAvailabilityError] = useState<string>()

    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])

    const [ownedAbilities, setOwnedAbilities] = useState<Map<string, number>>(new Map())

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

    useGameServerSubscription<{
        next_refresh_time: Date | null
        refresh_period_duration_seconds: number
        sale_abilities: SaleAbility[]
    }>(
        {
            URI: "/public_secure/sale_abilities",
            key: GameServerKeys.SubSaleAbilitiesList,
            ready: !!userID,
        },
        (payload) => {
            if (!payload) return
            const t = new Date()
            t.setSeconds(t.getSeconds() + payload.refresh_period_duration_seconds)
            setNextRefreshTime(payload.next_refresh_time || t)
            setSaleAbilities(payload.sale_abilities)
            setAvailability(SaleAbilityAvailability.CanClaim)
            setAvailabilityError(undefined)
            if (isLoaded) return
            setIsLoaded(true)
        },
    )

    useGameServerSubscription<{ id: string; current_price: string }>(
        {
            URI: "/public/sale_abilities",
            key: GameServerKeys.SubSaleAbilitiesPrice,
            ready: !!userID,
        },
        (payload) => {
            if (!payload) return
            setPriceMap((prev) => {
                return new Map(prev.set(payload.id, payload.current_price))
            })
        },
    )

    useGameServerSubscriptionUser<PlayerAbility[]>(
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
                    <TimeLeft key={nextRefreshTime.getMilliseconds()} dateTo={nextRefreshTime} />
                </Typography>
            )
        }

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>Less than an hour</Typography>
    }, [nextRefreshTime])

    const content = useMemo(() => {
        if (!isLoaded) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
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
                                onClaim={() => setAvailability(SaleAbilityAvailability.CanPurchase)}
                                onPurchase={() => setAvailability(SaleAbilityAvailability.Unavailable)}
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
    }, [isLoaded, saleAbilities, theme.factionTheme.primary, priceMap, ownedAbilities, availability])

    return (
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
                            to={`/fleet/${HANGAR_TABS.Abilities}`}
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
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: theme.factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        {content}
                    </Box>
                </Stack>
            </Stack>
        </ClipThing>
    )
}

export const TimeLeft = ({ dateTo }: { dateTo: Date | undefined }) => {
    const { totalSecRemain } = useTimer(dateTo)
    return <>{timeSinceInWords(new Date(), new Date(new Date().getTime() + totalSecRemain * 1000))}</>
}
