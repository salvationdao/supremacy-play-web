import { Divider, Stack, SxProps, Typography } from "@mui/material"
import React from "react"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceButton } from "../Nice/NiceButton"

interface SortAndFiltersProps {
    open: boolean
    sx?: SxProps
}

export const SortAndFilters = React.memo(function SortAndFilters({ open, sx }: SortAndFiltersProps) {
    const theme = useTheme()

    return (
        <NiceBoxThing
            border={{ color: "#FFFFFF38", thickness: "very-lean" }}
            background={{ color: ["#FFFFFF10", "#FFFFFF20"] }}
            sx={{
                visibility: open ? "visible" : "hidden",
                width: open ? "38rem" : 0,
                opacity: open ? 1 : 0,
                mr: open ? "2rem" : 0,
                overflowY: "hidden",
                transition: "all .3s",
                ...sx,
            }}
        >
            <Stack divider={<Divider />}>
                {/* Heading */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: "1.2rem 2rem", pr: "1rem" }}>
                    <Typography fontFamily={fonts.nostromoBlack}>FILTERS</Typography>
                    <NiceButton border={{ color: theme.factionTheme.primary }} background={{ color: [theme.factionTheme.primary] }} sx={{ p: ".5rem 1rem" }}>
                        Clear Filters
                    </NiceButton>
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})
