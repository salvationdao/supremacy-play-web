import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { KeycardsMarket } from "../components/Marketplace/KeycardsMarket/KeycardsMarket"
import { MysteryCratesMarket } from "../components/Marketplace/MysteryCratesMarket/MysteryCratesMarket"
import { WarMachinesMarket } from "../components/Marketplace/WarMachinesMarket/WarMachinesMarket"
import { WeaponsMarket } from "../components/Marketplace/WeaponsMarket/WeaponsMarket"
import { HistoryMarket } from "../components/Marketplace/HistoryMarket/HistoryMarket"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"
import { MysteryCrateBanner } from "../components/Common/PageHeaderBanners/MysteryCrateBanner"
import { ClipThing } from "../components"

export enum MARKETPLACE_TABS {
    History = "history",
    WarMachines = "war-machines",
    Weapons = "weapons",
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

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

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
                <Stack direction="row" flexWrap="wrap" sx={{ mb: "1.1rem", gap: "1.2rem" }}>
                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        corners={{ topRight: true, bottomRight: true }}
                        backgroundColor={backgroundColor}
                        sx={{ maxWidth: "fit-content" }}
                    >
                        <Box sx={{ height: "100%" }}>
                            <Tabs
                                value={currentValue}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    flexShrink: 0,
                                    color: primaryColor,
                                    minHeight: 0,
                                    ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "8rem", width: "10rem" },
                                    ".Mui-selected": {
                                        color: `${secondaryColor} !important`,
                                        background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                                    },
                                    ".MuiTabs-indicator": { display: "none" },
                                    ".MuiTabScrollButton-root": { display: "none" },
                                }}
                            >
                                <Tab label="HISTORY" value={MARKETPLACE_TABS.History} />

                                <Tab label="WAR MACHINES" value={MARKETPLACE_TABS.WarMachines} />

                                <Tab label="WAR MACHINES" value={MARKETPLACE_TABS.WarMachines} />

                                <Tab label="KEY CARDS" value={MARKETPLACE_TABS.Keycards} />

                                <Tab label="MYSTERY CRATES" value={MARKETPLACE_TABS.MysteryCrates} />
                            </Tabs>
                        </Box>
                    </ClipThing>

                    <MysteryCrateBanner />
                </Stack>

                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.History}>
                    <HistoryMarket />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.WarMachines}>
                    <WarMachinesMarket />
                </TabPanel>

                <TabPanel currentValue={currentValue} value={MARKETPLACE_TABS.Weapons}>
                    <WeaponsMarket />
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
