import { Box } from "@mui/material"
import { ReactNode } from "react"
import { useTheme } from "../containers/theme"

export const ThemeUpdater = ({ children }: { children: ReactNode }) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                "*": {
                    scrollbarColor: `${theme.factionTheme.primary}50 #FFFFFF !important`,

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
                        color: theme.factionTheme.secondary,
                        backgroundColor: `${theme.factionTheme.primary} !important`,
                        boxShadow: 1,
                    },
                },

                ".MuiCircularProgress-root": {
                    color: theme.factionTheme.primary,
                },

                ".MuiSlider-root": {
                    color: theme.factionTheme.primary,
                    ".MuiSlider-thumb": { boxShadow: 1 },
                },
                ".MuiSwitch-root": {
                    ".MuiSwitch-switchBase": {
                        "&.Mui-checked": {
                            color: theme.factionTheme.primary,
                            "& + .MuiSwitch-track": {
                                backgroundColor: `${theme.factionTheme.primary}44`,
                            },
                        },
                        "&.Mui-focusVisible .MuiSwitch-thumb": {
                            color: theme.factionTheme.primary,
                        },
                        "&.Mui-disabled .MuiSwitch-thumb": {
                            color: `${theme.factionTheme.primary}66`,
                        },
                    },
                },
            }}
        >
            {children}
        </Box>
    )
}
