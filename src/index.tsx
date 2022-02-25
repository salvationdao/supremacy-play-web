import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { DrawerProvider, GameBar, GAMEBAR_CONSTANTS, WalletProvider } from "@ninjasoftware/passport-gamebar"
import * as Sentry from "@sentry/react"
import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import {
    BattleEndScreen,
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
                        <Stream />

                        {user && user.sups > 0 && (
                            <Box sx={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                                <LoadMessage />
                                <VotingSystem />
                                <MiniMap />
                                <Notifications />
                                <LiveVotingChart />
                                <WarMachineStats />
                                <BattleEndScreen />
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
