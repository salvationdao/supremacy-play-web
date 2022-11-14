import { Box, Stack, Typography } from "@mui/material"
import React, { ReactNode } from "react"
import { NiceButton } from "../Nice/NiceButton"
import { Section } from "./Section"

type Option =
    | {
          renderNode?: never
          render: { label: string; color: string }
          value: string
      }
    | {
          renderNode: ReactNode
          render?: never
          value: string
      }

export interface ChipFilterProps {
    label: string
    initialExpanded?: boolean
    options: Option[]
    selected: string[]
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export const ChipFilterSection = React.memo(function ChipFilterSection({ label, options, selected, setSelected, initialExpanded }: ChipFilterProps) {
    return (
        <Section label={label} initialExpanded={initialExpanded}>
            <Stack direction="row" flexWrap="wrap" sx={{ px: "1.6rem", pb: "1.5rem" }}>
                {options.map((o, i) => {
                    const { value, render, renderNode } = o
                    const isSelected = selected.includes(value)
                    return (
                        <Box key={i} sx={{ p: ".6rem" }}>
                            <NiceButton
                                onClick={() => setSelected((prev) => (prev.includes(value) ? prev.filter((r) => r !== value) : prev.concat(value)))}
                                border={{ color: render?.color, thickness: "very-lean" }}
                                sx={{
                                    opacity: isSelected ? 1 : 0.4,
                                    p: ".2rem .8rem",
                                    filter: isSelected ? `drop-shadow(0 0 3px ${render?.color}BB)` : "unset",
                                }}
                            >
                                {renderNode ||
                                    (render ? (
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: render.color }}>
                                            {render.label}
                                        </Typography>
                                    ) : null)}
                            </NiceButton>
                        </Box>
                    )
                })}
            </Stack>
        </Section>
    )
})
