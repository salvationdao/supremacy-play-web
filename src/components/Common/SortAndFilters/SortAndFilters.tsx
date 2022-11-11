import { Divider, Stack, SxProps, Typography } from "@mui/material"
import React from "react"
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

    return (
        <NiceBoxThing
            border={{ color: "#FFFFFF38", thickness: "very-lean" }}
            background={{ color: ["#FFFFFF10", "#FFFFFF20"] }}
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
            <Stack divider={<Divider />}>
                {/* Heading */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: "1.2rem 2rem", pr: "1rem" }}>
                    <Typography fontFamily={fonts.nostromoBlack}>FILTERS</Typography>
                    <NiceButton
                        border={{ color: theme.factionTheme.primary }}
                        background={{ color: [theme.factionTheme.primary] }}
                        sx={{
                            p: ".4rem 1rem",
                        }}
                    >
                        <SvgClose2 inline /> Clear Filters
                    </NiceButton>
                </Stack>

                {!!chipFilters && chipFilters.length > 0 && chipFilters.map((f, i) => <ChipFilterSection key={i} {...f} />)}

                {!!rangeFilters && rangeFilters.length > 0 && rangeFilters.map((f, i) => <RangeFilterSection key={i} {...f} />)}
            </Stack>
        </NiceBoxThing>
    )
})
