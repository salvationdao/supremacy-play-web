import { InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo } from "react"
import { FancyButton } from "../.."
import { SvgSupToken } from "../../../assets"
import { useDebounce } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { Section } from "./Section"

export interface RangeFilter {
    label: string
    initialValue: (number | undefined)[]
    onSetValue: (value: (number | undefined)[]) => void
}

export const RangeFilterSection = ({ filter, primaryColor, secondaryColor }: { filter: RangeFilter; primaryColor: string; secondaryColor: string }) => {
    const { label, initialValue, onSetValue } = filter
    const [value, setValue, valueInstant, setValueInstant] = useDebounce<(number | undefined)[]>(initialValue, 700)

    // Set the value on the parent
    useEffect(() => {
        if (value === valueInstant) return
        onSetValue(value)
        // Need to skip lint or else theres no point in debounce.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSetValue, value])

    const handleChange = useCallback(
        (newValue: number, index: number) => {
            setValue((prev) => {
                const newArray = [...prev]
                newArray[index] = newValue ? newValue : undefined
                return newArray
            })
        },
        [setValue],
    )

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
                onClick={() => setValueInstant([undefined, undefined])}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: secondaryColor,
                        fontFamily: fonts.nostromoBlack,
                        opacity: 0.7,
                    }}
                >
                    RESET FILTER
                </Typography>
            </FancyButton>
        )
    }, [secondaryColor, setValueInstant, value])

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor} endComponent={resetButton}>
            <Stack direction="row" spacing="1rem" alignItems="center" sx={{ px: ".4rem" }}>
                <NumberInput value={valueInstant[0]} setValue={(newValue: number) => handleChange(newValue, 0)} primaryColor={primaryColor} />
                <Typography>TO</Typography>
                <NumberInput value={valueInstant[1]} setValue={(newValue: number) => handleChange(newValue, 1)} primaryColor={primaryColor} />
            </Stack>
        </Section>
    )
}

const NumberInput = ({ value, setValue, primaryColor }: { value: number | undefined; setValue: (newValue: number) => void; primaryColor: string }) => {
    return (
        <TextField
            variant="outlined"
            hiddenLabel
            placeholder="ANY"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SvgSupToken fill={colors.yellow} size="1.9rem" />
                    </InputAdornment>
                ),
            }}
            sx={{
                backgroundColor: "#00000090",
                ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${primaryColor}99 2px dashed` },
                ".MuiOutlinedInput-input": {
                    px: "1.5rem",
                    py: ".6rem",
                    fontSize: "1.7rem",
                    height: "unset",
                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                        "-webkit-appearance": "none",
                    },
                },
                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
            }}
            type="number"
            value={value || ""}
            onChange={(e) => {
                const value = parseInt(e.target.value)
                setValue(value)
            }}
        />
    )
}
