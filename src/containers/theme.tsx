import { FactionTheme, Theme, ThemeProvider as MuiThemeProvider } from "@mui/material"
import { createContext, Dispatch, useContext, useEffect, useState } from "react"
import { mergeDeep } from "../helpers"
import { theme } from "../theme/theme"

export interface ThemeState extends Theme {
    setFactionColors: Dispatch<React.SetStateAction<FactionTheme>>
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
    const [factionColors, setFactionColors] = useState<FactionTheme>({
        ...theme.factionTheme,
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
