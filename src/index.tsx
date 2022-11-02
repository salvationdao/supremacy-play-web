import { Box, Stack } from "@mui/material"
import { TourProvider } from "@reactour/tour"
import * as Sentry from "@sentry/react"
import { Buffer } from "buffer"
import { useEffect } from "react"
import ReactDOM from "react-dom"
import { ErrorBoundary } from "react-error-boundary"
import { Action, ClientContextProvider, createClient } from "react-fetching-library"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Bar, GlobalSnackbar, Maintenance } from "./components"
import { NavLinksDrawer } from "./components/Bar/NavLinks/NavLinksDrawer"
import { BottomNav } from "./components/BottomNav/BottomNav"
import { SupremacyWorldModal } from "./components/Common/BannersPromotions/SupremacyWorldModal"
import { LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { tourStyles } from "./components/Tutorial/SetupTutorial"
import { GAME_SERVER_HOSTNAME, SENTRY_CONFIG } from "./constants"
import {
    ChatProvider,
    DimensionProvider,
    GameProvider,
    GlobalNotificationsProvider,
    MiniMapProvider,
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
import { ErrorFallbackPage } from "./pages/ErrorFallbackPage"
import { LoginRedirect } from "./pages/LoginRedirect"
import { colors } from "./theme/theme"

const AppInner = () => {
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

    return (
        <>
            <SupremacyWorldModal />
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
                        <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>{isTraining ? <TutorialPage /> : <Maintenance />}</Box>

                        {isMobile && <BottomNav />}
                    </Stack>
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
                                                                                <MiniMapProvider>
                                                                                    <UserUpdater />
                                                                                    <Switch>
                                                                                        <Route path="/404" exact component={NotFoundPage} />
                                                                                        <Route path="/login-redirect" exact component={LoginRedirect} />
                                                                                        <Route path="" component={AppInner} />
                                                                                    </Switch>
                                                                                </MiniMapProvider>
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
