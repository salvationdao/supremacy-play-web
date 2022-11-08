import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { SvgAnnualPass, SvgDailyPass, SvgMonthlyPass } from "../../assets"
import { supFormatter } from "../../helpers"
import { fonts } from "../../theme/theme"
import { Faction } from "../../types"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"
import { DAYS_IN_A_MONTH } from "./FactionPassBuy"

interface OptionPrices {
    sups: string
    eth: number
    fiat: number
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

    const { priceLabel, SvgHeader } = useMemo(() => {
        let priceLabel = `${days} DAY PRICE`
        let SvgHeader = SvgDailyPass

        if (days <= 3) {
            priceLabel = `${days * 24} HOUR`
            SvgHeader = SvgDailyPass
        } else if (days < 365) {
            const months = Math.floor(days / DAYS_IN_A_MONTH)
            priceLabel = months > 1 ? `${months} MONTHLY` : "MONTHLY"
            SvgHeader = SvgMonthlyPass
        } else {
            const years = Math.floor(days / 365)
            priceLabel = years > 1 ? `${years} YEARLY` : "YEARLY"
            SvgHeader = SvgAnnualPass
        }

        return { priceLabel, SvgHeader }
    }, [days])

    return (
        <Box sx={{ flex: 1, p: ".6rem" }}>
            <SvgHeader />
            <NiceBoxThing border={{ color: faction.primary_color }}>
                <Stack sx={{ p: ".6rem 1.5rem", borderBottom: `${faction.primary_color}40 1px solid` }}>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>{priceLabel} PRICE</Typography>
                </Stack>
                <Stack justifyContent="space-between" sx={{ p: ".6rem 1.5rem", borderBottom: `${faction.primary_color}40 1px solid` }}>
                    <Typography>SUPS</Typography>
                    <Typography>{prices ? supFormatter(prices.sups, 3) : "---"}</Typography>
                </Stack>
            </NiceBoxThing>
        </Box>
    )
})
