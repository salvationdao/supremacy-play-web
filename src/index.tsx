import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { GameBar, WalletProvider } from "@ninjasoftware/passport-gamebar"
import * as Sentry from "@sentry/react"
import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
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
import {
    CONTROLS_HEIGHT,
    GAMEBAR_HEIGHT,
    PASSPORT_SERVER_HOSTNAME,
    PASSPORT_WEB,
    SENTRY_CONFIG,
    STREAM_ASPECT_RATIO_W_H,
} from "./constants"
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    LeftSideBarProvider,
    SocketProvider,
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

const AppInner = () => {
    const { gameserverSessionID, authSessionIDGetLoading, authSessionIDGetError } = useAuth()
    const { mainDivDimensions, streamDimensions, iframeDimensions } = useDimension()
    const { selectedWsURL, isMute, vidRefCallback } = useStream()

    return (
        <>
            {!authSessionIDGetLoading && !authSessionIDGetError && (
                <>
                    <Stack direction="row" sx={{ backgroundColor: colors.darkNavy }}>
                        <Stack sx={{ width: mainDivDimensions.width, height: mainDivDimensions.height }}>
                            <Box sx={{ position: "relative", width: "100%", height: GAMEBAR_HEIGHT }}>
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
                                        key={selectedWsURL}
                                        id={"remoteVideo"}
                                        muted={isMute}
                                        ref={vidRefCallback}
                                        autoPlay
                                        controls
                                        playsInline
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            aspectRatio: STREAM_ASPECT_RATIO_W_H.toString(),
                                            width: iframeDimensions.width,
                                            height: iframeDimensions.height,
                                        }}
                                    />

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
                                <Controls />
                            </Box>
                        </Stack>

                        <LiveChatSideButton />
                    </Stack>

                    <LiveChat />
                </>
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
                                            <AppInner />
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
