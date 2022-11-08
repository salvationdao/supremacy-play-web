import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    BCAnnualPassArrowPNG,
    BCDailyPassArrowPNG,
    BCMonthlyPassArrowPNG,
    RMAnnualPassArrowPNG,
    RMDailyPassArrowPNG,
    RMMonthlyPassArrowPNG,
    SvgWallet,
    ZHIAnnualPassArrowPNG,
    ZHIDailyPassArrowPNG,
    ZHIMonthlyPassArrowPNG,
} from "../../assets"
import { FactionIDs } from "../../constants"
import { supFormatter } from "../../helpers"
import { colors, fonts } from "../../theme/theme"
import { Faction } from "../../types"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"
import { NiceButton } from "../Common/Nice/NiceButton"
import { DAYS_IN_A_MONTH } from "./FactionPassBuy"

interface OptionPrices {
    sups: string
    eth: number
    fiat: number
}

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

export const FactionPassOption = React.memo(function FactionPassOption({ days, faction }: { days: number; faction: Faction }) {
    const [prices, setPrices] = useState<OptionPrices>()

    useEffect(() => {
        setPrices({
            sups: "1000000000000000000001",
            eth: 0.01,
            fiat: 8.2,
        })
    }, [])

    const buyFactionPass = useCallback((days: number) => {
        console.log("TODO", days)
    }, [])

    const { priceLabel, headerArrowImage } = useMemo(() => {
        let priceLabel = `${days} DAY PRICE`
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
    }, [days, faction.id])

    return (
        <Box sx={{ flex: 1, p: ".7rem" }}>
            <Box
                sx={{
                    mb: ".2rem",
                    width: "100%",
                    height: "4rem",
                    background: `url(${headerArrowImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left center",
                    backgroundSize: "contain",
                }}
            />

            <NiceBoxThing border={{ color: faction.primary_color }}>
                <Box sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.primary_color}40 1px solid`, backgroundColor: faction.primary_color }}>
                    <Typography sx={{ color: faction.secondary_color, fontFamily: fonts.nostromoBlack, textAlign: "center" }}>{priceLabel} PRICE</Typography>
                </Box>

                {/* SUPS */}
                <Stack direction="row" justifyContent="space-between" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.primary_color}40 1px solid` }}>
                    <Typography fontWeight="fontWeightBold">
                        SUPS <span style={{ color: colors.red }}>-30% OFF</span>
                    </Typography>
                    <Typography>{prices ? supFormatter(prices.sups, 0) : "---"}</Typography>
                </Stack>

                {/* ETH */}
                <Stack direction="row" justifyContent="space-between" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.primary_color}40 1px solid` }}>
                    <Typography fontWeight="fontWeightBold">ETH</Typography>
                    <Typography>{prices ? prices.eth : "---"}</Typography>
                </Stack>

                {/* Fiat */}
                <Stack direction="row" justifyContent="space-between" sx={{ p: ".8rem 1.5rem", borderBottom: `${faction.primary_color}40 1px solid` }}>
                    <Typography fontWeight="fontWeightBold">FIAT</Typography>
                    <Typography>{prices ? prices.fiat : "---"}</Typography>
                </Stack>

                {/* Buy button */}
                <Box sx={{ p: ".8rem 1.5rem" }}>
                    <NiceButton
                        onClick={() => buyFactionPass(days)}
                        border={{ color: colors.green }}
                        background={{ color: [`${colors.green}CD`] }}
                        sx={{ width: "100%", p: ".4rem 1rem" }}
                    >
                        <Stack spacing=".8rem" direction="row" alignItems="center">
                            <SvgWallet />
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BUY NOW</Typography>
                        </Stack>
                    </NiceButton>
                </Box>
            </NiceBoxThing>
        </Box>
    )
})
