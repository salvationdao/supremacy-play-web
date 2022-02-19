import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor"
import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { GameBar, WalletProvider } from "@ninjasoftware/passport-gamebar"
import * as Sentry from "@sentry/react"
import { useCallback, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { FullScreen, FullScreenHandle, useFullScreenHandle } from "react-full-screen"
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
import { BattleEndScreen } from "./components/BattleEndScreen/BattleEndScreen"
import { CONTROLS_HEIGHT, GAMEBAR_HEIGHT, PASSPORT_SERVER_HOSTNAME, PASSPORT_WEB, SENTRY_CONFIG } from "./constants"
import {
    AuthContainerType,
    AuthProvider,
    DimensionContainerType,
    DimensionProvider,
    GameProvider,
    LeftSideBarProvider,
    SnackBarProvider,
    SocketProvider,
    StreamContainerType,
    StreamProvider,
    useAuth,
    useDimension,
    useStream,
} from "./containers"
import { mergeDeep } from "./helpers"
import { colors, theme } from "./theme/theme"
import { FactionThemeColor, UpdateTheme } from "./types"

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

interface WebRTCAdaptorType {
    websocket_url: string
    mediaConstraints: {
        video: boolean
        audio: boolean
    }
    sdp_constraints: {
        OfferToReceiveAudio: boolean
        OfferToReceiveVideo: boolean
    }
    remoteVideoId: string
    isPlayMode: boolean
    debug: boolean
    candidateTypes: string[]
    callback: (info: string, obj: any) => void
    callbackError: (error: string) => void

    forceStreamQuality: (streamID: string, quality: number) => void
    play: (streamID: string, tokenID: string) => void
    getStreamInfo: (streamID: string) => void
}

const AppInner = (props: AppInnerProps) => {
    // props
    const { authContainer, dimensionContainer, fullScreenHandleContainer, streamContainer } = props

    // auth
    const { gameserverSessionID, authSessionIDGetLoading, authSessionIDGetError } = authContainer

    // dimensions
    const { mainDivDimensions, streamDimensions } = dimensionContainer

    // stream
    const {
        selectedWsURL,
        selectedStreamID,
        streamResolutions,
        setStreamResolutions,
        volume,
        setVolume,
        isMute,
        setIsMute,
        muteToggle,
    } = streamContainer

    useEffect(() => {
        if (volume === 0.1) {
            setIsMute(true)
            return
        }
        if (vidRef && vidRef.current && vidRef.current.volume) {
            vidRef.current.volume = volume
            setIsMute(false)
        }
    }, [volume])

    const webRtc = useRef<WebRTCAdaptorType>()
    const vidRef = useRef<HTMLVideoElement | undefined>(undefined)
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
                    debug: false,
                    candidateTypes: ["tcp", "udp"],
                    callback: function (info: string, obj: any) {
                        if (info == "initialized") {
                            console.log(`--- ${info} ---`, { info, obj })
                            if (!webRtc || !webRtc.current || !webRtc.current.play) return
                            webRtc.current.play(selectedStreamID, "")
                        } else if (info == "play_started") {
                            console.log(`--- ${info} ---`, { info, obj })
                            if (!webRtc || !webRtc.current || !webRtc.current.getStreamInfo) return
                            webRtc.current.getStreamInfo(selectedStreamID)
                        } else if (info == "play_finished") {
                            console.log(`--- ${info} ---`, { info, obj })
                        } else if (info == "closed") {
                            if (typeof obj != "undefined") {
                                console.log(`--- ${info} ---`, { info, obj })
                            }
                        } else if (info == "streamInformation") {
                            console.log(`--- ${info} ---`, { info, obj })
                            const resolutions: number[] = []
                            obj["streamInfo"].forEach(function (entry: any) {
                                // get resolutions from server response and added to an array.
                                if (!resolutions.includes(entry["streamHeight"])) {
                                    resolutions.push(entry["streamHeight"])
                                }
                            })
                            setStreamResolutions(resolutions)
                        } else if (info == "ice_connection_state_changed") {
                            console.log("--- iceConnectionState Changed ---", { info, obj })
                        }
                    },
                    callbackError: (error: string) => {
                        console.log(typeof error)
                        console.log(`--- ERROR ---`, error)
                    },
                })
            } catch (e) {
                console.log(e)
            }
        },
        [selectedWsURL, selectedStreamID],
    )

    const changeStreamQuality = (quality: number) => {
        if (webRtc?.current) {
            webRtc.current.forceStreamQuality(selectedStreamID, quality)
        }
    }

    return (
        <>
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <FullScreen handle={fullScreenHandleContainer}>
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
                                    screenHandler={fullScreenHandleContainer}
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

interface AppInnerProps {
    authContainer: AuthContainerType
    dimensionContainer: DimensionContainerType
    fullScreenHandleContainer: FullScreenHandle
    streamContainer: StreamContainerType
}

const AppInnerContainer = () => {
    const authContainer = useAuth()
    const dimensionContainer = useDimension()
    const streamContainer = useStream()
    const handle = useFullScreenHandle()
    return (
        <AppInner
            streamContainer={streamContainer}
            authContainer={authContainer}
            dimensionContainer={dimensionContainer}
            fullScreenHandleContainer={handle}
        />
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
                                                <AppInnerContainer />
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
