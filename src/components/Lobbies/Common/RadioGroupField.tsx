import { useTheme } from "../../../containers/theme"
import React, { ReactNode, useMemo } from "react"
import { Radio, Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"

interface RadioGroupFieldProps {
    label?: string
    options: RadioOption[]
    value: string
    onChange: (v: string) => void
}

interface RadioOption {
    id: string
    label: ReactNode
}

export const RadioGroupField = ({ label, options, value, onChange }: RadioGroupFieldProps) => {
    const { factionTheme } = useTheme()
    const title = useMemo(() => {
        if (typeof label === "string") {
            return (
                <Typography variant="body2" sx={{ color: factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
            )
        }
        return label
    }, [factionTheme.primary, label])

    return (
        <Stack sx={{ width: "100%" }}>
            {title}
            {options.map((o) => {
                const displayLabel = () => {
                    if (typeof o.label === "string")
                        return (
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBlack}>
                                {o.label}
                            </Typography>
                        )
                    return o.label
                }

                return (
                    <Stack
                        key={o.id}
                        direction="row"
                        alignItems="center"
                        onClick={() => onChange(o.id)}
                        sx={{ cursor: "pointer", width: "100%", height: "4rem" }}
                    >
                        <Radio
                            checked={value === o.id}
                            value={o.id}
                            sx={{
                                ".MuiSvgIcon-root": {
                                    color: factionTheme.primary,
                                },
                            }}
                        />
                        {displayLabel()}
                    </Stack>
                )
            })}
        </Stack>
    )
}
