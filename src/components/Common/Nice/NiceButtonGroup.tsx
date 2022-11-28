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
            spacing="-1px"
            sx={{
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
                            pt: ".1rem",
                            minWidth: "3rem",
                            borderRadius: 0,
                            color: isActive ? `${secondaryColor} !important` : "#FFFFFF !important",
                            border: isActive ? `${primaryColor} 1px solid` : `${"#FFFFFF"}50 1px solid`,
                            background: isActive ? `linear-gradient(180deg, ${primaryColor}90, ${primaryColor}30)` : "#FFFFFF15",
                            zIndex: isActive ? 2 : 1,

                            ...(isActive
                                ? {}
                                : {
                                      ":not(:last-child)": {
                                          borderRight: "none",
                                      },
                                  }),

                            "*": {
                                fill: isActive ? `${secondaryColor} !important` : "#FFFFFF !important",
                            },

                            ":hover": { backgroundColor: `${primaryColor}15` },
                        }}
                        size="small"
                        onClick={() => onSelected(option.value)}
                    >
                        <Typography variant="subtitle1" sx={{ lineHeight: 1.5, color: "inherit", fontFamily: fonts.nostromoBold, pt: ".2rem" }}>
                            {option.svg}
                            {option.label}
                        </Typography>
                    </IconButton>
                )
            })}
        </Stack>
    )
}
