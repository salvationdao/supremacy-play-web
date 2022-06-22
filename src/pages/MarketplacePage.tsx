import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { KeycardsMarket } from "../components/Marketplace/KeycardsMarket/KeycardsMarket"
import { MysteryCratesMarket } from "../components/Marketplace/MysteryCratesMarket/MysteryCratesMarket"
import { WarMachinesMarket } from "../components/Marketplace/WarMachinesMarket/WarMachinesMarket"
import { YourEventsMarket } from "../components/Marketplace/YourEventsMarket/YourEventsMarket"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { colors, siteZIndex } from "../theme/theme"

export enum MARKETPLACE_TABS {
    YourEvents = "your-events",
    WarMachines = "war-machines",
    Keycards = "key-cards",
    MysteryCrates = "mystery-crates",
}

export const MarketplacePage = () => {
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const { type } = useParams<{ type: MARKETPLACE_TABS }>()
    const [currentValue, setCurrentValue] = useState<MARKETPLACE_TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(MARKETPLACE_TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.marketplace.path.replace(":type", MARKETPLACE_TABS.WarMachines)}${location.hash}`)
    }, [history, location.hash, location.pathname, type])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: MARKETPLACE_TABS) => {
            setCurrentValue(newValue)
            history.push(`${ROUTES_MAP.marketplace.path.replace(":type", newValue)}${location.hash}`)
        },
        [history, location.hash],
    )

    if (!currentValue) return null

    const primaryColor = currentValue === MARKETPLACE_TABS.YourEvents ? colors.marketSold : theme.factionTheme.primary
    const secondaryColor = currentValue === MARKETPLACE_TABS.YourEvents ? "#FFFFFF" : theme.factionTheme.secondary

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
                <Box sx={{ maxWidth: "fit-content", mb: "1.1rem", border: `${primaryColor}CC .4rem solid` }}>
                    <Tabs
                        value={currentValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            flexShrink: 0,
                            color: primaryColor,
                            minHeight: 0,
                            ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", py: ".8rem" },
                            ".Mui-selected": {
                                color: `${secondaryColor} !important`,
                                background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                            },
                            ".MuiTabs-indicator": { display: "none" },
                        }}
                    >
                        <Tab
                            label="YOUR EVENTS"
                            value={MARKETPLACE_TABS.YourEvents}
                            sx={{ color: colors.marketSold, backgroundColor: `${colors.marketSold}20` }}
                        />
                        <Tab label="WAR MACHINES" value={MARKETPLACE_TABS.WarMachines} />
                        <Tab label="KEY CARDS" value={MARKETPLACE_TABS.Keycards} />
                        <Tab label="MYSTERY CRATES" value={MARKETPLACE_TABS.MysteryCrates} />
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.YourEvents}>
                    <YourEventsMarket />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.WarMachines}>
                    <WarMachinesMarket />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.Keycards}>
                    <KeycardsMarket />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.MysteryCrates}>
                    <MysteryCratesMarket />
                </TabPanel>
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: MARKETPLACE_TABS
    currentValue: MARKETPLACE_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in>
                <Box id={`marketplace-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
