import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { GameBar } from "./components/GameBar/GameBar"
import * as Sentry from "@sentry/react"
import { useEffect, useMemo, useState } from "react"
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
    GlobalSnackbar,
} from "./components"
import {
    DRAWER_TRANSITION_DURATION,
    GAME_BAR_HEIGHT,
    PASSPORT_SERVER_HOST,
    SENTRY_CONFIG,
    UNDER_MAINTENANCE,
} from "./constants"
import {
    GameServerAuthProvider,
    DimensionProvider,
    DrawerProvider,
    GameProvider,
    OverlayTogglesProvider,
    GameServerSocketProvider,
    StreamProvider,
    useGameServerAuth,
    useDimension,
    useGameServerWebsocket,
    WalletProvider,
    PassportServerSocketProvider,
    PassportServerAuthProvider,
    SnackBarProvider,
} from "./containers"
import { mergeDeep, shadeColor } from "./helpers"
import { useToggle } from "./hooks"
import { colors, theme } from "./theme/theme"
import { FactionThemeColor, UpdateTheme, User } from "./types"
import { UserData } from "./types/passport"
import { EarlyAccessWarning } from "./components/EarlyAccessWarning/EarlyAccessWarning"

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
    const { state, isServerUp } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const { mainDivDimensions, streamDimensions } = useDimension()
    const [haveSups, toggleHaveSups] = useToggle()

    return (
        <>
            <GameBar />
            <Stack
                sx={{
                    mt: `${GAME_BAR_HEIGHT}rem`,
                    width: mainDivDimensions.width,
                    height: mainDivDimensions.height,
                    transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,
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
                            transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,
                            clipPath: `polygon(0% 0%, calc(100% - 0%) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)`,
                        }}
                    >
                        {!isServerUp || UNDER_MAINTENANCE ? (
                            <Maintenance />
                        ) : (
                            <>
                                <LoadMessage />
                                <BattleCloseAlert />
                                <Stream haveSups={haveSups} toggleHaveSups={toggleHaveSups} />

                                {user && haveSups && state === WebSocket.OPEN && (
                                    <Box>
                                        <EarlyAccessWarning />
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

            <GlobalSnackbar />
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

    const [authLogin, setAuthLoginX] = useState<User | null>(null)
    const [passLogin, setPassLoginX] = useState<UserData | null>(null)

    const setAuthLogin = useMemo(() => {
        return (u: User) => {
            if (!authLogin && u) {
                setAuthLoginX(u)
            }
        }
    }, [authLogin])

    const setPassLogin = useMemo(() => {
        return (u: UserData) => {
            if (!passLogin && u) {
                setPassLoginX(u)
            }
        }
    }, [passLogin])

    useEffect(() => {
        setTheme((curTheme: Theme) => mergeDeep(curTheme, { factionTheme: factionColors }))
    }, [factionColors])

    return (
        <UpdateTheme.Provider value={{ updateTheme: setFactionColors }}>
            <ThemeProvider theme={currentTheme}>
                <SnackBarProvider>
                    <PassportServerSocketProvider initialState={{ host: PASSPORT_SERVER_HOST, login: passLogin }}>
                        <PassportServerAuthProvider initialState={{ setLogin: setPassLogin }}>
                            <GameServerSocketProvider initialState={{ login: authLogin }}>
                                <GameServerAuthProvider initialState={{ setLogin: setAuthLogin }}>
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
                                </GameServerAuthProvider>
                            </GameServerSocketProvider>
                        </PassportServerAuthProvider>
                    </PassportServerSocketProvider>
                </SnackBarProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

const testUserAgent = (): boolean => {
    if (/HeadlessChrome/.test(window.navigator.userAgent)) {
        // Headless
        return true
    } else {
        // Not Headless
        return false
    }
}

const testChromeWindow = (): boolean => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    if (eval.toString().length == 33 && !(window as any).chrome) {
        // Headless
        return true
    } else {
        // Not Headless
        return false
    }
}

const testNotificationPermissions = (callback: (res: boolean) => void) => {
    navigator.permissions
        .query({
            name: "notifications",
        })
        .then(function (permissionStatus) {
            if (Notification.permission === "denied" && permissionStatus.state === "prompt") {
                // Headless
                callback(true)
            } else {
                // Not Headless
                callback(false)
            }
        })
}

const testAppVersion = (): boolean => {
    const appVersion = navigator.appVersion
    return /headless/i.test(appVersion)
}

testNotificationPermissions((notResult) => {
    if (notResult || testUserAgent() || testChromeWindow() || testAppVersion()) {
        throw new Error("unable to configure fruit punch for circuitboard exposure.")
    }
})

ReactDOM.render(<App />, document.getElementById("root"))
