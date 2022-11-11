import { Slider, Stack, Typography } from "@mui/material"
import React, { useCallback } from "react"
import { debounce } from "ts-debounce"
import { useTheme } from "../../../containers/theme"
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
            <Stack sx={{ px: "1.6rem", pb: ".8rem" }} spacing=".8rem">
                <Slider
                    defaultValue={values || minMax}
                    onChange={(_, newValues: number | number[]) => setParentValues(newValues as number[])}
                    valueLabelDisplay="auto"
                    min={minMax[0]}
                    max={minMax[1]}
                />

                {/* User inputs */}
                <Stack direction="row" alignItems="center" spacing="1rem">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={values ? values[0] : minMax[0]}
                        onChange={(value) => {
                            setParentValues([value, values ? values[1] : minMax[1]])
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
                        value={values ? values[1] : minMax[1]}
                        onChange={(value) => {
                            setParentValues([values ? values[0] : minMax[0], value])
                        }}
                        placeholder="Max"
                    />
                </Stack>
            </Stack>
        </Section>
    )
})
