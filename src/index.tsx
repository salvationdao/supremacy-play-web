import { Box, Stack, ThemeProvider, Typography } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { DrawerProvider, GAMEBAR_CONSTANTS, WalletProvider } from "./components/GameBar"
import GameBar from "./components/GameBar"
import * as Sentry from "@sentry/react"
import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import {
    MiniMap,
    BattleEndScreen,
    BattleHistory,
    Controls,
    LeftSideBar,
    LiveVotingChart,
    LoadMessage,
    Stream,
    VotingSystem,
    WarMachineStats,
    Notifications,
    Maintenance,
} from "./components"
import {
    PASSPORT_SERVER_HOST,
    PASSPORT_WEB,
    SENTRY_CONFIG,
    SUPREMACY_PAGE,
    TOKEN_SALE_PAGE,
    TRAILER_VIDEO,
    UNDER_MAINTENANCE,
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
import { SvgPlay, TrailerThumbPNG } from "./assets"

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

    // Trailer stuff
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, toggleIsPlaying] = useToggle()

    // Temporarily disabled
    if (!watchedTrailer && watchedTrailer) {
        return (
            <Stack
                onClick={() => {
                    videoRef.current && videoRef.current.play()
                }}
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    cursor: isPlaying ? "auto" : "pointer",
                    backgroundColor: "#000000",
                    "video::-internal-media-controls-overlay-cast-button": {
                        display: "none",
                    },
                }}
            >
                {!isPlaying && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundImage: `url(${TrailerThumbPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="center"
                            spacing={1.2}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                px: 2.6,
                                py: 1,
                                borderRadius: 1,
                                backgroundColor: colors.darkerNeonBlue,
                                boxShadow: 10,
                            }}
                        >
                            <SvgPlay size="19px" />
                            <Typography variant="h6" sx={{ lineHeight: 2, fontWeight: "fontWeightBold" }}>
                                WATCH TRAILER TO ENTER
                            </Typography>
                        </Stack>
                    </Box>
                )}

                <video
                    ref={videoRef}
                    disablePictureInPicture
                    disableRemotePlayback
                    playsInline
                    controlsList="nodownload"
                    onPlay={() => toggleIsPlaying(true)}
                    onEnded={() => {
                        setWatchedTrailer(true)
                        if (!watchedTrailer) localStorage.setItem("watchedTrailer", "true")
                    }}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    controls={false}
                    autoPlay
                >
                    <source src={TRAILER_VIDEO} type="video/mp4" />
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
                passportServerHost={PASSPORT_SERVER_HOST}
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
                        {UNDER_MAINTENANCE ? (
                            <Maintenance />
                        ) : (
                            <>
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
                            </>
                        )}
                    </Box>
                </Stack>

                <Controls />
            </Stack>

            {/* Just the under background, glimpse of it is visible when drawers open / close */}
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
