import { Divider, Stack, SxProps, Typography } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { SvgClose2 } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceButton } from "../Nice/NiceButton"
import { ChipFilterProps, ChipFilterSection } from "./ChipFilterSection"
import { RangeFilterProps, RangeFilterSection } from "./RangeFilterSection"

interface SortAndFiltersProps {
    open: boolean
    sx?: SxProps
    chipFilters?: ChipFilterProps[]
    rangeFilters?: RangeFilterProps[]
}

export const SortAndFilters = React.memo(function SortAndFilters({ open, chipFilters, rangeFilters, sx }: SortAndFiltersProps) {
    const theme = useTheme()

    const areFiltersApplied = useMemo(() => {
        const chipApplied = chipFilters?.some((f) => f.selected?.length > 0)
        const rangeApplied = rangeFilters?.some((f) => {
            if (!f.values) return false

            let min = 0
            let max = 0
            f.numberFreq.forEach((num) => {
                if (num < min) min = num
                if (num > max) max = num
            })

            return f.values[0] !== min || f.values[1] !== max
        })
        return chipApplied || rangeApplied
    }, [chipFilters, rangeFilters])

    const clearAllFilters = useCallback(() => {
        chipFilters?.forEach((f) => f.setSelected([]))
        rangeFilters?.forEach((f) => f.setValues(undefined))
    }, [chipFilters, rangeFilters])

    return (
        <NiceBoxThing
            border={{ color: "#FFFFFF28", thickness: "very-lean" }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{
                visibility: open ? "visible" : "hidden",
                width: open ? "38rem" : 0,
                opacity: open ? 1 : 0,
                mr: open ? "2.5rem" : 0,
                overflowY: "hidden",
                transition: "all .3s",
                flexShrink: 0,
                ...sx,
            }}
        >
            <Stack divider={<Divider />} sx={{ overflow: "hidden", height: "100%" }}>
                {/* Heading */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: "1.2rem 2rem", pr: "1rem" }}>
                    <Typography fontFamily={fonts.nostromoBlack}>FILTERS</Typography>

                    <NiceButton
                        disabled={!areFiltersApplied}
                        buttonColor={theme.factionTheme.primary}
                        onClick={clearAllFilters}
                        sx={{
                            p: ".3rem 1rem",
                        }}
                    >
                        <SvgClose2 inline /> Clear Filters
                    </NiceButton>
                </Stack>

                <Stack divider={<Divider />} sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                    {!!chipFilters && chipFilters.length > 0 && chipFilters.map((f, i) => <ChipFilterSection key={i} {...f} />)}

                    {!!rangeFilters && rangeFilters.length > 0 && rangeFilters.map((f, i) => <RangeFilterSection key={i} {...f} />)}
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})
