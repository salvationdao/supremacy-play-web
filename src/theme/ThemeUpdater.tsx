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
                        color: theme.factionTheme.secondary,
                        backgroundColor: `${theme.factionTheme.primary} !important`,
                    },
                },

                ".MuiCircularProgress-root": {
                    color: theme.factionTheme.primary,
                },
            }}
        >
            {children}
        </Box>
    )
}