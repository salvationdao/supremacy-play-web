import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { PlayerAbilityPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerSubscriptionSecurePublic } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HANGAR_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { SaleAbility } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { MysteryCrateStoreItemLoadingSkeleton } from "../MysteryCratesStore/MysteryCrateStoreItem/MysteryCrateStoreItem"
import { PlayerAbilityStoreItem } from "./PlayerAbilityStoreItem"

export const PlayerAbilitiesStore = () => {
    const theme = useTheme()
    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())
    const [amountMap, setAmountMap] = useState<Map<string, number>>(new Map())

    useGameServerSubscriptionSecurePublic<{
        next_refresh_time: Date | null
        sale_abilities: SaleAbility[]
    }>(
        {
            URI: "sale_abilities",
            key: GameServerKeys.SaleAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setNextRefreshTime(payload.next_refresh_time)
            setSaleAbilities(payload.sale_abilities)
            setAmountMap(new Map()) // reset amount map
            if (isLoaded) return
            setIsLoaded(true)
        },
    )

    useGameServerSubscriptionSecurePublic<{ id: string; current_price: string }>(
        {
            URI: "sale_abilities",
            key: GameServerKeys.SaleAbilitiesPriceSubscribe,
        },
        (payload) => {
            if (!payload) return
            setPriceMap((prev) => {
                return new Map(prev.set(payload.id, payload.current_price))
            })
        },
    )

    useGameServerSubscriptionSecurePublic<{ id: string; amount_sold: number }>(
        {
            URI: "sale_abilities",
            key: GameServerKeys.SaleAbilitiesAmountSubscribe,
        },
        (payload) => {
            if (!payload) return
            setAmountMap((prev) => {
                return new Map(prev.set(payload.id, payload.amount_sold))
            })
        },
    )

    const timeLeft = useMemo(() => {
        if (nextRefreshTime) {
            return (
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>
                    <TimeLeft key={nextRefreshTime.getMilliseconds()} dateTo={nextRefreshTime} />
                </Typography>
            )
        }

        if (saleAbilities.length > 0) {
            return (
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>
                    <TimeLeft key={saleAbilities[0].available_until?.getMilliseconds()} dateTo={saleAbilities[0].available_until} />
                </Typography>
            )
        }

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBold }}>Less than an hour</Typography>
    }, [nextRefreshTime, saleAbilities])

    const content = useMemo(() => {
        if (!isLoaded) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(10).fill(0).map((_, index) => (
                        <MysteryCrateStoreItemLoadingSkeleton key={index} />
                    ))}
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
                        {saleAbilities.map((s) => (
                            <PlayerAbilityStoreItem
                                key={s.id}
                                saleAbility={s}
                                updatedPrice={priceMap.get(s.id) || s.current_price}
                                totalAmount={s.sale_limit}
                                amountSold={amountMap.get(s.id) || s.amount_sold}
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
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        There are no abilities on sale at this time, come back later.
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [isLoaded, priceMap, amountMap, saleAbilities])

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
                    description="Player abilities are abilities that can be bought and used on the battle arena. The price of a player ability is determined by how
                            active it is at any given time. When players buy an ability, its price will go up, and if an ability is not being bought, its price will
                            go down."
                >
                    <FancyButton
                        to={`/fleet/${HANGAR_TABS.Abilities}`}
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.primary,
                            border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                            sx: { position: "relative" },
                        }}
                        sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            px: "2rem",
                            py: ".3rem",
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
