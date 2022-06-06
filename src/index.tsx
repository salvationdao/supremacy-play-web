import { Box, Stack } from "@mui/material"
import { TourProvider } from "@reactour/tour"
import * as Sentry from "@sentry/react"
import ReactDOM from "react-dom"
import { Buffer } from "buffer"
import { Action, ClientContextProvider, createClient } from "react-fetching-library"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { Bar, EarlyAccessWarning, GlobalSnackbar, Maintenance, RightDrawer } from "./components"
import { tourStyles } from "./components/HowToPlay/Tutorial/SetupTutorial"
import { LeftDrawer } from "./components/LeftDrawer/LeftDrawer"
import { GAME_SERVER_HOSTNAME, SENTRY_CONFIG, STAGING_ONLY, UNDER_MAINTENANCE } from "./constants"
import { BarProvider, SnackBarProvider, SupremacyProvider, useSupremacy, WalletProvider } from "./containers"
import { AuthProvider, UserUpdater } from "./containers/auth"
import { ThemeProvider } from "./containers/theme"
import { useToggle } from "./hooks"
import { NotFoundPage } from "./pages"
import { ROUTES_ARRAY, ROUTES_MAP } from "./routes"
import { colors } from "./theme/theme"
import { LoginRedirect } from "./pages/LoginRedirect"
import { ws } from "./containers/ws"

const AppInner = () => {
    const { isServerUp } = useSupremacy()
    const [understand, toggleUnderstand] = useToggle()

    return (
        <>
            <Stack
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
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
                    {STAGING_ONLY && <LeftDrawer />}

                    <Box
                        sx={{
                            flex: 1,
                            position: "relative",
                            height: "100%",
                            backgroundColor: colors.darkNavy,
                            overflow: "hidden",
                        }}
                    >
                        <EarlyAccessWarning onAcknowledged={() => toggleUnderstand(true)} />

                        {understand && isServerUp && !UNDER_MAINTENANCE && (
                            <Switch>
                                {ROUTES_ARRAY.map((r) => {
                                    const { id, path, exact, Component } = r
                                    return <Route key={id} path={path} exact={exact} component={Component} />
                                })}
                                <Redirect to={ROUTES_MAP.not_found_page.path} />
                            </Switch>
                        )}

                        {(isServerUp === false || UNDER_MAINTENANCE) && <Maintenance />}
                    </Box>

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

ws.Initialise({ defaultHost: GAME_SERVER_HOSTNAME })

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
            <SnackBarProvider>
                <ClientContextProvider client={client}>
                    <AuthProvider>
                        <SupremacyProvider>
                            <WalletProvider>
                                <BarProvider>
                                    <TourProvider {...tourProviderProps}>
                                        <UserUpdater />
                                        <BrowserRouter>
                                            <Switch>
                                                <Route path="/404" exact component={NotFoundPage} />
                                                <Route path="/login-redirect" exact component={LoginRedirect} />
                                                <Route path="" component={AppInner} />
                                            </Switch>
                                        </BrowserRouter>
                                    </TourProvider>
                                </BarProvider>
                            </WalletProvider>
                        </SupremacyProvider>
                    </AuthProvider>
                </ClientContextProvider>
            </SnackBarProvider>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
