import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionSecurePublic } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { SaleAbility } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { Countdown } from "../../Hangar/MysteryCratesHangar/MysteryCrateHangarItem"
import { MysteryCrateStoreItemLoadingSkeleton } from "../MysteryCratesStore/MysteryCrateStoreItem/MysteryCrateStoreItem"
import { PlayerAbilityStoreItem } from "./PlayerAbilityStoreItem"

export const PlayerAbilitiesStore = () => {
    const theme = useTheme()
    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date>()
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())

    useGameServerSubscriptionSecurePublic<{
        next_refresh_time?: Date
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
                            gap: "5rem",
                            alignItems: "stretch",
                            justifyContent: "center",
                            pt: "1rem",
                        }}
                    >
                        {saleAbilities.map((s) => (
                            <PlayerAbilityStoreItem key={s.id} saleAbility={s} updatedPrice={priceMap.get(s.id) || s.current_price} />
                        ))}
                    </Box>
                </Box>
            )
        }

        return (
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
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
            </Box>
        )
    }, [isLoaded, priceMap, saleAbilities])

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
                    title={
                        <>
                            PLAYER ABILITIES <span style={{ color: colors.neonBlue, fontFamily: "inherit", fontSize: "inherit" }}>(ROTATES EVERY 1H)</span>
                        </>
                    }
                    description={
                        <>
                            Player abilities are abilities that can be bought and used on the battle arena. The price of a player ability is determined by how
                            active it is at any given time. When players buy an ability, its price will go up. If an ability is not being bought, its price will
                            go down.
                        </>
                    }
                >
                    <FancyButton
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
                        // onClick={() => {}}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.factionTheme.secondary,
                                whiteSpace: "nowrap",
                            }}
                        >
                            OWNED ABILITIES: 1337
                        </Typography>
                    </FancyButton>
                </PageHeader>
                <Stack direction="row" spacing="1rem" alignItems="center" justifyContent="end" py="2rem" px="4rem">
                    <Typography variant="body1">Next refresh in:</Typography>
                    {nextRefreshTime ? <Countdown dateTo={nextRefreshTime} /> : <Typography>Less than an hour</Typography>}
                </Stack>
                <Stack
                    sx={{
                        px: "2rem",
                        flex: 1,
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
