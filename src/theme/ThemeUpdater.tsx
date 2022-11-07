import { Box } from "@mui/material"
import { ReactNode } from "react"
import { useTheme } from "../containers/theme"
import { fonts } from "./theme"

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
                        background: `${theme.factionTheme.primary}50 !important`,
                        border: `0.5px ridge ${theme.factionTheme.primary}20 !important`,
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                        background: `${theme.factionTheme.primary}90 !important`,
                    },
                },

                ".MuiPagination-root": {
                    ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold },
                    ".Mui-selected": {
                        color: (theme) => theme.factionTheme.secondary,
                        backgroundColor: `${theme.factionTheme.primary} !important`,
                    },
                },
            }}
        >
            {children}
        </Box>
    )
}
