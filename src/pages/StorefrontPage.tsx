import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { MysteryCratesStore } from "../components/Storefront/MysteryCratesStore/MysteryCratesStore"
import { PlayerAbilitiesStore } from "../components/Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { STAGING_OR_DEV_ONLY } from "../constants"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"

export enum STOREFRONT_TABS {
    MysteryCrates = "mystery-crates",
    Skins = "skins",
    Abilities = "abilities",
    Merchandise = "merchandise",
}

export const StorefrontPage = () => {
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const { type } = useParams<{ type: STOREFRONT_TABS }>()
    const [currentValue, setCurrentValue] = useState<STOREFRONT_TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(STOREFRONT_TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.storefront.path.replace(":type", STOREFRONT_TABS.MysteryCrates)}${location.hash}`)
    }, [history, location.hash, location.pathname, type])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: STOREFRONT_TABS) => {
            setCurrentValue(newValue)
            history.push(`${ROUTES_MAP.storefront.path.replace(":type", newValue)}${location.hash}`)
        },
        [history, location.hash],
    )

    if (!currentValue) return null

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "190rem" }}>
                <Box sx={{ maxWidth: "fit-content", mb: "1.1rem", border: `${theme.factionTheme.primary}CC .4rem solid` }}>
                    <Tabs
                        value={currentValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            flexShrink: 0,
                            color: (theme) => theme.factionTheme.primary,
                            minHeight: 0,
                            ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", py: ".8rem" },
                            ".Mui-selected": {
                                color: (theme) => `${theme.factionTheme.secondary} !important`,
                                background: (theme) => `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}BB)`,
                            },
                            ".MuiTabs-indicator": { display: "none" },
                        }}
                    >
                        <Tab label="MYSTERY CRATES" value={STOREFRONT_TABS.MysteryCrates} />
                        {STAGING_OR_DEV_ONLY && <Tab label="ABILITIES" value={STOREFRONT_TABS.Abilities} />}
                        {/* <Tab label="SKINS" value={STOREFRONT_TABS.Skins} disabled />
                        <Tab label="MERCHANDISE" disabled value={STOREFRONT_TABS.Merchandise} /> */}
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value={STOREFRONT_TABS.MysteryCrates}>
                    <MysteryCratesStore />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={STOREFRONT_TABS.Skins}>
                    COMING SOON!
                </TabPanel>
                <TabPanel currentValue={currentValue} value={STOREFRONT_TABS.Abilities}>
                    <PlayerAbilitiesStore />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={STOREFRONT_TABS.Merchandise}>
                    COMING SOON!
                </TabPanel>
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: STOREFRONT_TABS
    currentValue: STOREFRONT_TABS
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
