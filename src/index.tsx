import { Box, Button, Stack, ThemeProvider, Typography } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { DrawerProvider, GAMEBAR_CONSTANTS, WalletProvider } from "./components/GameBar"
import GameBar from "./components/GameBar"
import * as Sentry from "@sentry/react"
import moment from "moment"
import { useEffect, useState } from "react"
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
    WarMachineQueue,
    WarMachineStats,
    Notifications,
} from "./components"
import {
    CONTROLS_HEIGHT,
    PASSPORT_SERVER_HOST,
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
import { useInterval, useToggle } from "./hooks"
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

const Countdown = () => {
    const [endTime] = useState<Date>(new Date("2022-03-01T04:00:00.000Z"))
    const [, setTimeRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, 0))
        setHours(moment(endTime).diff(moment(), "hours"))
        setMinutes(moment(endTime).diff(moment(), "minutes") % 24)
        setSeconds(moment(endTime).diff(moment(), "seconds") % 60)
    }, delay)

    return (
        <Stack
            sx={{
                px: 4.2,
                py: 4,
                borderRadius: 1,
                zIndex: 999,
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    mb: 0.5,
                    color: colors.text,
                    fontFamily: "Nostromo Regular Bold",
                    textAlign: "center",
                }}
            >
                GAME RESUMES
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: colors.neonBlue,
                    fontFamily: "Nostromo Regular Medium",
                    textAlign: "center",
                }}
            >
                SUNDAY 3:30 PM (PERTH)
                <br />
                SUNDAY 7:30 AM PST
            </Typography>

            <Stack direction="row" justifyContent="space-around" sx={{ mt: 2 }}>
                <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
                    <Typography sx={{ color: colors.neonBlue }}>{hours}</Typography>
                    <Typography>HOURS</Typography>
                </Stack>
                <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
                    <Typography sx={{ color: colors.neonBlue }}>{minutes}</Typography>
                    <Typography>MINUTES</Typography>
                </Stack>
                <Stack alignItems="center" sx={{ px: 2, py: 1.5, backgroundColor: "#00000040" }}>
                    <Typography sx={{ color: colors.neonBlue }}>{seconds}</Typography>
                    <Typography>SECONDS</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

const AppInner = () => {
    const { user, gameserverSessionID } = useAuth()
    const { mainDivDimensions, streamDimensions } = useDimension()
    const [haveSups, toggleHaveSups] = useToggle()
    const [trailerEnded, toggleTrailerEnded] = useToggle(true)
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")

    if (haveSups !== "nello") {
        return (
            <Box
                sx={{
                    position: "fixed",
                    left: 0, top: 0,
                    height: "100vh", width: "100vw",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backgroundImage: "url(/mech.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "bottom right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Countdown />
            </Box>
        )
    }

    // Trailer video
    if (!trailerEnded) {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#000000",
                    "video::-internal-media-controls-overlay-cast-button": {
                        display: "none",
                    },
                }}
            >
                {watchedTrailer && (
                    <Button
                        variant="contained"
                        sx={{
                            position: "absolute",
                            top: 30,
                            right: 30,
                            zIndex: 99,
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0.7,
                            ":hover": { opacity: 0.8, backgroundColor: colors.darkNavy },
                        }}
                        onClick={() => toggleTrailerEnded(true)}
                    >
                        SKIP
                    </Button>
                )}

                <video
                    disablePictureInPicture
                    disableRemotePlayback
                    playsInline
                    controlsList="nodownload"
                    onEnded={() => {
                        setWatchedTrailer(true)
                        toggleTrailerEnded(true)
                        if (!watchedTrailer) localStorage.setItem("watchedTrailer", "true")
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
                tokenSalePage={`${TOKEN_SALE_PAGE}src/components/VotingSystem/FactionAbilities.tsx`}
                supremacyPage={SUPREMACY_PAGE}
                passportWeb={PASSPORT_WEB}
                passportServerHost={PASSPORT_SERVER_HOST}
                MechQueueComponent={<WarMachineQueue />}
            />
            <Countdown />
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
                        {/* Temporary */}

                        <LoadMessage />
                        <Stream haveSups={haveSups} toggleHaveSups={toggleHaveSups} />

                        {/*{user && haveSups && (*/}
                        {/*    <Box>*/}
                        {/*        <VotingSystem />*/}
                        {/*        <MiniMap />*/}
                        {/*        <Notifications />*/}
                        {/*        <LiveVotingChart />*/}
                        {/*        <WarMachineStats />*/}
                        {/*        <BattleEndScreen />*/}
                        {/*        <BattleHistory />*/}
                        {/*    </Box>*/}
                        {/*)}*/}
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
