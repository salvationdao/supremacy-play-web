import { Box, LinearProgress, Stack, Typography } from "@mui/material"
import { TourProvider } from "@reactour/tour"
import * as Sentry from "@sentry/react"
import { Buffer } from "buffer"
import { useEffect } from "react"
import ReactDOM from "react-dom"
import { Action, ClientContextProvider, createClient } from "react-fetching-library"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { SupremacyPNG } from "./assets"
import { Bar, GlobalSnackbar, Maintenance, RightDrawer } from "./components"
import { BottomNav } from "./components/BottomNav/BottomNav"
import { tourStyles } from "./components/HowToPlay/Tutorial/SetupTutorial"
import { NavLinksDrawer } from "./components/Bar/NavLinks/NavLinksDrawer"
import { GAME_SERVER_HOSTNAME, SENTRY_CONFIG, UNDER_MAINTENANCE } from "./constants"
import {
    ChatProvider,
    DimensionProvider,
    GameProvider,
    GlobalNotificationsProvider,
    MiniMapProvider,
    MobileProvider,
    OverlayTogglesProvider,
    StreamProvider,
    SupremacyProvider,
    useMobile,
    useSupremacy,
    WalletProvider,
} from "./containers"
import { AuthProvider, useAuth, UserUpdater } from "./containers/auth"
import { FingerprintProvider } from "./containers/fingerprint"
import { ThemeProvider } from "./containers/theme"
import { ws } from "./containers/ws"
import { useToggle } from "./hooks"
import { NotFoundPage } from "./pages"
import { AuthPage } from "./pages/AuthPage"
import { EnlistPage } from "./pages/EnlistPage"
import { LoginRedirect } from "./pages/LoginRedirect"
import { ROUTES_ARRAY, ROUTES_MAP } from "./routes"
import { colors, fonts } from "./theme/theme"
import { LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { ArenaListener, ArenaProvider } from "./containers/arena"
import { HotkeyProvider } from "./containers/hotkeys"

const AppInner = () => {
    const { isServerDown, serverConnectedBefore } = useSupremacy()
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

    if (!serverConnectedBefore || showLoading) {
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

                    <LeftDrawer />

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
                            {!isServerDown && !UNDER_MAINTENANCE ? (
                                <Switch>
                                    {ROUTES_ARRAY.map((r) => {
                                        const { id, path, exact, Component, requireAuth, requireFaction, authTitle, authDescription, enable } = r
                                        if (!enable) return null

                                        let component = Component
                                        if (requireAuth && !userID) {
                                            const Comp = () => <AuthPage authTitle={authTitle} authDescription={authDescription} />
                                            component = Comp
                                        } else if (requireFaction && !factionID) {
                                            component = EnlistPage
                                        }
                                        return <Route key={id} path={path} exact={exact} component={component} />
                                    })}
                                    <Redirect to={ROUTES_MAP.not_found_page.path} />
                                </Switch>
                            ) : (
                                <Maintenance />
                            )}
                        </Box>

                        {isMobile && <BottomNav />}
                    </Stack>

                    <RightDrawer />
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
    disableDotsNavigation: true,
}

const App = () => {
    return (
        <ThemeProvider>
            <FingerprintProvider>
                <GlobalNotificationsProvider>
                    <ClientContextProvider client={client}>
                        <SupremacyProvider>
                            <AuthProvider>
                                <BrowserRouter>
                                    <ChatProvider>
                                        <WalletProvider>
                                            <TourProvider {...tourProviderProps}>
                                                <StreamProvider>
                                                    <ArenaProvider>
                                                        <ArenaListener />
                                                        <GameProvider>
                                                            <MobileProvider>
                                                                <DimensionProvider>
                                                                    <OverlayTogglesProvider>
                                                                        <MiniMapProvider>
                                                                            <HotkeyProvider>
                                                                                <UserUpdater />
                                                                                <Switch>
                                                                                    <Route path="/404" exact component={NotFoundPage} />
                                                                                    <Route path="/login-redirect" exact component={LoginRedirect} />
                                                                                    <Route path="" component={AppInner} />
                                                                                </Switch>
                                                                            </HotkeyProvider>
                                                                        </MiniMapProvider>
                                                                    </OverlayTogglesProvider>
                                                                </DimensionProvider>
                                                            </MobileProvider>
                                                        </GameProvider>
                                                    </ArenaProvider>
                                                </StreamProvider>
                                            </TourProvider>
                                        </WalletProvider>
                                    </ChatProvider>
                                </BrowserRouter>
                            </AuthProvider>
                        </SupremacyProvider>
                    </ClientContextProvider>
                </GlobalNotificationsProvider>
            </FingerprintProvider>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
