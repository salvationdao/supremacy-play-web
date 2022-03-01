import { useState } from "react"
import { Theme } from "@mui/material/styles"
import { createContainer } from "unstated-next"
import themes from "../theme"
import { mergeDeep } from "../helpers"

export const ThemeContainer = createContainer((initialState: number = 0) => {
    const [currentTheme, setTheme] = useState<Theme>(themes[initialState])

    const mergeIntoTheme = (modifications: any) => {
        setTheme((curTheme: Theme) => mergeDeep(curTheme, modifications))
    }

    return {
        currentTheme,
        setTheme: (themeIndex: number) => {
            setTheme(themes[themeIndex])
        },
        mergeIntoTheme,
    }
})

export const ThemeProvider = ThemeContainer.Provider
export const useTheme = ThemeContainer.useContainer
