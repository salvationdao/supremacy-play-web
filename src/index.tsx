import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { DrawerProvider, GameBar, GAMEBAR_CONSTANTS, WalletProvider } from "@ninjasoftware/passport-gamebar"
import * as Sentry from "@sentry/react"
import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import {
    BattleEndScreen,
    BattleHistory,
    Controls,
    LeftSideBar,
    LiveVotingChart,
    LoadMessage,
    MiniMap,
    Notifications,
    Stream,
    VotingSystem,
    WarMachineQueue,
    WarMachineStats,
} from "./components"
import {
    CONTROLS_HEIGHT,
    PASSPORT_SERVER_HOSTNAME,
    PASSPORT_WEB,
    SENTRY_CONFIG,
    SUPREMACY_PAGE,
    TOKEN_SALE_PAGE,
} from "./constants"
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    OverlayTogglesProvider,
    SocketProvider,
    StreamProvider,
    useAuth,
    useDimension,
} from "./containers"
import { mergeDeep, shadeColor } from "./helpers"
import { useToggle } from "./hooks"
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
    const { user, gameserverSessionID } = useAuth()
    const { mainDivDimensions, streamDimensions } = useDimension()
    const [haveSups, toggleHaveSups] = useToggle()
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")

    if (!watchedTrailer) {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#000000",
                    "video::-internal-media-controls-overlay-cast-button": {
                        display: "none",
                    },
                }}
            >
                <video
                    disablePictureInPicture
                    disableRemotePlayback
                    playsInline
                    controlsList="nodownload"
                    // controls={false}
                    onEnded={() => {
                        setWatchedTrailer(true)
                        localStorage.setItem("watchedTrailer", "true")
                    }}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    controls
                    autoPlay
                >
                    <source
                        src="https://player.vimeo.com/progressive_redirect/playback/681913587/rendition/1080p?loc=external&signature=6d5bf3570be8bd5e9e57a6a786964a99d067957fbcf9e3a40b6914c085c9b3e9"
                        type="video/mp4"
                    />
                </video>
            </Stack>
        )
    }

    return (
        <>
            <GameBar
                barPosition="top"
                gameserverSessionID={gameserverSessionID}
                tokenSalePage={TOKEN_SALE_PAGE}
                supremacyPage={SUPREMACY_PAGE}
                passportWeb={PASSPORT_WEB}
                passportServerHost={PASSPORT_SERVER_HOSTNAME}
                MechQueueComponent={<WarMachineQueue />}
            />

            <Stack
                sx={{
                    mt: `${GAMEBAR_CONSTANTS.gameBarHeight}px`,
                    width: mainDivDimensions.width,
                    height: mainDivDimensions.height,
                    transition: `all ${GAMEBAR_CONSTANTS.drawerTransitionDuration / 1000}s`,
                }}
            >
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
                            backgroundColor: colors.darkNavy,
                            transition: `all ${GAMEBAR_CONSTANTS.drawerTransitionDuration / 1000}s`,
                            clipPath: `polygon(0% 0%, calc(100% - 0%) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)`,
                        }}
                    >
                        <LoadMessage />
                        <Stream haveSups={haveSups} toggleHaveSups={toggleHaveSups} />

                        {user && haveSups && (
                            <Box>
                                <VotingSystem />
                                <MiniMap />
                                <Notifications />
                                <LiveVotingChart />
                                <WarMachineStats />
                                <BattleEndScreen />
                                <BattleHistory />
                            </Box>
                        )}
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

            {/* Just the under background, visible when drawers open / close */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor:
                        user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
                    zIndex: -1,
                }}
            />
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
                                <DrawerProvider>
                                    <GameProvider>
                                        <DimensionProvider>
                                            <OverlayTogglesProvider>
                                                <AppInner />
                                            </OverlayTogglesProvider>
                                        </DimensionProvider>
                                    </GameProvider>
                                </DrawerProvider>
                            </WalletProvider>
                        </StreamProvider>
                    </AuthProvider>
                </SocketProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
