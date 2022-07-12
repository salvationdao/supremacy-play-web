import { Box, Slider, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { FancyButton } from "../.."
import { useDebounce } from "../../../hooks"
import { Section } from "./Section"

export interface SliderRangeFilter {
    label: string
    initialValue: number[]
    onSetValue: (value: number[]) => void
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
    const { label, initialValue, onSetValue } = filter
    const [value, setValue, valueInstant, setValueInstant] = useDebounce<number[]>(initialValue, 700)
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
        if (value[0] === undefined && value[1] === undefined) return null

        return (
            <FancyButton
                clipThingsProps={{
                    clipSize: "8px",
                    opacity: 1,
                    sx: { position: "relative" },
                }}
                sx={{ px: "1.2rem", pt: ".0rem", pb: ".2rem", color: secondaryColor }}
                onClick={() => {
                    setValueInstant(initialValue)
                    calledCallback.current = false
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: secondaryColor,
                        fontWeight: "fontWeightBold",
                        opacity: 0.7,
                    }}
                >
                    RESET FILTER
                </Typography>
            </FancyButton>
        )
    }, [initialValue, secondaryColor, setValueInstant, value])

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor} endComponent={resetButton}>
            <Stack alignItems="center" spacing="2rem" direction="row" sx={{ px: "2rem" }}>
                <ShowValue primaryColor={primaryColor} value={valueInstant[0]} />

                <Box sx={{ flex: 1 }}>
                    <Slider
                        value={valueInstant}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        sx={{ color: primaryColor, ".MuiSlider-thumb": { borderRadius: "6px" } }}
                    />
                </Box>

                <ShowValue primaryColor={primaryColor} value={valueInstant[1]} />
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
