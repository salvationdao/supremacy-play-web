import { Slider, Stack, Typography } from "@mui/material"
import React, { useEffect } from "react"
import { useTheme } from "../../../containers/theme"
import { useDebounce } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { NiceTextField } from "../Nice/NiceTextField"
import { Section } from "./Section"

export interface RangeFilterProps {
    label: string
    initialExpanded?: boolean
    minMax: number[]
    values: number[] | undefined
    setValues: React.Dispatch<React.SetStateAction<number[] | undefined>>
}

export const RangeFilterSection = React.memo(function RangeFilterSection({ label, minMax, values, setValues, initialExpanded }: RangeFilterProps) {
    const theme = useTheme()
    const [value, setValue, valueInstant] = useDebounce<number[] | undefined>(values || minMax, 300)

    useEffect(() => {
        setValues(value)
    }, [setValues, value])

    return (
        <Section label={label} initialExpanded={initialExpanded}>
            <Stack sx={{ px: "1.6rem", pb: ".8rem" }} spacing=".8rem">
                <Slider
                    value={valueInstant || minMax}
                    onChange={(_, newValues: number | number[]) => setValue(newValues as number[])}
                    valueLabelDisplay="auto"
                    min={minMax[0]}
                    max={minMax[1]}
                />

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
