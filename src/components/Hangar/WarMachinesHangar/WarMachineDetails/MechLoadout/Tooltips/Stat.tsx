import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { colors } from "../../../../../../theme/theme"

export interface StatProps {
    icon: React.ReactNode
    label: string
    stat?: string | number
    compareStat?: string | number
    unit?: string
    nonNumeric?: boolean
}

export const Stat = ({ icon, label, stat, compareStat, unit, nonNumeric }: StatProps) => {
    let comparison = <></>
    let color = "white"
    if (typeof compareStat !== "undefined") {
        if (nonNumeric && stat !== compareStat) {
            comparison = <>→ {compareStat}</>
        } else if (stat !== compareStat) {
            let rawStat = 0
            let rawCompareStat = 0
            if (typeof stat === "string") {
                rawStat = parseFloat(stat)
            } else {
                rawStat = stat || 0
            }
            if (typeof compareStat === "string") {
                rawCompareStat = parseFloat(compareStat)
            } else {
                rawCompareStat = compareStat
            }

            const difference = rawCompareStat - rawStat
            if (difference > 0) {
                color = colors.green
                comparison = (
                    <Box component="span" ml=".5rem">
                        (+{difference}
                        {unit})
                    </Box>
                )
            } else if (difference < 0) {
                color = colors.red
                comparison = (
                    <Box component="span" ml=".5rem">
                        ({difference}
                        {unit})
                    </Box>
                )
            }
        }
    }
    return (
        <Stack direction="row">
            {icon}
            <Typography ml=".5rem" textTransform="uppercase">
                {label}
            </Typography>
            <Typography ml="auto" fontWeight="fontWeightBold">
                <Box component="span" color={color}>
                    {stat}
                    {unit}
                </Box>
                {comparison}
            </Typography>
        </Stack>
    )
}
