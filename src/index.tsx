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
    const { gameserverSessionID, authSessionIDGetLoading, authSessionIDGetError } = useAuth()

    return (
        <>
            <CssBaseline />
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <Box sx={{ position: 'relative', height: 900, width: 1600, backgroundColor: 'red' }}>
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        src="https://watch-test-am.supremacy.game:/WebRTCAppEE/play.html?name=332524196830677408897509"
                    ></iframe>

                    <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                        <GameBar barPosition="top" gameserverSessionID={gameserverSessionID} />
                        <VotingSystem />
                        <MiniMap />
                        <Notifications />
                        {/* <WarMachineStats /> */}
                    </Box>
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
