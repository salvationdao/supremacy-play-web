import { Box, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material"
import { Assets, Bar, DrawerButtons, LiveChat } from "./components"
import { AuthProvider, BarProvider, SocketProvider, ThemeProvider, useTheme } from "./containers"

const Inner = (props: GameBarBaseProps) => {
    const { currentTheme } = useTheme()

    return (
        <MuiThemeProvider theme={currentTheme}>
            <CssBaseline />
            <Box sx={{ zIndex: 99999 }}>
                <Bar {...props} />
                <DrawerButtons />
                <LiveChat />
                <Assets passportWeb={props.passportWeb} />
            </Box>
        </MuiThemeProvider>
    )
}

export type BarPosition = "top" | "bottom"

export interface GameBarBaseProps {
    barPosition: BarPosition
    gameserverSessionID?: string
    tokenSalePage: string
    supremacyPage: string
    passportWeb: string
    passportServerHost: string
}

export const GameBar: React.FC<GameBarBaseProps> = (props) => {
    // This will tell us whether we are rendering game bar directly (i.e. local dev)
    // or being used by 3rd party

    return (
        <SocketProvider initialState={props.passportServerHost}>
            <ThemeProvider>
                <AuthProvider initialState={{ gameserverSessionID: props.gameserverSessionID }}>
                    <BarProvider initialState={props.barPosition}>
                        <Inner {...props} />
                    </BarProvider>
                </AuthProvider>
            </ThemeProvider>
        </SocketProvider>
    )
}
