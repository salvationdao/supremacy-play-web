import { Slider, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef } from "react"
import { useTheme } from "../../../containers/theme"
import { clamp } from "../../../helpers"
import { useDebounce } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { NiceTextField } from "../Nice/NiceTextField"
import { Section } from "./Section"

interface FreqGraph {
    min: number
    max: number
    maxFreq: number
    freq: { [value: number]: number }
}

export interface RangeFilterProps {
    label: string
    initialExpanded?: boolean
    values: number[] | undefined
    setValues: React.Dispatch<React.SetStateAction<number[] | undefined>>
    numberFreq: number[]
}

const propsAreEqual = (prevProps: RangeFilterProps, nextProps: RangeFilterProps) => {
    return (
        prevProps.label === nextProps.label &&
        prevProps.initialExpanded === nextProps.initialExpanded &&
        prevProps.values?.length === nextProps.values?.length &&
        prevProps.setValues === nextProps.setValues &&
        prevProps.numberFreq.length === nextProps.numberFreq.length
    )
}

export const RangeFilterSection = React.memo(function RangeFilterSection(props: RangeFilterProps) {
    const freqGraph = useMemo(() => {
        let min = 0
        let max = 0
        const freq: { [value: number]: number } = {}
        props.numberFreq.forEach((num) => {
            if (num < min) min = num
            if (num > max) max = num
            freq[num] = (freq[num] || 0) + 1
        })
        const maxFreq = Object.values(freq).reduce((acc, f) => (f > acc ? f : acc), 0)

        return { min, max, freq, maxFreq }
    }, [props.numberFreq])

    if (freqGraph.max - freqGraph.min <= 0) return null
    return <RangeFilterSectionInner {...props} freqGraph={freqGraph} minMax={[freqGraph.min, freqGraph.max]} />
}, propsAreEqual)

interface RangeFilterSectionInnerProps extends RangeFilterProps {
    minMax: number[]
    freqGraph: FreqGraph
}

const MAX_HISTOGRAM_BARS = 30

const RangeFilterSectionInner = React.memo(function RangeFilterSectionInner({
    label,
    minMax,
    values,
    setValues,
    initialExpanded,
    freqGraph,
}: RangeFilterSectionInnerProps) {
    const theme = useTheme()
    const [value, setValue, valueInstant, setValueInstant] = useDebounce<number[] | undefined>(values || minMax, 300)
    const calledCallback = useRef(true)

    // Update parent
    useEffect(() => {
        if (calledCallback.current) return
        setValues(value)
        calledCallback.current = true
    }, [setValues, value])

    // Parent can update us
    useEffect(() => {
        setValue(values)
        setValueInstant(values)
    }, [setValue, setValueInstant, values])

    const handleChange = (_: Event, newValue: number | number[]) => {
        setValue(newValue as number[])
        calledCallback.current = false
    }

    return (
        <Section label={label} initialExpanded={initialExpanded}>
            <Stack sx={{ px: "1.6rem", pb: "1.8rem" }} spacing=".6rem">
                <Stack sx={{ px: ".8rem" }}>
                    <HistogramGraph range={minMax[1] - minMax[0]} primaryColor={theme.factionTheme.primary} freqGraph={freqGraph} values={value} />

                    <Slider
                        defaultValue={minMax}
                        value={valueInstant || minMax}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        min={minMax[0]}
                        max={minMax[1]}
                        step={Math.max(1, (minMax[1] - minMax[0]) / MAX_HISTOGRAM_BARS)}
                    />
                </Stack>

                {/* User inputs */}
                <Stack direction="row" alignItems="center" spacing="1rem">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={valueInstant ? Math.round(100 * valueInstant[0]) / 100 : minMax[0]}
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
                        value={valueInstant ? Math.round(100 * valueInstant[1]) / 100 : minMax[1]}
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
    freqGraph: FreqGraph
    values: number[] | undefined
}) {
    const numColumns = useMemo(() => clamp(0, range, MAX_HISTOGRAM_BARS), [range])

    const highlightThresholds = useMemo(() => {
        const loThreshold = !values ? 0 : Math.round(((values[0] - freqGraph.min) / freqGraph.max) * numColumns)
        const hiThreshold = !values ? numColumns : Math.round(((values[1] - freqGraph.min) / freqGraph.max) * numColumns)
        return [loThreshold, hiThreshold]
    }, [freqGraph.max, freqGraph.min, numColumns, values])

    const heights = useMemo(() => {
        const step = range / numColumns

        const d: number[] = new Array(numColumns).fill(0).map((_, index) => {
            let val = 0

            const loThreshold = index * step
            const hiThreshold = (index + 1) * step

            Object.entries(freqGraph.freq).forEach(([index, value]) => {
                const i = parseInt(index)

                // Skip, if index is NAN
                if (isNaN(i)) return

                // Stack value if the index is within the range
                if (i >= loThreshold && i <= hiThreshold) val += value
            })

            return val
        })

        return d
    }, [freqGraph.freq, numColumns, range])

    const maxHeight = useMemo(() => Math.max(...heights), [heights])

    return (
        <Stack direction="row" alignItems="flex-end" sx={{ mb: "-1.6rem", height: "4rem", px: "1px", zIndex: -1 }}>
            {new Array(numColumns).fill(0).map((_, index) => {
                const proportion = index
                const isHighlighted = proportion >= highlightThresholds[0] && proportion <= highlightThresholds[1]
                return (
                    <div
                        key={index}
                        style={{
                            flex: 1,
                            height: `${Math.min(100, (100 * heights[index]) / maxHeight || 0)}%`,
                            backgroundColor: primaryColor,
                            boxShadow: "inset 1px 1px 2px #00000080",
                            opacity: isHighlighted ? 1 : 0.3,
                        }}
                    />
                )
            })}
        </Stack>
    )
})
