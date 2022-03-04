import { Box, Stack, ThemeProvider, Typography } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { DrawerProvider, GAMEBAR_CONSTANTS, WalletProvider } from "./components/GameBar"
import GameBar from "./components/GameBar"
import * as Sentry from "@sentry/react"
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
    WarMachineStats,
    Notifications,
    Maintenance,
    BattleCloseAlert,
} from "./components"
import { PASSPORT_SERVER_HOST, PASSPORT_WEB, SENTRY_CONFIG, SUPREMACY_PAGE, TOKEN_SALE_PAGE } from "./constants"
import {
    AuthProvider,
    DimensionProvider,
    GameProvider,
    OverlayTogglesProvider,
    SocketProvider,
    StreamProvider,
    useAuth,
    useDimension,
    useWebsocket,
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
    const { state } = useWebsocket()
    const { user, gameserverSessionID } = useAuth()
    const { mainDivDimensions, streamDimensions } = useDimension()
    const [haveSups, toggleHaveSups] = useToggle()
    const { reconnecting, isServerUp } = useWebsocket()

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
                        {!isServerUp ? (
                            <Maintenance />
                        ) : (
                            <>
                                <LoadMessage />
                                <BattleCloseAlert />
                                <Stream haveSups={haveSups} toggleHaveSups={toggleHaveSups} />

                                {user && haveSups && state === WebSocket.OPEN && (
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

            {/* Keep this. Just the under background, glimpse of it is visible when drawers open / close */}
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
