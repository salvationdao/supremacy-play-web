import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent, useEffect, useCallback } from "react"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { useTheme } from "../containers/theme"
import { WarMachinesHangar } from "../components/Hangar/WarMachinesHangar/WarMachinesHangar"
import { useAuth } from "../containers"
import { fonts, siteZIndex } from "../theme/theme"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { ROUTES_MAP } from "../routes"
import { MysteryCratesHangar } from "../components/Hangar/MysteryCratesHangar/MysteryCratesHangar"
import { KeycardsHangar } from "../components/Hangar/KeycardsHangar/KeycardsHangar"
import { SelectFaction } from "../components/Common/SelectFaction"

export enum HANGAR_TABS {
    WarMachines = "war-machines",
    MysteryCrates = "mystery-crates",
    Keycards = "key-cards",
}

export const HangarPage = () => {
    const { userID, factionID } = useAuth()

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
            {!userID && (
                <Stack spacing="1.3rem" alignItems="center" sx={{ alignSelf: "center", my: "auto", px: "3.6rem", py: "2.8rem", backgroundColor: "#00000060" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        You need to be logged in to view this page.
                    </Typography>
                    <ConnectButton width="12rem" />
                </Stack>
            )}

            {userID && !factionID && <SelectFaction />}

            {userID && factionID && <HangarPageInner />}
        </Stack>
    )
}

const HangarPageInner = () => {
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const { type } = useParams<{ type: HANGAR_TABS }>()
    const [currentValue, setCurrentValue] = useState<HANGAR_TABS>()

    // Make sure that the param route is correct, fix it if invalid
    useEffect(() => {
        if (Object.values(HANGAR_TABS).includes(type)) return setCurrentValue(type)
        history.replace(`${ROUTES_MAP.hangar.path.replace(":type", HANGAR_TABS.WarMachines)}${location.hash}`)
    }, [history, location.hash, location.pathname, type])

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: HANGAR_TABS) => {
            setCurrentValue(newValue)
            history.push(`${ROUTES_MAP.hangar.path.replace(":type", newValue)}${location.hash}`)
        },
        [history, location.hash],
    )

    if (!currentValue) return null

    return (
        <>
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "193rem" }}>
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
                        <Tab label="WAR MACHINES" value={HANGAR_TABS.WarMachines} />
                        <Tab label="KEY CARDS" value={HANGAR_TABS.Keycards} />
                        <Tab label="MYSTERY CRATES" value={HANGAR_TABS.MysteryCrates} />
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.WarMachines}>
                    <WarMachinesHangar />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={HANGAR_TABS.Keycards}>
                    <KeycardsHangar />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={HANGAR_TABS.MysteryCrates}>
                    <MysteryCratesHangar />
                </TabPanel>
            </Stack>
        </>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: HANGAR_TABS
    currentValue: HANGAR_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in unmountOnExit>
                <Box id={`hangar-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
