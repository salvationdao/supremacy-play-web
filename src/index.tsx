import { Box, LinearProgress, Stack, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import type {} from "@mui/x-date-pickers/themeAugmentation"
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
import { BottomNav } from "./components/BattleArena/BottomNav/BottomNav"
import { SupremacyWorldModal } from "./components/Common/BannersPromotions/SupremacyWorldModal"
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback"
import { LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { LoginRedirect } from "./components/LoginRedirect/LoginRedirect"
import { MainMenuNav } from "./components/MainMenuNav/MainMenuNav"
import { MarketingModal } from "./components/MarketingModal/MarketingModal"
import { NotFoundPage } from "./components/NotFoundPage/NotFoundPage"
import { AuthPage } from "./components/Signup/AuthPage"
import { EnlistPage } from "./components/Signup/EnlistPage"
import { tourStyles } from "./components/Tutorial/SetupTutorial"
import { TutorialPage } from "./components/Tutorial/TutorialPage"
import { GAME_SERVER_HOSTNAME, LINK, SENTRY_CONFIG } from "./constants"
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
import { FiatProvider } from "./containers/fiat"
import { FingerprintProvider } from "./containers/fingerprint"
import { OvenStreamProvider } from "./containers/oven"
import { ThemeProvider } from "./containers/theme"
import { ws } from "./containers/ws"
import { useToggle } from "./hooks"
import { Routes, RouteSingleID } from "./routes"
import { colors, fonts } from "./theme/theme"

const SUPREMACY_WORLD_SALE_END_DATE = new Date("Nov 04 2022 00:00:00 GMT+0800")

const AppInner = () => {
    const history = useHistory()
    const isTutorial = location.pathname.includes("/tutorial")
    const { isServerDown, serverConnectedBefore, firstConnectTimedOut } = useSupremacy()
    const { isMobile } = useMobile()
    const { userID, factionID } = useAuth()
    const [showLoading, toggleShowLoading] = useToggle(true)

    // Makes the loading screen to show for at least 2 seconds
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

    // Loading progress bar
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

                {new Date().getTime() < SUPREMACY_WORLD_SALE_END_DATE.getTime() && <SupremacyWorldModal />}
                <MainMenuNav />

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
                    {!isTutorial && <LeftDrawer />}

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
                            <MarketingModal />

                            {isTutorial ? (
                                <TutorialPage />
                            ) : !isServerDown ? (
                                <Switch>
                                    {Routes.map((route) => {
                                        const { id, path, exact, Component, restrictions, enable, tabTitle } = route

                                        if (!enable) return null

                                        let PageComponent = Component

                                        // Apply restrictions on the route (need auth, faction etc.)
                                        if (restrictions?.requireAuth && !userID) {
                                            const Comp = () => <AuthPage authTitle={restrictions.authTitle} authDescription={restrictions.authDescription} />
                                            PageComponent = Comp
                                        } else if (userID && restrictions?.requireFaction && !factionID) {
                                            PageComponent = EnlistPage
                                        }

                                        if (!PageComponent) return null

                                        return (
                                            <Route key={id} path={path} exact={exact}>
                                                <Helmet>
                                                    <title>{tabTitle}</title>
                                                    <link rel="canonical" href={`${LINK}/${path}`} />
                                                </Helmet>
                                                <PageComponent />
                                            </Route>
                                        )
                                    })}

                                    <Redirect to={Routes.find((route) => route.id === RouteSingleID.NotFound)?.path || "/"} />
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
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                                                                                <MiniMapPixiProvider>
                                                                                    <FiatProvider>
                                                                                        <UserUpdater />
                                                                                        <Switch>
                                                                                            <Route path="/404" exact component={NotFoundPage} />
                                                                                            <Route path="/login-redirect" exact component={LoginRedirect} />
                                                                                            <Route path="" component={AppInner} />
                                                                                        </Switch>
                                                                                    </FiatProvider>
                                                                                </MiniMapPixiProvider>
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
            </LocalizationProvider>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
