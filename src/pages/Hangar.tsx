import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { useTheme } from "../containers/theme"
import { WarMachines } from "../components/Hangar/WarMachines/WarMachines"
import { useAuth } from "../containers"
import { fonts, siteZIndex } from "../theme/theme"

enum TABS {
    WAR_MACHINES = "war-machines",
    WEAPONS = "weapons",
    ATTACHMENTS = "attachments",
    PAINT_JOBS = "paint-jobs",
}

export const HangarPage = () => {
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
                <HangarPageInner />
            )}
        </Stack>
    )
}

const HangarPageInner = () => {
    const theme = useTheme()
    const [currentValue, setCurrentValue] = useState<TABS>(TABS.WAR_MACHINES)

    const handleChange = (event: SyntheticEvent, newValue: TABS) => {
        setCurrentValue(newValue)
    }

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
                        <Tab label="WAR MACHINE" value={TABS.WAR_MACHINES} />
                        <Tab label="WEAPONS" value={TABS.WEAPONS} />
                        <Tab label="ATTACHMENTS" value={TABS.ATTACHMENTS} />
                        <Tab label="PAINT JOBS" value={TABS.PAINT_JOBS} />
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value={TABS.WAR_MACHINES}>
                    <WarMachines />
                </TabPanel>
                <TabPanel currentValue={currentValue} value={TABS.WEAPONS}>
                    WEAPONS
                </TabPanel>
                <TabPanel currentValue={currentValue} value={TABS.ATTACHMENTS}>
                    ATTACHMENTS
                </TabPanel>
                <TabPanel currentValue={currentValue} value={TABS.PAINT_JOBS}>
                    PAINT JOBS
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
                <Box id={`hangar-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
