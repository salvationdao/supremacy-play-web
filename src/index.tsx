import { Box, Stack, ThemeProvider } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { ProviderProps, TourProvider } from "@reactour/tour"
import * as Sentry from "@sentry/react"
import { useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, useLocation } from "react-router-dom"
import { DrawerButtons, GameBar, GlobalSnackbar, RightDrawer, tourStyles, tutorialNextBtn, tutorialPrevButton } from "./components"
import { LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { PageWrapper } from "./components/PageWrapper/PageWrapper"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, PASSPORT_SERVER_HOST, SENTRY_CONFIG } from "./constants"
import {
    DimensionProvider,
    DrawerProvider,
    GameProvider,
    GameServerAuthProvider,
    GameServerSocketProvider,
    OverlayTogglesProvider,
    PassportServerAuthProvider,
    PassportServerSocketProvider,
    SnackBarProvider,
    StreamProvider,
    useDimension,
    useGameServerAuth,
    WalletProvider,
} from "./containers"
import { mergeDeep, shadeColor } from "./helpers"
import { Routes } from "./routes"
import { colors, theme } from "./theme/theme"
import { FactionThemeColor, UpdateTheme, User } from "./types"
import { UserData } from "./types/passport"

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
    const { user } = useGameServerAuth()
    const { mainDivDimensions } = useDimension()
    const location = useLocation()

    // Dont show gamebar and left nav in 404
    if (location.pathname === "/404") {
        return <Routes />
    }

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
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        position: "relative",
                        width: "100%",
                        backgroundColor: colors.darkNavyBlue,
                        overflow: "hidden",
                        justifyContent: "space-between",
                        "&>*": {
                            flexShrink: 0,
                        },
                    }}
                >
                    {process.env.NODE_ENV === "development" && <LeftDrawer />}
                    <PageWrapper>
                        <Routes />
                    </PageWrapper>
                    <DrawerButtons />
                    <RightDrawer />
                </Box>
            </Stack>

            {/* Keep this. Just the under background, glimpse of it is visible when drawers open / close */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
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

    const tourProviderProps: ProviderProps = {
        children: <AppInner />,
        steps: [],
        styles: tourStyles,
        nextButton: tutorialNextBtn,
        prevButton: tutorialPrevButton,
        showBadge: false,
        disableKeyboardNavigation: true,
        disableDotsNavigation: true,
        afterOpen: () => {
            if (!localStorage.getItem("visited")) {
                localStorage.setItem("visited", "1")
            }
        },
    }

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
                                                            <TourProvider {...tourProviderProps}>
                                                                <BrowserRouter>
                                                                    <AppInner />
                                                                </BrowserRouter>
                                                            </TourProvider>
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
