import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { colors } from "../../../theme/theme"
import { TypographyTruncated } from "../TypographyTruncated"

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
    invertComparison?: boolean
}

export const Stat = ({ icon, label, stat, compareStat, unit, nonNumeric, invertComparison }: StatProps) => {
    const [color, difference] = useMemo(() => {
        let color = "white"
        let difference = 0
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

                difference = rawStat - rawCompareStat
                if (difference > 0) {
                    color = invertComparison ? colors.red : colors.green
                } else if (difference < 0) {
                    color = invertComparison ? colors.green : colors.red
                }
            }
        }

        return [color, difference]
    }, [compareStat?.displayMultiplier, compareStat?.value, invertComparison, nonNumeric, stat?.displayMultiplier, stat?.value])

    return (
        <Stack direction="row">
            {icon}
            <Typography ml="1rem" textTransform="uppercase">
                {label}
            </Typography>
            <TypographyTruncated
                sx={{
                    ml: "auto",
                }}
            >
                {typeof compareStat?.value !== "undefined" && difference !== 0 && (
                    <>
                        <Box component="span" ml=".5rem">
                            {compareStat.value}
                            {compareStat.displayMultiplier && ` × ${compareStat.displayMultiplier}`}
                        </Box>
                        {unit && (
                            <Box component="span" ml=".5rem" fontSize="1.6rem">
                                {unit}
                            </Box>
                        )}
                        <Box component="span" ml=".5rem">
                            →
                        </Box>
                    </>
                )}
                {typeof stat?.value !== "undefined" ? (
                    <>
                        <Box component="span" ml=".5rem" color={color} fontWeight="fontWeightBold">
                            {stat.value}
                            {stat.displayMultiplier && ` × ${stat.displayMultiplier}`}
                        </Box>
                        {unit && (
                            <Box component="span" ml=".5rem" fontSize="1.6rem">
                                {unit}
                            </Box>
                        )}
                    </>
                ) : (
                    <Box component="span" ml=".5rem" color={colors.darkGrey} fontStyle="italic">
                        none
                    </Box>
                )}
            </TypographyTruncated>
        </Stack>
    )
}
