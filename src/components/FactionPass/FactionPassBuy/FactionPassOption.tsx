import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import {
    BCAnnualPassArrowPNG,
    BCDailyPassArrowPNG,
    BCMonthlyPassArrowPNG,
    RMAnnualPassArrowPNG,
    RMDailyPassArrowPNG,
    RMMonthlyPassArrowPNG,
    SvgCreditCard,
    SvgSupToken,
    ZHIAnnualPassArrowPNG,
    ZHIDailyPassArrowPNG,
    ZHIMonthlyPassArrowPNG,
} from "../../../assets"
import { DEV_ONLY, FactionIDs } from "../../../constants"
import { supFormatter } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { FactionWithPalette } from "../../../types"
import { FactionPass } from "../../../types/faction_passes"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { FactionPassBuyModal } from "./FactionPassBuyModal"

const headerArrowImages: {
    [factionID: string]: {
        daily: string
        weekly: string
        monthly: string
    }
} = {
    [FactionIDs.BC]: {
        daily: BCDailyPassArrowPNG,
        weekly: BCAnnualPassArrowPNG,
        monthly: BCMonthlyPassArrowPNG,
    },
    [FactionIDs.RM]: {
        daily: RMDailyPassArrowPNG,
        weekly: RMAnnualPassArrowPNG,
        monthly: RMMonthlyPassArrowPNG,
    },
    [FactionIDs.ZHI]: {
        daily: ZHIDailyPassArrowPNG,
        weekly: ZHIAnnualPassArrowPNG,
        monthly: ZHIMonthlyPassArrowPNG,
    },
}

export enum PaymentType {
    SUPS = "sups",
    ETH = "eth",
    Stripe = "stripe",
}

interface FactionPassOptionProps {
    factionPass: FactionPass
    faction: FactionWithPalette
}
export const FactionPassOption = React.memo(function FactionPassOption({ factionPass, faction }: FactionPassOptionProps) {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [openPaymentModal, setOpenPaymentModal] = useState(false)

    const { priceLabel, headerArrowImage } = useMemo(() => {
        const days = factionPass.last_for_days

        const priceLabel = `${factionPass.label}`
        let headerArrowImage = ""

        if (days <= 3) {
            headerArrowImage = headerArrowImages[faction.id]?.daily || ""
        } else if (days <= 7) {
            headerArrowImage = headerArrowImages[faction.id]?.weekly || ""
        } else {
            headerArrowImage = headerArrowImages[faction.id]?.monthly || ""
        }

        return { priceLabel, headerArrowImage }
    }, [factionPass.last_for_days, factionPass.label, faction.id])

    const buyFactionPassWithSups = useCallback(
        async (paymentType: PaymentType) => {
            setIsLoading(true)
            try {
                const resp = await send<boolean>(GameServerKeys.PurchaseFactionPassWithSups, {
                    faction_pass_id: factionPass.id,
                    payment_type: paymentType,
                })
                if (!resp) return

                setError("")
                setOpenPaymentModal(false)
            } catch (e) {
                setError(typeof e === "string" ? e : "Failed to get lookup history.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        },
        [factionPass.id, send],
    )

    return (
        <Box sx={{ flex: 1, p: ".7rem" }}>
            <Box
                sx={{
                    mb: ".5rem",
                    width: "100%",
                    height: "4rem",
                    background: `url(${headerArrowImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left center",
                    backgroundSize: "contain",
                }}
            />

            <NiceBoxThing border={{ color: `${faction.palette.s600}` }} sx={{ boxShadow: 3 }}>
                <Box sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.palette.s600} 1px solid`, backgroundColor: `${faction.palette.s600}` }}>
                    <Typography sx={{ color: faction.palette.text, fontFamily: fonts.nostromoBlack, textAlign: "center" }}>{priceLabel} PRICE</Typography>
                </Box>

                {/* SUPS */}
                <Stack direction="row" alignItems="center" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.palette.s600} 1px solid` }}>
                    <Typography variant="h6" fontWeight="bold">
                        SUPS <i style={{ color: colors.red }}>{factionPass.discount_percentage !== "0" ? `-${factionPass.discount_percentage} % OFF` : ""}</i>
                    </Typography>

                    <Box flex={1} />

                    <NiceButton buttonColor={colors.gold} onClick={() => setOpenPaymentModal(true)} sx={{ width: "9rem", p: "0 1rem" }} loading={isLoading}>
                        <Typography fontWeight="bold">
                            <SvgSupToken fill={colors.gold} size="1.8rem" inline />
                            {factionPass ? supFormatter(factionPass.sups_price, 3) : "---"}
                        </Typography>
                    </NiceButton>
                </Stack>

                {/* Fiat */}
                {Math.round(parseFloat(factionPass.usd_price)) > 0 && (
                    <Stack direction="row" alignItems="center" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.palette.s600} 1px solid` }}>
                        <Typography variant="h6" fontWeight="bold">
                            USD
                        </Typography>

                        <Box flex={1} />

                        <NiceButton
                            buttonColor={colors.blue2}
                            onClick={() => setOpenPaymentModal(true)}
                            sx={{ width: "9rem", p: "0 1rem" }}
                            loading={isLoading}
                        >
                            <Typography fontWeight="bold">
                                <SvgCreditCard size="1.6rem" inline /> ${factionPass ? factionPass.usd_price : "---"}
                            </Typography>
                        </NiceButton>
                    </Stack>
                )}
            </NiceBoxThing>

            {DEV_ONLY && openPaymentModal && (
                <FactionPassBuyModal
                    open={openPaymentModal}
                    factionPass={factionPass}
                    onClose={() => setOpenPaymentModal(false)}
                    onSupPurchaseConfirm={buyFactionPassWithSups}
                    error={error}
                />
            )}
        </Box>
    )
})
