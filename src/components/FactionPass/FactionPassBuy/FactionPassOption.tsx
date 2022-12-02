import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
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
import { FactionIDs } from "../../../constants"
import { supFormatter } from "../../../helpers"
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
    const [buyModalPaymentType, setBuyModalPaymentType] = useState<PaymentType>()

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

                    <NiceButton buttonColor={colors.gold} onClick={() => setBuyModalPaymentType(PaymentType.SUPS)} sx={{ width: "9rem", p: "0 1rem" }}>
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

                        <NiceButton buttonColor={colors.blue2} onClick={() => setBuyModalPaymentType(PaymentType.Stripe)} sx={{ width: "9rem", p: "0 1rem" }}>
                            <Typography fontWeight="bold">
                                <SvgCreditCard size="1.6rem" inline /> ${factionPass ? factionPass.usd_price : "---"}
                            </Typography>
                        </NiceButton>
                    </Stack>
                )}
            </NiceBoxThing>

            {buyModalPaymentType && (
                <FactionPassBuyModal onClose={() => setBuyModalPaymentType(undefined)} factionPass={factionPass} paymentType={buyModalPaymentType} />
            )}
        </Box>
    )
})
