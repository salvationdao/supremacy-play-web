import { SxProps } from "@mui/material"
import React from "react"
import { NiceBoxThing } from "../Nice/NiceBoxThing"

interface SortAndFiltersProps {
    open: boolean
    sx?: SxProps
}

export const SortAndFilters = React.memo(function SortAndFilters({ open, sx }: SortAndFiltersProps) {
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
        ></NiceBoxThing>
    )
})
