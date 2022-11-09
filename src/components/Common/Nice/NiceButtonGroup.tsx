import { IconButton, Stack, SxProps, Typography } from "@mui/material"
import { ReactNode } from "react"
import { fonts } from "../../../theme/theme"

export const NiceButtonGroup = <T,>({
    primaryColor: _primaryColor,
    secondaryColor: _secondaryColor,
    selected,
    onSelected,
    options,
    sx,
}: {
    primaryColor?: string
    secondaryColor?: string
    selected: T
    onSelected: (value: T) => void
    options: {
        label: string
        value: T
        svg?: ReactNode
    }[]
    sx?: SxProps
}) => {
    const primaryColor = _primaryColor || "#FFFFFF"
    const secondaryColor = _secondaryColor || "#000000"

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                border: `${"#FFFFFF"}50 1px solid`,
                height: "3.3rem",
                ...sx,
            }}
        >
            {options.map((option, i) => {
                const isActive = option.value === selected
                return (
                    <IconButton
                        key={`${option.value}-${i}`}
                        sx={{
                            height: "100%",
                            p: ".1rem 1.2rem",
                            minWidth: "3rem",
                            borderRadius: 0,
                            color: isActive ? `${secondaryColor} !important` : "#FFFFFF !important",
                            backgroundColor: isActive ? `${primaryColor} !important` : "#FFFFFF15",

                            "*": {
                                fill: isActive ? `${secondaryColor} !important` : "#FFFFFF !important",
                            },
                        }}
                        size="small"
                        onClick={() => onSelected(option.value)}
                    >
                        <Typography variant="subtitle1" sx={{ lineHeight: 1.5, color: "inherit", fontFamily: fonts.nostromoBold }}>
                            {option.svg}
                            {option.label}
                        </Typography>
                    </IconButton>
                )
            })}
        </Stack>
    )
}
