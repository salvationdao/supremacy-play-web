import { Box, Stack, ThemeProvider } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { GameBar, WalletProvider } from '@ninjasoftware/passport-gamebar'
import * as Sentry from '@sentry/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Controls, MiniMap, Notifications, VotingSystem, WarMachineStats } from './components'
import { LiveVotingChart } from './components/LiveVotingChart/LiveVotingChart'
import {
    CONTROLS_HEIGHT,
    GAMEBAR_HEIGHT,
    PASSPORT_SERVER_HOSTNAME,
    PASSPORT_WEB,
    SENTRY_CONFIG,
    STREAM_SITE,
} from './constants'
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    SnackBarProvider,
    SocketProvider,
    useAuth,
    useDimension,
} from './containers'
import { mergeDeep } from './helpers'
import { colors, theme } from './theme/theme'
import { FactionThemeColor, UpdateTheme } from './types'

// import { WebRTCAdaptor } from '@ant-media/webrtc_adaptor'

// const WebRTCAdaptor = require('@ant-media/webrtc_adaptor')

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

    // const webRTCAdaptor = new WebRTCAdaptor({
    //     websocket_url: 'wss://your-domain.tld:5443/WebRTCAppEE/websocket',
    //     mediaConstraints: {
    //         video: true,
    //         audio: true,
    //     },
    //     peerconnection_config: {
    //         iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
    //     },
    //     sdp_constraints: {
    //         OfferToReceiveAudio: false,
    //         OfferToReceiveVideo: false,
    //     },
    //     localVideoId: 'id-of-video-element', // <video id="id-of-video-element" autoplay muted></video>
    //     // bandwidth: int | string, // default is 900 kbps, string can be 'unlimited'
    //     // dataChannelEnabled: true | false, // enable or disable data channel
    //     // callback: (info, obj) => {}, // check info callbacks bellow
    //     // callbackError: function (error, message) {}, // check error callbacks bellow
    // })

    // console.log('wrtc lib', webRTCAdaptor)

    const elementRef = useRef<HTMLIFrameElement>(null)
    const [isMute, setIsMute] = useState(true)
    const [volume, setVolume] = useState(0.0)

    useLayoutEffect(() => {
        if (elementRef.current) {
            // elementRef.current.set
            // console.log('this is el current', elementRef.current.vol)
            console.log('this is vol', (elementRef.current as any)?.volume)
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
                                id="supremacy-stream"
                                ref={elementRef}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                                src={
                                    'https://staging-watch-syd02.supremacy.game/WebRTCAppEE/play.html?name=886200805704583109786601'
                                }
                            ></iframe>
                            {/* 
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: 'https://staging-watch-syd02.supremacy.game/WebRTCAppEE/play.html?name=886200805704583109786601',
                                }}
                            ></div> */}

                            {/* <video width="100%" height="100%" controls>
                                <source src={STREAM_SITE} type="video/mp4" />
                            </video> */}

                            {/* <ReactPlayer
                                volume={volume}
                                playing
                                muted={isMute}
                                controls
                                url={STREAM_SITE}
                                width="100%"
                                height={'100%'}
                            /> */}
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
