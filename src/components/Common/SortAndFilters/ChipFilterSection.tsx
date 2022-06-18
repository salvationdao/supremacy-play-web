import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo } from "react"
import { FancyButton } from "../.."
import { useDebounce } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { Section } from "./Section"

export interface ChipFilter {
    label: string
    options: {
        label: string
        value: string
        color: string
        textColor?: string
    }[]
    initialSelected: string[]
    onSetSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export const ChipFilterSection = ({
    filter,
    primaryColor,
    secondaryColor,
    changePage,
}: {
    filter: ChipFilter
    primaryColor: string
    secondaryColor: string
    changePage: (page: number) => void
}) => {
    const { label, options, initialSelected, onSetSelected } = filter
    const [selectedOptions, setSelectedOptions, selectedOptionsInstant, setSelectedOptionsInstant] = useDebounce<string[]>(initialSelected, 700)

    // Set the value on the parent
    useEffect(() => {
        onSetSelected((prev) => {
            if (prev !== selectedOptions) changePage(1)
            return selectedOptions
        })
    }, [changePage, onSetSelected, selectedOptions])

    const onSelect = useCallback(
        (option: string) => {
            setSelectedOptions((prev) => (prev.includes(option) ? prev.filter((r) => r !== option) : prev.concat(option)))
        },
        [setSelectedOptions],
    )

    const resetButton = useMemo(() => {
        if (selectedOptions.length <= 0) return null

        return (
            <FancyButton
                clipThingsProps={{
                    clipSize: "7px",
                    opacity: 1,
                    sx: { position: "relative" },
                }}
                sx={{ px: "1.2rem", pt: ".0rem", pb: ".2rem", color: secondaryColor }}
                onClick={() => setSelectedOptionsInstant([])}
            >
                <Typography
                    variant="caption"
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
    }, [secondaryColor, selectedOptions.length, setSelectedOptionsInstant])

    if (!options || options.length <= 0) return null

    return (
        <Section label={label} primaryColor={primaryColor} secondaryColor={secondaryColor} endComponent={resetButton}>
            <Stack direction="row" flexWrap="wrap">
                {options.map((o, i) => {
                    const { label, value, color, textColor } = o
                    const isSelected = selectedOptionsInstant.includes(value)
                    return (
                        <Box key={i} sx={{ p: ".4rem" }}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: isSelected ? color : "#000000",
                                    opacity: isSelected ? 1 : 0.6,
                                    border: { borderColor: color, borderThickness: "1px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1rem", py: ".2rem", color: isSelected ? "#FFFFFF" : color }}
                                onClick={() => onSelect(value)}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isSelected ? textColor || "#FFFFFF" : color,
                                        fontFamily: fonts.nostromoBold,
                                    }}
                                >
                                    {label}
                                </Typography>
                            </FancyButton>
                        </Box>
                    )
                })}
            </Stack>
        </Section>
    )
}
