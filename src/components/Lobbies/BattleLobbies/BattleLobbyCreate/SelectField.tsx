import { MenuItem, Select, SelectProps, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import React, { useMemo } from "react"
import { colors, fonts } from "../../../../theme/theme"

interface SelectFieldProps {
    options: SelectOption[]
}

interface SelectOption {
    id: string
    label: string
}

export const SelectField = ({ options, label, ...props }: SelectFieldProps & SelectProps) => {
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
        <Stack spacing=".5rem">
            {title}
            <Select
                {...props}
                sx={{
                    width: "100%",
                    borderRadius: 0.5,
                    border: `${factionTheme.primary}99 2px dashed`,
                    backgroundColor: "#00000090",
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    ".MuiTypography-root": {
                        px: "2.4rem",
                        py: ".6rem",
                        fontSize: "1.7rem",
                        height: "unset",
                        "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                        },
                    },

                    "& .MuiSelect-outlined": {
                        p: 0,
                        height: "4rem",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                    },
                }}
                displayEmpty
                MenuProps={{
                    variant: "menu",
                    sx: {
                        py: 0,
                        "&& .Mui-selected": {
                            ".MuiTypography-root": {
                                color: "#FFFFFF",
                            },
                            backgroundColor: factionTheme.primary,
                        },
                    },
                    PaperProps: {
                        sx: {
                            border: `${factionTheme.primary}99 2px solid`,
                            borderRadius: 0.8,
                            ".MuiList-root": {
                                py: 0,
                                backgroundColor: factionTheme.background,
                                ".MuiMenuItem-root": {
                                    "&:hover": {
                                        backgroundColor: `${factionTheme.primary}99`,
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                {options.map((x, i) => {
                    return (
                        <MenuItem key={`${x.id} ${i}`} value={x.id} sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}>
                            <Typography textTransform="uppercase">{x.label}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
