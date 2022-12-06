import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { colors } from "../../../../../../theme/theme"

export interface StatProps {
    icon: React.ReactNode
    label: string
    stat?: {
        displayMultiplier?: number
        value?: string | number
    }
    compareStat?: {
        displayMultiplier?: number
        value?: string | number
    }
    unit?: string
    nonNumeric?: boolean
}

export const Stat = ({ icon, label, stat, compareStat, unit, nonNumeric }: StatProps) => {
    const color = useMemo(() => {
        let color = "white"
        if ((compareStat?.value || compareStat?.displayMultiplier) && !nonNumeric) {
            if (stat?.value !== compareStat.value || stat?.displayMultiplier !== compareStat.displayMultiplier) {
                let rawStat = 0
                let rawCompareStat = 0
                if (typeof stat?.value === "string") {
                    rawStat = parseFloat(stat.value)
                } else {
                    rawStat = stat?.value || 0
                }
                if (typeof compareStat.value === "string") {
                    rawCompareStat = parseFloat(compareStat.value)
                } else {
                    rawCompareStat = compareStat.value || 0
                }

                if (stat?.displayMultiplier) {
                    rawStat *= stat.displayMultiplier
                }
                if (compareStat?.displayMultiplier) {
                    rawCompareStat *= compareStat.displayMultiplier
                }

                const difference = rawStat - rawCompareStat
                if (difference > 0) {
                    color = colors.green
                } else if (difference < 0) {
                    color = colors.red
                }
            }
        }

        return color
    }, [compareStat, nonNumeric, stat?.displayMultiplier, stat?.value])

    return (
        <Stack direction="row">
            {icon}
            <Typography ml=".5rem" textTransform="uppercase">
                {label}
            </Typography>
            <Typography ml="auto">
                {compareStat?.value && (
                    <>
                        <Box component="span" ml=".5rem">
                            {compareStat.value}
                            {compareStat.displayMultiplier && ` × ${compareStat.displayMultiplier}`}
                            {unit}
                        </Box>
                        <Box component="span" ml=".5rem">
                            →
                        </Box>
                    </>
                )}
                {stat?.value ? (
                    <Box component="span" ml=".5rem" color={color} fontWeight="fontWeightBold">
                        {stat.value}
                        {stat.displayMultiplier && ` × ${stat.displayMultiplier}`}
                        {unit}
                    </Box>
                ) : (
                    <Box component="span" ml=".5rem" color={colors.darkGrey} fontStyle="italic">
                        none
                    </Box>
                )}
            </Typography>
        </Stack>
    )
}
