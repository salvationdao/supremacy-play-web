import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent, useEffect } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { MysteryCrates } from "../components/Storefront/MysteryCrates/MysteryCrates"
import { useAuth } from "../containers"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { fonts, siteZIndex } from "../theme/theme"

enum TABS {
    MYSTERY_CRATES = "mystery-crates",
    SKINS = "skins",
    ABILITIES = "abilities",
    MERCHANDISE = "merchandise",
}

export const StorefrontPage = () => {
    const { userID } = useAuth()

    return (
        <Stack
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            {!userID ? (
                <Stack spacing="1.3rem" alignItems="center" sx={{ alignSelf: "center", my: "auto", px: "3.6rem", py: "2.8rem", backgroundColor: "#00000060" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        You need to be logged in to view this page.
                    </Typography>
                    <ConnectButton width="12rem" />
                </Stack>
            ) : (
                <StorefrontPageInner />
            )}
        </Stack>
    )
}

const StorefrontPageInner = () => {
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const { type } = useParams<{ type: TABS }>()
    const [currentValue, setCurrentValue] = useState<TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.storefront.path.replace(":type", TABS.MYSTERY_CRATES)}${location.hash}`)
    }, [history, location.hash, location.pathname, type])

    const handleChange = (event: SyntheticEvent, newValue: TABS) => {
        setCurrentValue(newValue)
        history.push(`${ROUTES_MAP.storefront.path.replace(":type", newValue)}${location.hash}`)
    }

    if (!currentValue) return null

    return (
        <>
            <Stack sx={{ m: "1.5rem", height: "100%" }}>
                <Box sx={{ maxWidth: "fit-content", mb: ".8rem", border: `${theme.factionTheme.primary}CC .4rem solid` }}>
                    <Tabs
                        value={currentValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            flexShrink: 0,
                            color: (theme) => theme.factionTheme.primary,
                            minHeight: 0,
                            ".MuiTab-root": { minHeight: 0, fontSize: "1.2rem", py: "1rem" },
                            ".Mui-selected": {
                                color: (theme) => `${theme.factionTheme.secondary} !important`,
                                backgroundColor: (theme) => `${theme.factionTheme.primary}CC !important`,
                            },
                            ".MuiTabs-indicator": { display: "none" },
                        }}
                    >
                        <Tab label="MYSTERY CRATES" value={TABS.MYSTERY_CRATES} />
                        <Tab label="SKINS" value={TABS.SKINS} />
                        <Tab label="ABILITIES" value={TABS.ABILITIES} />
                        <Tab label="MERCHANDISE" value={TABS.MERCHANDISE} />
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value={TABS.MYSTERY_CRATES}>
                    <MysteryCrates />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={TABS.SKINS}>
                    SKINS
                </TabPanel>
                <TabPanel currentValue={currentValue} value={TABS.ABILITIES}>
                    ABILITIES
                </TabPanel>
                <TabPanel currentValue={currentValue} value={TABS.MERCHANDISE}>
                    MERCHANDISE
                </TabPanel>
            </Stack>
        </>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: TABS
    currentValue: TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in>
                <Box id={`storefront-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
