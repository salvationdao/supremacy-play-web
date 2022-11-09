import { MenuItem, Select, SxProps, Typography } from "@mui/material"
import { colors } from "../../../theme/theme"

export const NiceSelect = ({
    primaryColor: _primaryColor,
    secondaryColor: _secondaryColor,
    selected,
    onSelected,
    options,
    sx,
}: {
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
        <Select
            sx={{
                p: ".1rem .8rem",
                border: `${"#FFFFFF"}50 1px solid`,
                borderRadius: 0,
                height: "3.3rem",

                ".MuiSvgIcon-root": {
                    transition: "none",
                },

                "&:hover": {
                    backgroundColor: `${primaryColor}10`,
                    borderColor: `${primaryColor} !important`,
                    borderWidth: "2px",
                },

                ".MuiTypography-root": {
                    px: ".1rem",
                    py: ".2rem",
                },

                "& .MuiSelect-outlined": { px: ".8rem", pt: ".2rem", pb: 0 },
                ".MuiOutlinedInput-notchedOutline": {
                    border: "none !important",
                },
                ...sx,
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
    )
}
