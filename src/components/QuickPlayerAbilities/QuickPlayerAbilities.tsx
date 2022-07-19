import { Box, CircularProgress, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { MoveableResizable } from ".."
import { useAuth, useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { FeatureName, SaleAbility } from "../../types"
import { MoveableResizableConfig } from "../Common/MoveableResizable/MoveableResizableContainer"
import { PageHeader } from "../Common/PageHeader"
import { TimeLeft } from "../Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { QuickPlayerAbilitiesItem } from "./QuickPlayerAbilitiesItem"

export const QuickPlayerAbilities = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { userHasFeature, userID } = useAuth()
    if (!open || !userHasFeature(FeatureName.playerAbility)) return null
    return <QuickPlayerAbilitiesInner onClose={onClose} userID={userID} />
}

const QuickPlayerAbilitiesInner = ({ onClose, userID }: { onClose: () => void; userID: string }) => {
    const { isMobile } = useMobile()
    const theme = useTheme()

    const [isLoaded, setIsLoaded] = useState(false)
    const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null)
    const [saleAbilities, setSaleAbilities] = useState<SaleAbility[]>([])
    const [canPurchase, setCanPurchase] = useState(true)
    const [purchaseError, setPurchaseError] = useState<string>()

    useGameServerSubscription<{
        next_refresh_time: Date | null
        refresh_period_duration_seconds: number
        sale_abilities: SaleAbility[]
    }>(
        {
            URI: "/public/sale_abilities",
            key: GameServerKeys.SaleAbilitiesList,
            ready: !!userID,
        },
        (payload) => {
            if (!payload) return
            const t = new Date()
            t.setSeconds(t.getSeconds() + payload.refresh_period_duration_seconds)
            setNextRefreshTime(payload.next_refresh_time || t)
            setSaleAbilities(payload.sale_abilities)
            if (isLoaded) return
            setIsLoaded(true)
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
            defaultPosX: 9999,
            defaultPosY: 0,
            defaultWidth: 360,
            defaultHeight: 245,
            // Position limits
            minPosX: 0,
            minPosY: 0,
            // Size limits
            minWidth: 360,
            minHeight: 245,
            maxWidth: 360,
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

        return <Typography sx={{ color: colors.lightNeonBlue, fontFamily: fonts.shareTech, textTransform: "uppercase" }}>Less than an hour</Typography>
    }, [nextRefreshTime])

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
                                            {saleAbilities.map((s, index) => (
                                                <QuickPlayerAbilitiesItem
                                                    key={`${s.id}-${index}`}
                                                    saleAbility={s}
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
