import { Slider, Stack } from "@mui/material"
import React, { useCallback } from "react"
import { debounce } from "ts-debounce"
import { Section } from "./Section"

export interface RangeFilterProps {
    label: string
    initialExpanded?: boolean
    minMax: number[]
    values: number[] | undefined
    setValues: React.Dispatch<React.SetStateAction<number[] | undefined>>
}

export const RangeFilterSection = React.memo(function RangeFilterSection({ label, minMax, values, setValues, initialExpanded }: RangeFilterProps) {
    // Debounce it
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setParentValues = useCallback(
        debounce((newValues: number[]) => {
            setValues(newValues as number[])
        }, 300),
        [],
    )

    return (
        <Section label={label} initialExpanded={initialExpanded}>
            <Stack sx={{ px: "1.6rem", pb: ".8rem" }}>
                <Slider
                    defaultValue={values || minMax}
                    onChange={(_, newValues: number | number[]) => setParentValues(newValues as number[])}
                    valueLabelDisplay="auto"
                    min={minMax[0]}
                    max={minMax[1]}
                />
            </Stack>
        </Section>
    )
})
