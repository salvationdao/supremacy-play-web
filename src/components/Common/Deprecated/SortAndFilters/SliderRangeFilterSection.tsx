import { Box, Slider, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { FancyButton } from "../../.."
import { useDebounce } from "../../../../hooks"
import { Section } from "./Section"

export interface SliderRangeFilter {
    label: string
    initialValue?: number[]
    minMax: number[]
    onSetValue: (value: number[] | undefined) => void
    initialExpanded?: boolean
}

export const SliderRangeFilterSection = ({
    filter,
    primaryColor,
    secondaryColor,
}: {
    filter: SliderRangeFilter
    primaryColor: string
    secondaryColor: string
}) => {
    const { label, initialValue, minMax, onSetValue, initialExpanded } = filter
    const [value, setValue, valueInstant, setValueInstant] = useDebounce<number[] | undefined>(initialValue, 700)
    const calledCallback = useRef(true)

    // Set the value on the parent
    useEffect(() => {
        if (calledCallback.current) return
        onSetValue(value)
        calledCallback.current = true
    }, [onSetValue, value])

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[])
        calledCallback.current = false
    }

    const resetButton = useMemo(() => {
        if (!value || (value[0] === minMax[0] && value[1] === minMax[1])) return null

        return (
            <FancyButton
                clipThingsProps={{
                    clipSize: "8px",
                    opacity: 1,
                    sx: { position: "relative" },
                }}
                sx={{ px: "1.2rem", pt: ".0rem", pb: ".2rem", color: secondaryColor }}
                onClick={() => {
                    setValueInstant(minMax)
                    calledCallback.current = false
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: secondaryColor,
                        fontWeight: "bold",
                        opacity: 0.7,
                    }}
                >
                    RESET FILTER
                </Typography>
            </FancyButton>
        )
    }, [minMax, secondaryColor, setValueInstant, value])

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor} endComponent={resetButton} initialExpanded={initialExpanded}>
            <Stack alignItems="center" spacing="2rem" direction="row" sx={{ px: "2rem" }}>
                <ShowValue primaryColor={primaryColor} value={valueInstant ? valueInstant[0] : minMax[0]} />

                <Box sx={{ flex: 1 }}>
                    <Slider
                        value={valueInstant || minMax}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        min={minMax[0]}
                        max={minMax[1]}
                        sx={{ color: primaryColor, ".MuiSlider-thumb": { borderRadius: "6px" } }}
                    />
                </Box>

                <ShowValue primaryColor={primaryColor} value={valueInstant ? valueInstant[1] : minMax[1]} />
            </Stack>
        </Section>
    )
}

const ShowValue = ({ primaryColor, value }: { primaryColor: string; value: number }) => {
    return (
        <Box sx={{ p: ".4rem .8rem", backgroundColor: "#00000090", minWidth: "5rem", borderRadius: 0.5, border: `${primaryColor}99 2px dashed` }}>
            <Typography sx={{ textAlign: "center" }}>{value}</Typography>
        </Box>
    )
}
