import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent, useEffect, useCallback } from "react"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { useTheme } from "../containers/theme"
import { WarMachines } from "../components/Hangar/WarMachines/WarMachines"
import { useAuth } from "../containers"
import { fonts, siteZIndex } from "../theme/theme"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { ROUTES_MAP } from "../routes"

export enum HANGAR_TABS {
    WarMachines = "war-machines",
    Weapons = "weapons",
    Attachments = "attachments",
    PaintJObs = "paint-jobs",
}

export const HangarPage = () => {
    const { userID } = useAuth()

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
            {!userID ? (
                <Stack spacing="1.3rem" alignItems="center" sx={{ alignSelf: "center", my: "auto", px: "3.6rem", py: "2.8rem", backgroundColor: "#00000060" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        You need to be logged in to view this page.
                    </Typography>
                    <ConnectButton width="12rem" />
                </Stack>
            ) : (
                <HangarPageInner />
            )}
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
            <Stack sx={{ my: "1.5rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "193rem" }}>
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
                            ".MuiTab-root": { minHeight: 0, fontSize: "1.2rem", py: ".8rem" },
                            ".Mui-selected": {
                                color: (theme) => `${theme.factionTheme.secondary} !important`,
                                backgroundColor: (theme) => `${theme.factionTheme.primary}CC !important`,
                            },
                            ".MuiTabs-indicator": { display: "none" },
                        }}
                    >
                        <Tab label="WAR MACHINE" value={HANGAR_TABS.WarMachines} />
                        <Tab label="WEAPONS" value={HANGAR_TABS.Weapons} />
                        <Tab label="ATTACHMENTS" value={HANGAR_TABS.Attachments} />
                        <Tab label="PAINT JOBS" value={HANGAR_TABS.PaintJObs} />
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value={HANGAR_TABS.WarMachines}>
                    <WarMachines />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={HANGAR_TABS.Weapons}>
                    WEAPONS
                </TabPanel>
                <TabPanel currentValue={currentValue} value={HANGAR_TABS.Attachments}>
                    ATTACHMENTS
                </TabPanel>
                <TabPanel currentValue={currentValue} value={HANGAR_TABS.PaintJObs}>
                    PAINT JOBS
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
            <Fade in>
                <Box id={`hangar-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
