import ReactDOM from "react-dom"
import { Theme } from "@mui/material/styles"
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    LeftSideBarProvider,
    SnackBarProvider,
    SocketProvider,
    useAuth,
    useDimension,
    useStream,
} from "./containers"
import { Box, Button, CssBaseline, Stack, ThemeProvider } from "@mui/material"
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
} from "./components"
import { useCallback, useEffect, useRef, useState } from "react"
import { FactionThemeColor, UpdateTheme } from "./types"
import { mergeDeep } from "./helpers"
import { colors, theme } from "./theme/theme"
import { GameBar, WalletProvider } from "@ninjasoftware/passport-gamebar"
import { PASSPORT_SERVER_HOSTNAME, PASSPORT_WEB, SENTRY_CONFIG, GAMEBAR_HEIGHT, CONTROLS_HEIGHT } from "./constants"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import * as Sentry from "@sentry/react"
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor"
import { StreamProvider } from "./containers"
import { BattleEndScreen } from "./components/BattleEndScreen/BattleEndScreen"

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
    const { mainDivDimensions, streamDimensions } = useDimension()
    const [streamResolutions, setStreamResolutions] = useState<number[]>([])

    const { selectedWsURL, selectedStreamID } = useStream()

    const handle = useFullScreenHandle()

    const [isMute, setIsMute] = useState(true)
    const [volume, setVolume] = useState(0.0)

    const webRtc = useRef<any>()

    const vidRef = useRef<HTMLVideoElement | undefined>(undefined)

    useEffect(() => {
        console.log("this is volume", volume)

        if (volume === 0.1) {
            setIsMute(true)
            return
        }
        if (vidRef && vidRef.current && vidRef.current.volume) {
            vidRef.current.volume = volume
            setIsMute(false)
        }
    }, [volume])

    const changeStreamQuality = (quality: number) => {
        if (webRtc?.current) {
            webRtc.current.forceStreamQuality(selectedStreamID, quality)
            console.log("after")
        }
    }

    const muteToggle = () => {
        setIsMute(!isMute)
    }

    const vidRefCallback = useCallback(
        (vid: HTMLVideoElement) => {
            try {
                vidRef.current = vid
                webRtc.current = new WebRTCAdaptor({
                    websocket_url: selectedWsURL,

                    mediaConstraints: { video: false, audio: false },
                    sdp_constraints: {
                        OfferToReceiveAudio: true,
                        OfferToReceiveVideo: true,
                    },
                    remoteVideoId: "remoteVideo",
                    isPlayMode: true,
                    debug: true,
                    candidateTypes: ["tcp", "udp"],
                    callback: function (info: any, obj: any) {
                        if (info == "initialized") {
                            console.log("info initialized")
                            webRtc.current.play(selectedStreamID, "")
                        } else if (info == "play_started") {
                            webRtc.current.getStreamInfo(selectedStreamID)
                        } else if (info == "play_finished") {
                            console.log("play finished")
                        } else if (info == "closed") {
                            if (typeof obj != "undefined") {
                                console.log("Connecton closed: " + JSON.stringify(obj))
                            }
                        } else if (info == "streamInformation") {
                            const resolutions: any[] = []
                            obj["streamInfo"].forEach(function (entry: any) {
                                // It's needs to both of VP8 and H264. So it can be duplicate
                                if (!resolutions.includes(entry["streamHeight"])) {
                                    resolutions.push(entry["streamHeight"])
                                } // Got resolutions from server response and added to an array.
                            })
                            setStreamResolutions(resolutions)
                        } else if (info == "ice_connection_state_changed") {
                            console.log("iceConnectionState Changed: ", JSON.stringify(obj))
                        }
                    },
                    callbackError: (error: any) => {
                        console.log("error callback: " + JSON.stringify(error))
                    },
                })
            } catch (e) {
                console.log(e)
            }
        },
        [selectedWsURL, selectedStreamID],
    )

    return (
        <>
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <FullScreen handle={handle}>
                    <Stack direction="row" sx={{ backgroundColor: colors.darkNavy }}>
                        <Stack sx={{ width: mainDivDimensions.width, height: mainDivDimensions.height }}>
                            <Box sx={{ position: "relative", width: "100%", height: GAMEBAR_HEIGHT, zIndex: 999 }}>
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
                                    position: "relative",
                                    width: "100%",
                                    backgroundColor: colors.darkNavyBlue,
                                    overflow: "hidden",
                                }}
                            >
                                <LeftSideBar />

                                <Box
                                    sx={{
                                        position: "relative",
                                        height: streamDimensions.height,
                                        width: streamDimensions.width,
                                        backgroundColor: colors.darkNavyBlue,
                                        clipPath: `polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)`,
                                    }}
                                >
                                    <video
                                        muted={isMute}
                                        ref={vidRefCallback}
                                        id="remoteVideo"
                                        autoPlay
                                        controls
                                        playsInline
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",

                                            width: "100%",
                                            height: "100%",
                                        }}
                                    ></video>

                                    <Box sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
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
                                    position: "relative",
                                    width: "100%",
                                    height: CONTROLS_HEIGHT,
                                }}
                            >
                                <Controls
                                    resolutionsList={streamResolutions}
                                    volume={volume}
                                    setVolume={setVolume}
                                    isMute={isMute}
                                    muteToggle={() => {
                                        muteToggle()
                                    }}
                                    screenHandler={handle}
                                    forceResolutionFn={changeStreamQuality}
                                    defaultValue={1080}
                                />
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
        primary: "#00FFFF",
        secondary: "#00FFFF",
        background: "#050c12",
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

ReactDOM.render(<App />, document.getElementById("root"))
