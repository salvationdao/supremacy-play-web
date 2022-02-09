import ReactDOM from 'react-dom'
import { Theme } from '@mui/material/styles'
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    SnackBarProvider,
    SocketProvider,
    useAuth,
    useDimension,
    WarMachinesProvider,
} from './containers'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { MiniMap, Notifications, VotingSystem, WarMachineStats } from './components'
import { useEffect, useState } from 'react'
import { FactionThemeColor, UpdateTheme } from './types'
import { mergeDeep } from './helpers'
import { theme } from './theme/theme'
import { GameBar, WalletProvider } from '@ninjasoftware/passport-gamebar'
import { PASSPORT_SERVER_HOSTNAME, PASSPORT_WEB, STREAM_SITE, SENTRY_CONFIG } from './constants'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { LiveVotingChart } from './components/LiveVotingChart/LiveVotingChart'
import * as Sentry from '@sentry/react'

if (SENTRY_CONFIG) {
    // import { Integrations } from '@sentry/tracing'
    // import { createBrowserHistory } from 'history'
    // const history = createBrowserHistory()
    Sentry.init({
        dsn: SENTRY_CONFIG.DSN,
        release: SENTRY_CONFIG.RELEASE,
        environment: SENTRY_CONFIG.ENVIRONMENT,
        // integrations: [
        // new Integrations.BrowserTracing({
        // routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
        // }),
        // ],
        tracesSampleRate: SENTRY_CONFIG.SAMPLERATE,
    })
}

const AppInner = () => {
    const { gameserverSessionID, authSessionIDGetLoading, authSessionIDGetError } = useAuth()
    const {
        iframeDimensions: { width, height },
    } = useDimension()
    const handle = useFullScreenHandle()

    return (
        <>
            <CssBaseline />
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <FullScreen handle={handle}>
                    <Box sx={{ position: 'relative', height, width, backgroundColor: '#000000', overflow: 'hidden' }}>
                        <iframe width="100%" height="100%" frameBorder="0" allowFullScreen src={STREAM_SITE}></iframe>
                        {/* <video width="100%" height="100%" autoPlay src={STREAM_SITE}></video> */}

                        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                            <GameBar
                                opacity={0.94}
                                barPosition="top"
                                gameserverSessionID={gameserverSessionID}
                                passportWeb={PASSPORT_WEB}
                                passportServerHost={PASSPORT_SERVER_HOSTNAME}
                            />
                            <VotingSystem />
                            <MiniMap />
                            <Notifications />
                            <LiveVotingChart />
                            <WarMachineStats />
                        </Box>
                    </Box>
                </FullScreen>
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
                                <WarMachinesProvider>
                                    <DimensionProvider>
                                        <SnackBarProvider>
                                            <AppInner />
                                        </SnackBarProvider>
                                    </DimensionProvider>
                                </WarMachinesProvider>
                            </GameProvider>
                        </WalletProvider>
                    </AuthProvider>
                </SocketProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
