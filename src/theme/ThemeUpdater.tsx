import { Box } from "@mui/material"
import { ReactNode } from "react"
import { useTheme } from "../containers/theme"

export const ThemeUpdater = ({ children }: { children: ReactNode }) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                "*": {
                    scrollbarColor: `${theme.factionTheme.s500} ${theme.factionTheme.s700} !important`,

                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },

                    "::-webkit-scrollbar-thumb": {
                        background: `${theme.factionTheme.primary}70 !important`,
                        border: `0.5px ridge ${theme.factionTheme.primary}20 !important`,
                    },

                    "::-webkit-scrollbar-thumb:hover": {
                        background: `${theme.factionTheme.primary}CC !important`,
                    },
                },

                ".MuiPagination-root": {
                    ".Mui-selected": {
                        borderRadius: 0,
                        color: theme.factionTheme.text,
                        border: `${theme.factionTheme.primary} 1px solid !important`,
                        background: `linear-gradient(180deg, ${theme.factionTheme.primary}90, ${theme.factionTheme.primary}30) !important`,
                        boxShadow: 1,
                    },
                },

                ".MuiCircularProgress-root": {
                    color: theme.factionTheme.s300,
                },

                ".MuiSlider-root": {
                    color: theme.factionTheme.primary,
                    ".MuiSlider-thumb": { boxShadow: 1 },
                },

                ".MuiCheckbox-root": {
                    "&.Mui-checked > .MuiSvgIcon-root": { fill: `${theme.factionTheme.primary}` },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${theme.factionTheme.primary}50` },
                    "&.MuiCheckbox-indeterminate > .MuiSvgIcon-root": { color: theme.factionTheme.primary },
                },

                ".MuiSwitch-root": {
                    ".MuiSwitch-switchBase": {
                        "&.Mui-checked": {
                            color: theme.factionTheme.primary,
                            fill: theme.factionTheme.primary,
                            "& + .MuiSwitch-track": {
                                backgroundColor: `${theme.factionTheme.primary}44`,
                            },
                        },
                        "&.Mui-focusVisible .MuiSwitch-thumb": {
                            color: theme.factionTheme.primary,
                            fill: theme.factionTheme.primary,
                        },
                        "&.Mui-disabled .MuiSwitch-thumb": {
                            color: `${theme.factionTheme.primary}66`,
                            fill: `${theme.factionTheme.primary}66`,
                        },
                    },
                },
            }}
        >
            {children}
        </Box>
    )
}
