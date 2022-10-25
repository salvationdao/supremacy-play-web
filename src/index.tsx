import { Box, Drawer, Fade, LinearProgress, Stack, Typography } from "@mui/material"
import { TourProvider } from "@reactour/tour"
import * as Sentry from "@sentry/react"
import { Buffer } from "buffer"
import { useEffect } from "react"
import ReactDOM from "react-dom"
import { ErrorBoundary } from "react-error-boundary"
import { Action, ClientContextProvider, createClient } from "react-fetching-library"
import ReactGA from "react-ga4"
import { Helmet } from "react-helmet"
import { BrowserRouter, Redirect, Route, Switch, useHistory } from "react-router-dom"
import { SupremacyPNG } from "./assets"
import { Bar, GlobalSnackbar, Maintenance, RightDrawer } from "./components"
import { NavLinksDrawer } from "./components/Bar/NavLinks/NavLinksDrawer"
import { BottomNav } from "./components/BottomNav/BottomNav"
import { LEFT_DRAWER_WIDTH, LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { tourStyles } from "./components/Tutorial/SetupTutorial"
import { DRAWER_TRANSITION_DURATION, GAME_SERVER_HOSTNAME, LINK, SENTRY_CONFIG } from "./constants"
import {
    ChatProvider,
    DimensionProvider,
    GameProvider,
    GlobalNotificationsProvider,
    MiniMapPixiProvider,
    MobileProvider,
    SupremacyProvider,
    UiProvider,
    useMobile,
    useSupremacy,
    WalletProvider,
} from "./containers"
import { ArenaListener, ArenaProvider } from "./containers/arena"
import { AuthProvider, useAuth, UserUpdater } from "./containers/auth"
import { FingerprintProvider } from "./containers/fingerprint"
import { HotkeyProvider } from "./containers/hotkeys"
import { OvenStreamProvider } from "./containers/oven"
import { ThemeProvider } from "./containers/theme"
import { ws } from "./containers/ws"
import { useToggle } from "./hooks"
import { NotFoundPage, TutorialPage } from "./pages"
import { AuthPage } from "./pages/AuthPage"
import { EnlistPage } from "./pages/EnlistPage"
import { ErrorFallbackPage } from "./pages/ErrorFallbackPage"
import { LoginRedirect } from "./pages/LoginRedirect"
import { LEFT_DRAWER_ARRAY, ROUTES_ARRAY, ROUTES_MAP } from "./routes"
import { colors, fonts, siteZIndex } from "./theme/theme"

const AppInner = () => {
    const history = useHistory()
    const isTraining = location.pathname.includes("/training")
    const { isServerDown, serverConnectedBefore, firstConnectTimedOut } = useSupremacy()
    const { isMobile } = useMobile()
    const { userID, factionID } = useAuth()
    const [showLoading, toggleShowLoading] = useToggle(true)

    // Makes the loading screen to show for AT LEAST 1 second
    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleShowLoading(false)
        }, 2000)

        return () => clearTimeout(timeout)
    }, [toggleShowLoading])

    // Record page changes to Google Analytics
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search })
        history.listen((location, action) => {
            if (action === "PUSH") {
                ReactGA.send({ hitType: "pageview", page: location.pathname + location.search })
            }
        })
    }, [history])

    if ((!serverConnectedBefore && !firstConnectTimedOut) || showLoading) {
        return (
            <Stack
                spacing="3rem"
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "fixed",
                    width: "100vw",
                    height: "100%",
                    backgroundColor: (theme) => theme.factionTheme.background,
                }}
            >
                <Box
                    sx={{
                        width: "9rem",
                        height: "9rem",
                        background: `url(${SupremacyPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                />

                <Stack alignItems="center" spacing=".8rem">
                    <Typography variant="body2" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        CONNECTING...
                    </Typography>
                    <LinearProgress
                        sx={{
                            width: "13rem",
                            height: "9px",
                            backgroundColor: `${colors.gold}15`,
                            ".MuiLinearProgress-bar": { backgroundColor: colors.gold },
                        }}
                    />
                </Stack>
            </Stack>
        )
    }

    return (
        <>
            <Stack
                sx={{
                    position: "fixed",
                    width: "100vw",
                    height: "100%",
                    backgroundColor: (theme) => theme.factionTheme.background,
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
                    <NavLinksDrawer />
                    {!isTraining && <LeftDrawer />}

                    <Stack
                        sx={{
                            flex: 1,
                            position: "relative",
                            height: "100%",
                            backgroundColor: colors.darkNavy,
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
                            {isTraining ? (
                                <TutorialPage />
                            ) : !isServerDown ? (
                                <Switch>
                                    {ROUTES_ARRAY.map((r) => {
                                        const { id, path, exact, Component, requireAuth, requireFaction, authTitle, authDescription, enable, pageTitle } = r
                                        if (!enable) return null
                                        let PageComponent = Component
                                        if (requireAuth && !userID) {
                                            const Comp = () => <AuthPage authTitle={authTitle} authDescription={authDescription} />
                                            PageComponent = Comp
                                        } else if (userID && requireFaction && !factionID) {
                                            PageComponent = EnlistPage
                                        }
                                        if (!PageComponent) return null
                                        return (
                                            <Route key={id} path={path} exact={exact}>
                                                <Helmet>
                                                    <title>{pageTitle}</title>
                                                    <link rel="canonical" href={`${LINK}/${path}`} />
                                                </Helmet>
                                                <PageComponent />
                                            </Route>
                                        )
                                    })}
                                    <Redirect to={ROUTES_MAP.not_found_page.path} />
                                </Switch>
                            ) : (
                                <Maintenance />
                            )}
                        </Box>

                        {isMobile && <BottomNav />}
                    </Stack>

                    {!isServerDown && <RightDrawer />}
                </Stack>
            </Stack>

            <GlobalSnackbar />
        </>
    )
}

if (SENTRY_CONFIG) {
    Sentry.init({
        dsn: SENTRY_CONFIG.DSN,
        release: SENTRY_CONFIG.RELEASE,
        environment: SENTRY_CONFIG.ENVIRONMENT,
        tracesSampleRate: SENTRY_CONFIG.SAMPLERATE,
    })
}

window.Buffer = Buffer

if (window.location.host.includes("localhost")) {
    alert("Please don't run on localhost.")
    throw new Error("Please don't run on localhost.")
}

const prefixURL = (prefix: string) => () => async (action: Action) => {
    return {
        ...action,
        headers: {
            "X-AUTH-TOKEN": localStorage.getItem("auth-token") || "",
            ...action.headers,
        },
        endpoint: action.endpoint.startsWith("http") ? action.endpoint : `${prefix}${action.endpoint}`,
    }
}

const client = createClient({
    //None of the options is required
    requestInterceptors: [prefixURL(`${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api`)],
    responseInterceptors: [],
})

ws.Initialize({ defaultHost: GAME_SERVER_HOSTNAME })

const tourProviderProps = {
    children: <AppInner />,
    steps: [],
    padding: 2,
    styles: tourStyles,
    showBadge: false,
    disableKeyboardNavigation: false,
    disableDotsNavigation: false,
}

const App = () => {
    return (
        <ThemeProvider>
            <ErrorBoundary FallbackComponent={ErrorFallbackPage}>
                <FingerprintProvider>
                    <GlobalNotificationsProvider>
                        <ClientContextProvider client={client}>
                            <BrowserRouter>
                                <SupremacyProvider>
                                    <AuthProvider>
                                        <ChatProvider>
                                            <WalletProvider>
                                                <TourProvider {...tourProviderProps}>
                                                    <OvenStreamProvider>
                                                        <ArenaProvider>
                                                            <ArenaListener />
                                                            <MobileProvider>
                                                                <DimensionProvider>
                                                                    <UiProvider>
                                                                        <GameProvider>
                                                                            <HotkeyProvider>
                                                                                <MiniMapPixiProvider>
                                                                                    <UserUpdater />
                                                                                    <Switch>
                                                                                        <Route path="/404" exact component={NotFoundPage} />
                                                                                        <Route path="/login-redirect" exact component={LoginRedirect} />
                                                                                        <Route path="" component={AppInner} />
                                                                                    </Switch>
                                                                                </MiniMapPixiProvider>
                                                                            </HotkeyProvider>
                                                                        </GameProvider>
                                                                    </UiProvider>
                                                                </DimensionProvider>
                                                            </MobileProvider>
                                                        </ArenaProvider>
                                                    </OvenStreamProvider>
                                                </TourProvider>
                                            </WalletProvider>
                                        </ChatProvider>
                                    </AuthProvider>
                                </SupremacyProvider>
                            </BrowserRouter>
                        </ClientContextProvider>
                    </GlobalNotificationsProvider>
                </FingerprintProvider>
            </ErrorBoundary>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
