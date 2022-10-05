import { Box, Slider, SliderProps, Stack, Typography } from "@mui/material"
import React, { ReactNode, useMemo } from "react"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"

interface SliderFieldProps {
    label?: ReactNode
}

export const SliderField = ({ label, ...props }: SliderFieldProps & SliderProps) => {
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
            <Box
                sx={{
                    px: "1rem",
                    height: "4rem",
                }}
            >
                <Slider
                    {...props}
                    sx={{
                        color: factionTheme.primary,
                        py: "1rem",
                        height: "3px",

                        ".MuiSlider-mark": {
                            backgroundColor: factionTheme.primary,
                            width: ".5rem",
                            height: ".5rem",
                            borderRadius: "50%",
                        },
                        ".MuiSlider-thumb": {
                            width: "1.5rem",
                            height: "1.5rem",
                            "&::after": {
                                width: "0",
                                height: "0",
                            },
                        },

                        ".MuiSlider-markLabel": {
                            top: "2.2rem",
                            fontFamily: fonts.nostromoBlack,
                        },
                    }}
                />
            </Box>
        </Stack>
    )
}
