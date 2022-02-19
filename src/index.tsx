import ReactDOM from 'react-dom'
import { Theme } from '@mui/material/styles'
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    LeftSideBarProvider,
    SnackBarProvider,
    SocketProvider,
    useAuth,
    useDimension,
} from './containers'
import { Box, CssBaseline, Stack, ThemeProvider } from '@mui/material'
import {
    Controls,
    LeftSideBar,
    LiveChat,
    LiveChatSideButton,
    LiveVotingChart,
    MiniMap,
    Notifications,
    VotingSystem,
    WarMachineStats,
} from './components'
import { useEffect, useState } from 'react'
import { FactionThemeColor, UpdateTheme } from './types'
import { mergeDeep } from './helpers'
import { colors, theme } from './theme/theme'
import { GameBar, WalletProvider } from '@ninjasoftware/passport-gamebar'
import {
    PASSPORT_SERVER_HOSTNAME,
    PASSPORT_WEB,
    SENTRY_CONFIG,
    GAMEBAR_HEIGHT,
    CONTROLS_HEIGHT,
    STREAM_ASPECT_RATIO_W_H,
} from './constants'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import * as Sentry from '@sentry/react'
import { StreamProvider, useStream } from './containers'
import { BattleEndScreen } from './components/BattleEndScreen/BattleEndScreen'

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
    const { mainDivDimensions, streamDimensions, iframeDimensions } = useDimension()
    const { currentStream } = useStream()
    const handle = useFullScreenHandle()

    return (
        <>
            <CssBaseline />
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <FullScreen handle={handle}>
                    <Stack direction="row" sx={{ backgroundColor: colors.darkNavy }}>
                        <Stack sx={{ width: mainDivDimensions.width, height: mainDivDimensions.height }}>
                            <Box sx={{ position: 'relative', width: '100%', height: GAMEBAR_HEIGHT, zIndex: 999 }}>
                                <GameBar
                                    barPosition="top"
                                    gameserverSessionID={gameserverSessionID}
                                    passportWeb={PASSPORT_WEB}
                                    passportServerHost={PASSPORT_SERVER_HOSTNAME}
                                />
                            </Box>

                            <Stack
                                direction="row"
                                sx={{
                                    flex: 1,
                                    position: 'relative',
                                    width: '100%',
                                    backgroundColor: colors.darkNavyBlue,
                                    overflow: 'hidden',
                                }}
                            >
                                <LeftSideBar />

                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: streamDimensions.height,
                                        width: streamDimensions.width,
                                        backgroundColor: colors.darkNavyBlue,
                                        clipPath: `polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)`,
                                    }}
                                >
                                    <iframe
                                        frameBorder="0"
                                        allowFullScreen
                                        src={currentStream?.url}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            aspectRatio: STREAM_ASPECT_RATIO_W_H.toString(),
                                            width: iframeDimensions.width,
                                            height: iframeDimensions.height,
                                        }}
                                    ></iframe>

                                    {/* <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            backgroundColor: '#622D93',
                                        }}
                                    /> */}
                                    {/* <Box sx={{ position: 'absolute', left: 0, right: 0 , top: 0, bottom: 0, backgroundColor: '#000000', }} /> */}

                                    <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                                        <VotingSystem />
                                        <MiniMap />
                                        <Notifications />
                                        <LiveVotingChart />
                                        <WarMachineStats />
                                        <BattleEndScreen />
                                    </Box>
                                </Box>
                            </Stack>

                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: CONTROLS_HEIGHT,
                                }}
                            >
                                <Controls />
                            </Box>
                        </Stack>

                        <LiveChatSideButton />
                    </Stack>

                    <LiveChat />
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
                        <StreamProvider>
                            <WalletProvider>
                                <GameProvider>
                                    <DimensionProvider>
                                        <LeftSideBarProvider>
                                            <SnackBarProvider>
                                                <AppInner />
                                            </SnackBarProvider>
                                        </LeftSideBarProvider>
                                    </DimensionProvider>
                                </GameProvider>
                            </WalletProvider>
                        </StreamProvider>
                    </AuthProvider>
                </SocketProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
