import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import * as Sentry from "@sentry/react"
import { useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Redirect, Switch, useLocation } from "react-router-dom"
import { Bar, GlobalSnackbar, LoadMessage, RightDrawer, Maintenance, EarlyAccessWarning } from "./components"
import { LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { PASSPORT_SERVER_HOST, SENTRY_CONFIG, UNDER_MAINTENANCE } from "./constants"
import {
    RightDrawerProvider,
    GameServerAuthProvider,
    GameServerSocketProvider,
    PassportServerAuthProvider,
    PassportServerSocketProvider,
    SnackBarProvider,
    SupremacyProvider,
    useGameServerAuth,
    useGameServerWebsocket,
    WalletProvider,
} from "./containers"
import { mergeDeep, shadeColor } from "./helpers"
import { useToggle } from "./hooks"
import { NotFoundPage } from "./pages"
import { ROUTES_ARRAY, ROUTES_MAP } from "./routes"
import { colors, theme } from "./theme/theme"
import { FactionThemeColor, UpdateTheme, User } from "./types"
import { UserData } from "./types/passport"

if (SENTRY_CONFIG) {
    Sentry.init({
        dsn: SENTRY_CONFIG.DSN,
        release: SENTRY_CONFIG.RELEASE,
        environment: SENTRY_CONFIG.ENVIRONMENT,
        tracesSampleRate: SENTRY_CONFIG.SAMPLERATE,
    })
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
                                    <SupremacyProvider>
                                        <WalletProvider>
                                            <RightDrawerProvider>
                                                <BrowserRouter>
                                                    <AppInner />
                                                </BrowserRouter>
                                            </RightDrawerProvider>
                                        </WalletProvider>
                                    </SupremacyProvider>
                                </GameServerAuthProvider>
                            </GameServerSocketProvider>
                        </PassportServerAuthProvider>
                    </PassportServerSocketProvider>
                </SnackBarProvider>
            </ThemeProvider>
        </UpdateTheme.Provider>
    )
}

const AppInner = () => {
    const { isServerUp } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const location = useLocation()
    const [understand, toggleUnderstand] = useToggle()

    // Dont show gamebar and left nav in 404
    if (location.pathname === "/404") return <NotFoundPage />

    if (!isServerUp || UNDER_MAINTENANCE) return <Maintenance />

    return (
        <>
            <Stack
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
                }}
            >
                <Bar />

                <Stack
                    direction="row"
                    sx={{
                        position: "relative",
                        flex: 1,
                        width: "100vw",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        "& > *": {
                            flexShrink: 0,
                        },
                    }}
                >
                    <LeftDrawer />

                    <Box
                        sx={{
                            flex: 1,
                            position: "relative",
                            height: "100%",
                            backgroundColor: colors.darkNavy,
                            overflow: "hidden",
                        }}
                    >
                        <LoadMessage />
                        <EarlyAccessWarning onAcknowledged={() => toggleUnderstand(true)} />

                        {understand && (
                            <Switch>
                                {ROUTES_ARRAY.map((r) => {
                                    const { id, path, exact, Component } = r
                                    return <Route key={id} path={path} exact={exact} component={Component} />
                                })}
                                <Redirect to={ROUTES_MAP.not_found_page.path} />
                            </Switch>
                        )}
                    </Box>

                    <RightDrawer />
                </Stack>
            </Stack>

            <GlobalSnackbar />
        </>
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

const testAppVersion = (): boolean => {
    const appVersion = navigator.appVersion
    return /headless/i.test(appVersion)
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

testNotificationPermissions((notResult) => {
    if (notResult || testUserAgent() || testChromeWindow() || testAppVersion()) {
        throw new Error("unable to configure fruit punch for circuitboard exposure.")
    }
})

ReactDOM.render(<App />, document.getElementById("root"))
