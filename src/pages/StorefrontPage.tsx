import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { HangarBg } from "../assets"
import { ClipThing } from "../components"
import { MysteryCrateBanner } from "../components/Common/PageHeaderBanners/MysteryCrateBanner"
import { MysteryCratesStore } from "../components/Storefront/MysteryCratesStore/MysteryCratesStore"
import { PlayerAbilitiesStore } from "../components/Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { useTheme } from "../containers/theme"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"
import { useAuth } from "../containers"
import { FeatureName } from "../types"

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
    const { userHasFeature } = useAuth()
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
                <Stack direction="row" alignItems="center" sx={{ mb: "1.1rem", gap: "1.2rem" }}>
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
                                    ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "6rem", width: "10rem" },
                                    ".Mui-selected": {
                                        color: `${secondaryColor} !important`,
                                        background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                                    },
                                    ".MuiTabs-indicator": { display: "none" },
                                    ".MuiTabScrollButton-root": { display: "none" },
                                }}
                            >
                                <Tab label="MYSTERY CRATES" value={STOREFRONT_TABS.MysteryCrates} />

                                {userHasFeature(FeatureName.playerAbility) && <Tab label="ABILITIES" value={STOREFRONT_TABS.Abilities} />}
                            </Tabs>
                        </Box>
                    </ClipThing>

                    <MysteryCrateBanner />
                </Stack>

                <TabPanel currentValue={currentValue} value={STOREFRONT_TABS.MysteryCrates}>
                    <MysteryCratesStore />
                </TabPanel>

                {userHasFeature(FeatureName.playerAbility) && (
                    <TabPanel currentValue={currentValue} value={STOREFRONT_TABS.Abilities}>
                        <PlayerAbilitiesStore />
                    </TabPanel>
                )}
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
