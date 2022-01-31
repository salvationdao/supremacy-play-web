import ReactDOM from 'react-dom'
import { Theme } from '@mui/material/styles'
import {
    AuthProvider,
    GameProvider,
    SnackBarProvider,
    SocketProvider,
    useAuth,
    WarMachinesProvider,
} from './containers'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { MiniMap, Notifications, VotingSystem, WarMachineStats } from './components'
import { useEffect, useState } from 'react'
import { NotificationsProvider } from './containers/notifications'
import { FactionThemeColor, UpdateTheme } from './types'
import { mergeDeep } from './helpers'
import { theme } from './theme/theme'
import { GameBar, WalletProvider } from '@ninjasoftware/passport-gamebar'

const AppInner = () => {
    const { authLoading, authError } = useAuth()
    const { token, isVisible, setExtensionType } = useTwitch()
    useEffect(() => {
        setExtensionType('OVERLAY')
    }, [])

    return (
        <>
            <CssBaseline />
            {!authLoading && !authError && isVisible && (
                <Box>
                    <GameBar barPosition="top" twitchExtensionJWT={token} />
                    <VotingSystem />
                    <MiniMap />
                    <Notifications />
                    {/* <WarMachineStats /> */}
                </Box>
            )}
        </>
    )
}

const App = () => {
    const [currentTheme, setTheme] = useState<Theme>(theme)
    const [factionColors, setFactionColors] = useState<FactionThemeColor>({
        primary: '#00FFFF',
        secondary: '#00FFFF',
        background: '#050c12',
    })

    useEffect(() => {
        setTheme((curTheme: Theme) => mergeDeep(curTheme, { factionTheme: factionColors }))
    }, [factionColors])

    return (
        <UpdateTheme.Provider value={{ updateTheme: setFactionColors }}>
            <ThemeProvider theme={currentTheme}>
                <SocketProvider>
                    <AuthProvider>
                        <WalletProvider>
                            <GameProvider>
                                <NotificationsProvider>
                                    <WarMachinesProvider>
                                        <SnackBarProvider>
                                            <AppInner />
                                        </SnackBarProvider>
                                    </WarMachinesProvider>
                                </NotificationsProvider>
                            </GameProvider>
                        </WalletProvider>
                    </AuthProvider>
                </SocketProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
