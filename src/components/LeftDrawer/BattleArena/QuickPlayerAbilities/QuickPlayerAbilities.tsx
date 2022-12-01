import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { useAuth } from "../../../../containers"
import { GetSaleAbilityAvailability } from "../../../../fetching"
import { useGameServerSubscriptionSecured, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { PlayerAbility, SaleAbility, SaleAbilityAvailability } from "../../../../types"
import { PlayerAbilitySmallCard } from "../../../Common/PlayerAbility/PlayerAbilitySmallCard"
import { TimeLeft } from "../../../Common/TimeLeft"
import { SectionCollapsible } from "../Common/SectionCollapsible"

export const QuickPlayerAbilities = () => {
    const { userID } = useAuth()
    if (!userID) return null
    return <QuickPlayerAbilitiesInner userID={userID} />
}

const QuickPlayerAbilitiesInner = React.memo(function QuickPlayerAbilitiesInner({ userID }: { userID: string }) {
    const { query: queryAvailability } = useParameterizedQuery(GetSaleAbilityAvailability)
    const [availability, setAvailability] = useState<SaleAbilityAvailability>(SaleAbilityAvailability.CanPurchase)
    const [availabilityError, setAvailabilityError] = useState<string>()

    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())
    const [error, setError] = useState<string>()

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

    useGameServerSubscriptionSecured<{ id: string; current_price: string }[]>(
        {
            URI: "/sale_abilities",
            key: GameServerKeys.SubSaleAbilitiesPrice,
        },
        (payload) => {
            if (!payload) return
            setPriceMap(new Map(payload.map((p) => [p.id, p.current_price])))
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
            setError(undefined)

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
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.rajdhaniMedium, textTransform: "uppercase" }}>
                    <TimeLeft key={nextRefreshTime.getTime()} dateTo={nextRefreshTime} />
                </Typography>
            )
        }

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.rajdhaniMedium, textTransform: "uppercase" }}>Less than an hour</Typography>
    }, [nextRefreshTime])

    return (
        <SectionCollapsible
            label="PURCHASE ABILITIES"
            tooltip="Purchase abilities that are currently on sale."
            initialExpanded={true}
            localStoragePrefix="quickPlayerAbility"
        >
            <Stack sx={{ minHeight: "12rem" }}>
                <Stack>
                    <Stack direction="row" spacing=".6rem" alignItems="center">
                        <Typography sx={{ fontWeight: "bold", textTransform: "uppercase" }}>Next refresh in:</Typography>
                        {timeLeft}
                    </Stack>
                    {error && (
                        <Typography variant="body2" sx={{ color: colors.red }}>
                            {error}
                        </Typography>
                    )}
                    {availabilityError && (
                        <Typography variant="body2" sx={{ color: colors.red }}>
                            {availabilityError}
                        </Typography>
                    )}
                </Stack>

                {!isLoaded && (
                    <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                            <CircularProgress />
                        </Stack>
                    </Stack>
                )}

                {isLoaded && saleAbilities && saleAbilities.length > 0 && (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                            gridTemplateRows: "repeat(1, fr)",
                            gap: "1rem",
                            justifyContent: "center",
                            px: "2rem",
                            py: "1rem",
                            width: "100%",
                        }}
                    >
                        {saleAbilities.map((sa, index) => {
                            const price = priceMap.get(sa.id)
                            if (!price) return null

                            const ownedCount = ownedAbilities.get(sa.blueprint_id) || 0

                            return (
                                // <QuickPlayerAbilitiesItem
                                //     key={`${s.id}-${index}`}
                                //     saleAbility={s}
                                //     price={priceMap.get(s.id)}
                                //     amount={ownedAbilities.get(s.blueprint_id)}
                                //     setClaimError={setError}
                                //     onPurchase={() => refetchSaleAvailability()}
                                //     availability={availability}
                                // />

                                <PlayerAbilitySmallCard
                                    key={`${sa.id}-${index}`}
                                    anyAbility={sa.ability}
                                    ownedCount={ownedCount}
                                    onClickAction="buy"
                                    onClickCallback={() => refetchSaleAvailability()}
                                    buyConfig={{
                                        price: price,
                                        availability: availability,
                                    }}
                                />
                            )
                        })}
                    </Box>
                )}

                {isLoaded && saleAbilities && saleAbilities.length <= 0 && (
                    <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    px: "1.28rem",
                                    color: colors.grey,
                                    fontFamily: fonts.nostromoBold,
                                    textAlign: "center",
                                }}
                            >
                                NO ABILITIES ARE ON SALE AT THE MOMENT.
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </SectionCollapsible>
    )
})
