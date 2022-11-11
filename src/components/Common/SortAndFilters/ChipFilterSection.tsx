import { Box, Stack, Typography } from "@mui/material"
import React, { ReactNode, useCallback, useEffect, useRef } from "react"
import { useDebounce } from "../../../hooks"
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
    options: Option[]
    initialSelected: string[]
    onSetSelected: (value: string[]) => void
    initialExpanded?: boolean
}

export const ChipFilterSection = React.memo(function ChipFilterSection({ label, options, initialSelected, onSetSelected, initialExpanded }: ChipFilterProps) {
    const [selectedOptions, setSelectedOptions, selectedOptionsInstant] = useDebounce<string[]>(initialSelected, 700)
    const calledCallback = useRef(true)

    // Set the value on the parent
    useEffect(() => {
        if (calledCallback.current) return
        onSetSelected(selectedOptions)
        calledCallback.current = true
    }, [onSetSelected, selectedOptions])

    const onSelect = useCallback(
        (option: string) => {
            setSelectedOptions((prev) => (prev.includes(option) ? prev.filter((r) => r !== option) : prev.concat(option)))
            calledCallback.current = false
        },
        [setSelectedOptions],
    )

    return (
        <Section label={label} initialExpanded={initialExpanded}>
            <Stack direction="row" flexWrap="wrap" sx={{ px: "1.6rem", pb: ".8rem" }}>
                {options.map((o, i) => {
                    const { value, render, renderNode } = o
                    const isSelected = selectedOptionsInstant.includes(value)
                    return (
                        <Box key={i} sx={{ p: ".6rem" }}>
                            {renderNode ||
                                (render ? (
                                    <NiceButton
                                        onClick={() => onSelect(value)}
                                        border={{ color: render.color, thickness: "very-lean" }}
                                        sx={{ opacity: isSelected ? 1 : 0.4, p: ".2rem .8rem" }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: "bold", color: render.color }}>
                                            {render.label}
                                        </Typography>
                                    </NiceButton>
                                ) : null)}
                        </Box>
                    )
                })}
            </Stack>
        </Section>
    )
})
