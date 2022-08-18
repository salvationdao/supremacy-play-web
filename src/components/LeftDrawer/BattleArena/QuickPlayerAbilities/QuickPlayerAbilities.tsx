import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { SvgRefresh } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { GetSaleAbilityAvailability } from "../../../../fetching"
import { useGameServerCommandsUser, useGameServerSubscriptionSecured, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { PlayerAbility, SaleAbility, SaleAbilityAvailability } from "../../../../types"
import { TimeLeft } from "../../../Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { SectionHeading } from "../Common/SectionHeading"
import { QuickPlayerAbilitiesItem } from "./QuickPlayerAbilitiesItem"

export const QuickPlayerAbilities = () => {
    const { userID } = useAuth()
    if (!userID) return null
    return <QuickPlayerAbilitiesInner userID={userID} />
}

const QuickPlayerAbilitiesInner = ({ userID }: { userID: string }) => {
    const theme = useTheme()

    const { send } = useGameServerCommandsUser("/user_commander")
    const { query: queryAvailability } = useParameterizedQuery(GetSaleAbilityAvailability)
    const [availability, setAvailability] = useState<SaleAbilityAvailability>(SaleAbilityAvailability.CanClaim)
    const [availabilityError, setAvailabilityError] = useState<string>()

    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())
    const [purchaseError, setPurchaseError] = useState<string>()

    const [ownedAbilities, setOwnedAbilities] = useState<Map<string, number>>(new Map())

    const refetchSaleAbilities = useCallback(async () => {
        try {
            const resp = await send<{
                next_refresh_time: Date | null
                refresh_period_duration_seconds: number
                sale_abilities: SaleAbility[]
            }>(GameServerKeys.SaleAbilitiesList)

            if (!resp) return
            const t = new Date()
            t.setSeconds(t.getSeconds() + resp.refresh_period_duration_seconds)
            setNextRefreshTime(resp.next_refresh_time || t)
            setSaleAbilities(resp.sale_abilities)
            setAvailability(SaleAbilityAvailability.CanClaim)
            setPurchaseError(undefined)
            setAvailabilityError(undefined)
            if (isLoaded) return
            setIsLoaded(true)
        } catch (e) {
            console.error(e)
        }
    }, [isLoaded, send])

    useEffect(() => {
        refetchSaleAbilities()
    }, [refetchSaleAbilities])

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

    // useGameServerSubscriptionSecured<{
    //     next_refresh_time: Date | null
    //     refresh_period_duration_seconds: number
    //     sale_abilities: SaleAbility[]
    // }>(
    //     {
    //         URI: "/sale_abilities",
    //         key: GameServerKeys.SubSaleAbilitiesList,
    //     },
    //     (payload) => {
    //         if (!payload) return
    //         const t = new Date()
    //         t.setSeconds(t.getSeconds() + payload.refresh_period_duration_seconds)
    //         setNextRefreshTime(payload.next_refresh_time || t)
    //         setSaleAbilities(payload.sale_abilities)
    //         setAvailability(SaleAbilityAvailability.CanClaim)
    //         setPurchaseError(undefined)
    //         setAvailabilityError(undefined)
    //         if (isLoaded) return
    //         setIsLoaded(true)
    //     },
    // )

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

    const primaryColor = theme.factionTheme.primary

    const timeLeft = useMemo(() => {
        if (nextRefreshTime) {
            return (
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>
                    <TimeLeft key={nextRefreshTime.getMilliseconds()} dateTo={nextRefreshTime} onComplete={refetchSaleAbilities} />
                </Typography>
            )
        }

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>Less than an hour</Typography>
    }, [nextRefreshTime, refetchSaleAbilities])

    return (
        <Box>
            <SectionHeading label="PURCHASE ABILITIES" tooltip="Purchase abilities that are currently on sale." />

            <Stack sx={{ p: "1.5rem 1.1rem", backgroundColor: "#FFFFFF12", boxShadow: 2, border: "#FFFFFF20 1px solid" }}>
                <Stack>
                    <Stack direction="row" spacing=".6rem" alignItems="center">
                        <Typography sx={{ fontWeight: "fontWeightBold", textTransform: "uppercase" }}>Next refresh in:</Typography>
                        {timeLeft}
                        <Box flex={1} />
                        <IconButton
                            sx={{
                                borderRadius: ".5rem",
                            }}
                            onClick={() => refetchSaleAbilities()}
                        >
                            <SvgRefresh size="1.6rem" />
                        </IconButton>
                    </Stack>
                    {purchaseError && (
                        <Typography variant="body2" sx={{ color: colors.red }}>
                            {purchaseError}
                        </Typography>
                    )}
                    {availabilityError && (
                        <Typography variant="body2" sx={{ color: colors.red }}>
                            {availabilityError}
                        </Typography>
                    )}
                </Stack>

                {!isLoaded && (
                    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                            <CircularProgress size="3rem" sx={{ color: primaryColor }} />
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
                        {saleAbilities.map((s, index) => (
                            <QuickPlayerAbilitiesItem
                                key={`${s.id}-${index}`}
                                saleAbility={s}
                                price={priceMap.get(s.id)}
                                amount={ownedAbilities.get(s.blueprint_id)}
                                setError={setPurchaseError}
                                onClaim={() => setAvailability(SaleAbilityAvailability.CanPurchase)}
                                onPurchase={() => setAvailability(SaleAbilityAvailability.Unavailable)}
                                availability={availability}
                            />
                        ))}
                    </Box>
                )}

                {isLoaded && saleAbilities && saleAbilities.length <= 0 && (
                    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem" }}>
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
        </Box>
    )
}
