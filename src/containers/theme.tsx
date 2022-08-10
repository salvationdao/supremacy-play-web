import { createContext, useContext, useEffect, useState, Dispatch } from "react"
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material"
import { mergeDeep, shadeColor } from "../helpers"
import { colors, theme } from "../theme/theme"

interface FactionThemeColors {
    primary: string
    secondary: string
    background: string
}

export interface ThemeState extends Theme {
    setFactionColors: Dispatch<React.SetStateAction<FactionThemeColors>>
}

const initialState: ThemeState = {
    ...theme,
    setFactionColors: () => {
        return
    },
}

export const ThemeContext = createContext<ThemeState>(initialState)

export const ThemeProvider: React.FC = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<Theme>(theme)
    const [factionColors, setFactionColors] = useState<FactionThemeColors>({
        primary: colors.neonBlue,
        secondary: "#000000",
        background: shadeColor(colors.neonBlue, -95),
    })

    useEffect(() => {
        setCurrentTheme((curTheme: Theme) => mergeDeep(curTheme, { factionTheme: factionColors }))
    }, [factionColors])

    return (
        <ThemeContext.Provider value={{ ...currentTheme, setFactionColors }}>
            <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeContext)
}
