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
import { Box, Button, CssBaseline, Stack, ThemeProvider } from '@mui/material'
import { Controls, LiveCounts, MiniMap, Notifications, VotingSystem, WarMachineStats } from './components'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import ReactPlayer from 'react-player'

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
    const elementRef = useRef<HTMLIFrameElement>(null)
    const [isMute, setIsMute] = useState(true)
    const [volume, setVolume] = useState(0.0)

    useLayoutEffect(() => {
        if (elementRef.current) {
            console.log('holy shit wtf', elementRef.current) // { current: <h1_object> }
            // elementRef.current.set
        }
    })

    return (
        <>
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
                                ref={elementRef}
                                // width="100%"
                                // height="100%"
                                frameBorder="0"
                                allowFullScreen
                                src={STREAM_SITE}
                            ></iframe>

                            <ReactPlayer
                                volume={volume}
                                playing
                                muted={isMute}
                                controls
                                url={'https://www.youtube.com/watch?v=5qap5aO4i9A'}
                                width="100%"
                                height={'100%'}
                            />
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
                            <Controls
                                volume={volume}
                                setVolume={setVolume}
                                muteToggle={() => {
                                    setIsMute(!isMute)
                                }}
                                screenHandler={handle}
                            />
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
