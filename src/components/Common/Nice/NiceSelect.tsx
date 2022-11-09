import { MenuItem, Select, Stack, SxProps, Typography } from "@mui/material"
import { colors } from "../../../theme/theme"

export const NiceSelect = ({
    label,
    primaryColor: _primaryColor,
    secondaryColor: _secondaryColor,
    selected,
    onSelected,
    options,
    sx,
}: {
    label?: string
    primaryColor?: string
    secondaryColor?: string
    selected: string
    onSelected: (value: string) => void
    options: {
        label: string
        value: string
    }[]
    sx?: SxProps
}) => {
    const primaryColor = _primaryColor || "#FFFFFF"
    const secondaryColor = _secondaryColor || "#000000"

    return (
        <Stack direction="row" alignItems="center" sx={{ backgroundColor: "#FFFFFF15", boxShadow: 0.5, ...sx }}>
            {label && (
                <Typography sx={{ lineHeight: 1.75, height: "3.3rem", border: `${"#FFFFFF"}50 1px solid`, borderRight: "none", px: "1rem" }}>
                    {label}
                </Typography>
            )}

            <Select
                sx={{
                    flex: 1,
                    p: ".1rem .8rem",
                    border: `${"#FFFFFF"}50 1px solid`,
                    borderRadius: 0,
                    height: "3.3rem",

                    ".MuiSvgIcon-root": {
                        transition: "none",
                    },

                    ".MuiTypography-root": {
                        px: ".1rem",
                        py: ".2rem",
                    },

                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                    },

                    "&:hover": {
                        backgroundColor: `${primaryColor}15`,
                        border: `${primaryColor} 2px solid !important`,
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
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0,

                            ".MuiList-root": {
                                py: 0,
                            },
                        },
                    },
                }}
            >
                {options.map((x, i) => {
                    return (
                        <MenuItem
                            key={x.value + i}
                            value={x.value}
                            onClick={() => {
                                onSelected(x.value)
                            }}
                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography>{x.label}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
