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
    SvgWallet,
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
import { DAYS_IN_A_MONTH } from "./FactionPassBuy"
import { FactionPassBuyModal } from "./FactionPassBuyModal"

const headerArrowImages: {
    [factionID: string]: {
        daily: string
        monthly: string
        yearly: string
    }
} = {
    [FactionIDs.BC]: {
        daily: BCDailyPassArrowPNG,
        monthly: BCMonthlyPassArrowPNG,
        yearly: BCAnnualPassArrowPNG,
    },
    [FactionIDs.RM]: {
        daily: RMDailyPassArrowPNG,
        monthly: RMMonthlyPassArrowPNG,
        yearly: RMAnnualPassArrowPNG,
    },
    [FactionIDs.ZHI]: {
        daily: ZHIDailyPassArrowPNG,
        monthly: ZHIMonthlyPassArrowPNG,
        yearly: ZHIAnnualPassArrowPNG,
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

        let priceLabel = `${factionPass.label} PRICE`
        let headerArrowImage = ""

        if (days <= 3) {
            priceLabel = `${days * 24} HOUR`
            headerArrowImage = headerArrowImages[faction.id]?.daily || ""
        } else if (days < 365) {
            const months = Math.floor(days / DAYS_IN_A_MONTH)
            priceLabel = months > 1 ? `${months} MONTHLY` : "MONTHLY"
            headerArrowImage = headerArrowImages[faction.id]?.monthly || ""
        } else {
            const years = Math.floor(days / 365)
            priceLabel = years > 1 ? `${years} YEARLY` : "YEARLY"
            headerArrowImage = headerArrowImages[faction.id]?.yearly || ""
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
                <Stack direction="row" justifyContent="space-between" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.palette.s600} 1px solid` }}>
                    <Typography fontWeight="bold">
                        SUPS <i style={{ color: colors.red }}>{factionPass.discount_percentage !== "0" ? `-${factionPass.discount_percentage} % OFF` : ""}</i>
                    </Typography>
                    <Typography>
                        <SvgSupToken fill={colors.gold} size="1.8rem" inline />
                        {factionPass ? supFormatter(factionPass.sups_price, 3) : "---"}
                    </Typography>
                </Stack>

                {/* ETH */}
                {/* <Stack direction="row" justifyContent="space-between" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.palette.s600} 1px solid` }}>
                    <Typography fontWeight="bold">ETH</Typography>
                    <Typography>
                        <SvgEthereum size="1.8rem" inline />
                        {factionPass ? supFormatter(factionPass.eth_price_wei, 3) : "---"}
                    </Typography>
                </Stack> */}

                {/* Fiat */}
                <Stack direction="row" justifyContent="space-between" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.palette.s600} 1px solid` }}>
                    <Typography fontWeight="bold">USD</Typography>
                    <Typography>
                        <SvgCreditCard fill={colors.blue} size="1.6rem" inline /> ${factionPass ? factionPass.usd_price : "---"}
                    </Typography>
                </Stack>

                {/* Buy button */}
                <Box sx={{ p: ".8rem 1.5rem" }}>
                    <NiceButton
                        corners
                        buttonColor={colors.green}
                        onClick={() => setOpenPaymentModal(true)}
                        sx={{ width: "100%", p: ".4rem 1rem" }}
                        loading={isLoading}
                        disabled={!DEV_ONLY}
                    >
                        <Stack spacing=".8rem" direction="row" alignItems="center">
                            <SvgWallet />
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BUY NOW</Typography>
                        </Stack>
                    </NiceButton>
                </Box>
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
