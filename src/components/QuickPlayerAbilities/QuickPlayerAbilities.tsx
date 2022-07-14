import { Box, CircularProgress, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { MoveableResizable } from ".."
import { useAuth, useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useGameServerSubscriptionSecurePublic } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { FeatureName, SaleAbility } from "../../types"
import { MoveableResizableConfig } from "../Common/MoveableResizable/MoveableResizableContainer"
import { PageHeader } from "../Common/PageHeader"
import { TimeLeft } from "../Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { QuickPlayerAbilitiesItem } from "./QuickPlayerAbilitiesItem"

export const QuickPlayerAbilities = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { userHasFeature } = useAuth()
    if (!open || !userHasFeature(FeatureName.playerAbility)) return null
    return <QuickPlayerAbilitiesInner onClose={onClose} />
}

const QuickPlayerAbilitiesInner = ({ onClose }: { onClose: () => void }) => {
    const { isMobile } = useMobile()
    const theme = useTheme()

    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [priceMap, setPriceMap] = useState<Map<string, string>>(new Map())
    const [amountMap, setAmountMap] = useState<Map<string, number>>(new Map())
    const [canPurchase, setCanPurchase] = useState(true)
    const [purchaseError, setPurchaseError] = useState<string>()

    useGameServerSubscriptionSecurePublic<{
        next_refresh_time: Date | null
        refresh_period_duration_seconds: number
        sale_abilities: SaleAbility[]
    }>(
        {
            URI: "sale_abilities",
            key: GameServerKeys.SaleAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            const t = new Date()
            t.setSeconds(t.getSeconds() + payload.refresh_period_duration_seconds)
            setNextRefreshTime(payload.next_refresh_time || t)
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

    useEffect(() => {
        if (!nextRefreshTime) return
        setCanPurchase(true)
        setPurchaseError(undefined)
    }, [nextRefreshTime])

    const primaryColor = theme.factionTheme.primary

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "quickPlayerAbilities1",
            // Defaults
            defaultPosX: 390,
            defaultPosY: 40,
            defaultWidth: 360,
            defaultHeight: 245,
            // Position limits
            minPosX: 0,
            minPosY: 0,
            // Size limits
            minWidth: 360,
            minHeight: 245,
            maxWidth: 500,
            maxHeight: 245,
            // Others
            infoTooltipText: "Quickly view and purchase abilities that are currently on sale",
            onHideCallback: onClose,
        }),
        [onClose],
    )

    const timeLeft = useMemo(() => {
        if (nextRefreshTime) {
            return (
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>
                    <TimeLeft key={nextRefreshTime.getMilliseconds()} dateTo={nextRefreshTime} />
                </Typography>
            )
        }

        if (saleAbilities.length > 0) {
            return (
                <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>
                    <TimeLeft key={saleAbilities[0].available_until?.getMilliseconds()} dateTo={saleAbilities[0].available_until} />
                </Typography>
            )
        }

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>Less than an hour</Typography>
    }, [nextRefreshTime, saleAbilities])

    return (
        <>
            <Fade in>
                <Box
                    sx={{
                        ...(isMobile
                            ? { m: "1rem", mb: "2rem", backgroundColor: "#FFFFFF12", boxShadow: 2, border: "#FFFFFF20 1px solid", height: "100%" }
                            : {}),
                    }}
                >
                    <MoveableResizable config={config}>
                        <Stack
                            sx={{
                                height: "100%",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <PageHeader
                                smallSize
                                title="BUY PLAYER ABILITIES"
                                description={
                                    <Stack>
                                        <Stack direction="row" spacing=".6rem">
                                            <Typography sx={{ fontWeight: "fontWeightBold", textTransform: "uppercase" }}>Next refresh in:</Typography>
                                            {timeLeft}
                                        </Stack>
                                        {purchaseError && (
                                            <Typography variant="body2" sx={{ color: colors.red }}>
                                                {purchaseError}
                                            </Typography>
                                        )}
                                    </Stack>
                                }
                            />

                            {!isLoaded && (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                                    </Stack>
                                </Stack>
                            )}

                            {isLoaded && saleAbilities && saleAbilities.length > 0 && (
                                <Box
                                    sx={{
                                        flex: 1,
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        ml: "1rem",
                                        mr: ".5rem",
                                        pr: ".6rem",
                                        mt: "2rem",
                                        mb: "1rem",
                                        direction: "ltr",
                                        scrollbarWidth: "none",
                                        "::-webkit-scrollbar": {
                                            width: ".4rem",
                                        },
                                        "::-webkit-scrollbar-track": {
                                            background: "#FFFFFF15",
                                            borderRadius: 3,
                                        },
                                        "::-webkit-scrollbar-thumb": {
                                            background: primaryColor,
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <Box sx={{ direction: "ltr", height: 0 }}>
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(3, minmax(0, 100px))",
                                                gridTemplateRows: "repeat(1, fr)",
                                                gap: "1rem",
                                                justifyContent: "center",
                                                px: "2rem",
                                                width: "100%",
                                            }}
                                        >
                                            {saleAbilities.map((s) => (
                                                <QuickPlayerAbilitiesItem
                                                    key={s.id}
                                                    saleAbility={s}
                                                    updatedPrice={priceMap.get(s.id) || s.current_price}
                                                    totalAmount={s.sale_limit}
                                                    amountSold={amountMap.get(s.id) || s.amount_sold}
                                                    setError={setPurchaseError}
                                                    onPurchase={() => setCanPurchase(false)}
                                                    disabled={!canPurchase}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {isLoaded && saleAbilities && saleAbilities.length <= 0 && (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                                        <Typography
                                            variant="body2"
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
                                            NO ABILITIES ARE ON SALE AT THE MOMENT.
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </MoveableResizable>
                </Box>
            </Fade>
        </>
    )
}