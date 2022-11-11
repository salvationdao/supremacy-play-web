import { Box, Slider, Stack, Typography } from "@mui/material"
import React, { useEffect, useRef } from "react"
import { useTheme } from "../../../containers/theme"
import { useDebounce } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { NiceTextField } from "../Nice/NiceTextField"
import { Section } from "./Section"

export interface FreqGraphProps {
    min: number
    max: number
    count: number
    freq: { [value: number]: number }
}

export interface RangeFilterProps {
    label: string
    initialExpanded?: boolean
    minMax: number[]
    values: number[] | undefined
    setValues: React.Dispatch<React.SetStateAction<number[] | undefined>>
    freqGraph: FreqGraphProps
}

export const RangeFilterSection = React.memo(function RangeFilterSection(props: RangeFilterProps) {
    if (props.freqGraph.count <= 0) return null
    return <RangeFilterSectionInner {...props} />
})

const RangeFilterSectionInner = React.memo(function RangeFilterSectionInner({
    label,
    minMax,
    values,
    setValues,
    initialExpanded,
    freqGraph,
}: RangeFilterProps) {
    const theme = useTheme()
    const [value, setValue, valueInstant] = useDebounce<number[] | undefined>(values || minMax, 300)
    const calledCallback = useRef(true)

    useEffect(() => {
        if (calledCallback.current) return
        setValues(value)
        calledCallback.current = true
    }, [setValues, value])

    const handleChange = (_: Event, newValue: number | number[]) => {
        setValue(newValue as number[])
        calledCallback.current = false
    }

    return (
        <Section label={label} initialExpanded={initialExpanded}>
            <Stack sx={{ px: "1.6rem", pb: "1.5rem" }} spacing=".6rem">
                <Stack>
                    <HistogramGraph range={minMax[1] - minMax[0]} primaryColor={theme.factionTheme.primary} freqGraph={freqGraph} values={values} />

                    <Slider
                        defaultValue={minMax}
                        value={valueInstant || minMax}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        min={minMax[0]}
                        max={minMax[1]}
                    />
                </Stack>

                {/* User inputs */}
                <Stack direction="row" alignItems="center" spacing="1rem">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={valueInstant ? valueInstant[0] : minMax[0]}
                        onChange={(value) => {
                            setValue([value, valueInstant ? valueInstant[1] : minMax[1]])
                        }}
                        placeholder="Min"
                        sx={{ ".MuiInputBase-root": { backgroundColor: colors.darkNavy } }}
                    />

                    {/* Dash line */}
                    <Typography variant="body2" fontFamily={fonts.nostromoBold}>
                        -
                    </Typography>

                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={valueInstant ? valueInstant[1] : minMax[1]}
                        onChange={(value) => {
                            setValue([valueInstant ? valueInstant[0] : minMax[0], value])
                        }}
                        placeholder="Max"
                        sx={{ ".MuiInputBase-root": { backgroundColor: colors.darkNavy } }}
                    />
                </Stack>
            </Stack>
        </Section>
    )
})

const HistogramGraph = React.memo(function HistogramGraph({
    range,
    primaryColor,
    freqGraph,
    values,
}: {
    range: number
    primaryColor: string
    freqGraph: FreqGraphProps
    values: number[] | undefined
}) {
    return (
        <Stack direction="row" alignItems="flex-end" sx={{ mb: "-1.6rem", height: "3rem", zIndex: -1 }}>
            {new Array(Math.max(range, 0)).fill(0).map((_, index) => {
                return (
                    <Box
                        key={index}
                        sx={{
                            flex: 1,
                            height: `${Math.min(100, (100 * freqGraph.freq[index + 1]) / freqGraph.count || 0)}%`,
                            background: `linear-gradient(90deg, ${primaryColor}BB, ${primaryColor})`,
                            opacity: !values || (values[0] <= index && index <= values[1]) ? 1 : 0.4,
                        }}
                    />
                )
            })}
        </Stack>
    )
})
