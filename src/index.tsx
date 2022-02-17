import { Box, CssBaseline, Stack, Theme, ThemeProvider } from '@mui/material'
import { Controls, LiveVotingChart, MiniMap, Notifications, VotingSystem, WarMachineStats } from './components'
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
    STREAM_ASPECT_RATIO_W_H,
} from './constants'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import * as Sentry from '@sentry/react'
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    SnackBarProvider,
    SocketProvider,
    useAuth,
    useDimension,
} from './containers'
import ReactDOM from 'react-dom'
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor'

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

    const [isMute, setIsMute] = useState(true)
    const [volume, setVolume] = useState(0.0)

    // const infoCallback = useCallback(() => {}, [])

    useEffect(() => {
        initWebRTCAdaptor()
    }, [])

    const initWebRTCAdaptor = () => {
        const webRTCAdaptor = new WebRTCAdaptor({
            //https://staging-watch-syd02.supremacy.game/WebRTCAppEE/play.html?name=886200805704583109786601
            // wss://your-domain.tld:5443/WebRTCAppEE/websocket
            websocket_url: 'wss://staging-watch-syd02.supremacy.game/WebRTCAppEE/websocket',
            mediaConstraints: {
                video: true,
                audio: true,
            },
            peerconnection_config: {
                iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
            },
            sdp_constraints: {
                OfferToReceiveAudio: false,
                OfferToReceiveVideo: false,
            },
            localVideoId: 'remoteVideo', // <video id="id-of-video-element" autoplay muted></video>
            // bandwidth: int|string, // default is 900 kbps, string can be 'unlimited'
            // dataChannelEnabled: true|false, // enable or disable data channel
            callback: (info: any, obj: any) => {
                if (info == 'play_started') {
                    webRTCAdaptor.getStreamInfo('886200805704583109786601')
                }
                console.log('call back', { info, obj })
            }, // check info callbacks bellow
            // callbackError: function(error, message) {}, // check error callbacks bellow
        })
    }

    // Work out the aspect ratio for the iframe bit and yeah
    let iframeHeight: number | string = height - GAMEBAR_HEIGHT - CONTROLS_HEIGHT
    let iframeWidth: number | string = width
    const iframeRatio = iframeWidth / iframeHeight
    if (iframeRatio >= STREAM_ASPECT_RATIO_W_H) {
        iframeHeight = 'unset'
    } else {
        iframeWidth = 'unset'
    }

    return (
        <>
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <FullScreen handle={handle}>
                    <Stack sx={{ position: 'relative', height, width, backgroundColor: '#000000', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', width: '100%', height: GAMEBAR_HEIGHT, zIndex: 999 }}>
                            <GameBar
                                barPosition="top"
                                gameserverSessionID={gameserverSessionID}
                                passportWeb={PASSPORT_WEB}
                                passportServerHost={PASSPORT_SERVER_HOSTNAME}
                            />
                        </Box>

                        <Box sx={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
                            <iframe
                                frameBorder="0"
                                allowFullScreen
                                id="video_stream"
                                src={STREAM_SITE}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    aspectRatio: STREAM_ASPECT_RATIO_W_H.toString(),
                                    width: iframeWidth,
                                    height: iframeHeight,
                                }}
                            ></iframe>

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
                                isMute={isMute}
                                muteToggle={() => {
                                    console.log('this is window', window)

                                    if ((window as any).changeVideoMuteStatus) {
                                        ;(window as any).changeVideoMuteStatus()
                                        return
                                    }

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
