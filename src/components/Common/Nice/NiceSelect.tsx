import { MenuItem, Select, Stack, SxProps, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"

export const NiceSelect = ({
    label,
    primaryColor: _primaryColor,
    secondaryColor: _secondaryColor,
    backgroundColor: _backgroundColor,
    selected,
    onSelected,
    options,
    sx,
}: {
    label?: string
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    selected: string
    onSelected: (value: string) => void
    options: {
        label: string
        value: string
    }[]
    sx?: SxProps
}) => {
    const theme = useTheme()

    const primaryColor = _primaryColor || theme.factionTheme.primary
    const secondaryColor = _secondaryColor || theme.factionTheme.text
    const backgroundColor = _backgroundColor || theme.factionTheme.background

    return (
        <Stack direction="row" alignItems="center" sx={{ backgroundColor: "#FFFFFF15", boxShadow: 0.5, ...sx }}>
            {label && (
                <Typography sx={{ lineHeight: 1.75, height: "3.3rem", border: `${"#FFFFFF"}50 1px inset`, borderRight: "none", px: "1rem" }}>
                    {label}
                </Typography>
            )}

            <Select
                sx={{
                    flex: 1,
                    p: ".1rem .8rem",
                    border: `${"#FFFFFF"}50 1px inset`,
                    borderRadius: 0,
                    height: "3.3rem",

                    ".MuiSvgIcon-root": {
                        transition: "none",
                    },

                    ".MuiTypography-root": {
                        px: ".1rem",
                        py: ".1rem",
                    },

                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                    },

                    "&:hover": {
                        backgroundColor: `${primaryColor}15`,
                        border: `${primaryColor} 1px inset !important`,
                    },
                }}
                value={selected}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            ".MuiTypography-root": {
                                color: secondaryColor,
                            },
                            backgroundColor: primaryColor,
                        },
                    },
                    PaperProps: {
                        sx: {
                            border: `#FFFFFF40 1px solid`,
                            backgroundColor: backgroundColor,
                            borderRadius: 0,

                            ".MuiList-root": {
                                py: 0,
                                backgroundColor: "#FFFFFF10",
                            },
                        },
                    },
                }}
            >
                {options.map((option, i) => {
                    return (
                        <MenuItem
                            key={`${option.value}-${i}`}
                            value={option.value}
                            onClick={() => onSelected(option.value)}
                            sx={{ py: ".6rem", "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography>{option.label}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
