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
} from './containers'
import { Box, CssBaseline, Stack, ThemeProvider } from '@mui/material'
import { Controls, LiveCounts, MiniMap, Notifications, VotingSystem, WarMachineStats } from './components'
import { useEffect, useState } from 'react'
import { FactionThemeColor, UpdateTheme } from './types'
import { mergeDeep } from './helpers'
import { colors, theme } from './theme/theme'
import { GameBar, WalletProvider } from '@ninjasoftware/passport-gamebar'
import {
    PASSPORT_SERVER_HOSTNAME,
    PASSPORT_WEB,
    STREAM_SITE,
    SENTRY_CONFIG,
    GAMEBAR_HEIGHT,
    CONTROLS_HEIGHT,
} from './constants'
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
        streamDimensions: { width, height },
    } = useDimension()
    const handle = useFullScreenHandle()

    return (
        <>
            <CssBaseline />
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <FullScreen handle={handle}>
                    <Stack sx={{ position: 'relative', height, width, backgroundColor: '#000000', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', width: '100%', height: GAMEBAR_HEIGHT }}>
                            <GameBar
                                barPosition="top"
                                gameserverSessionID={gameserverSessionID}
                                passportWeb={PASSPORT_WEB}
                                passportServerHost={PASSPORT_SERVER_HOSTNAME}
                            />
                        </Box>

                        <Box sx={{ flex: 1, position: 'relative' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                                src={STREAM_SITE}
                            ></iframe>

                            {/* <Box sx={{ backgroundColor: '#622D93', width: '100%', height: '100%' }} /> */}
                            {/* <Box sx={{ backgroundColor: '#000000', width: '100%', height: '100%' }} /> */}

                            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                                <VotingSystem />
                                <MiniMap />
                                <Notifications />
                                <LiveVotingChart />
                                <WarMachineStats />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: CONTROLS_HEIGHT,
                                backgroundColor: colors.darkNavyBlue,
                            }}
                        >
                            <Controls />
                        </Box>
                    </Stack>
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
                                <DimensionProvider>
                                    <SnackBarProvider>
                                        <AppInner />
                                    </SnackBarProvider>
                                </DimensionProvider>
                            </GameProvider>
                        </WalletProvider>
                    </AuthProvider>
                </SocketProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
