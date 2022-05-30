import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { WarMachines } from "../components/Hangar/WarMachines/WarMachines"
import { useAuth } from "../containers"
import { fonts, siteZIndex } from "../theme/theme"

type tabs = "war-machines" | "weapons" | "attachments" | "paint-jobs"

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
    const [currentValue, setCurrentValue] = useState<tabs>("war-machines")

    const handleChange = (event: SyntheticEvent, newValue: tabs) => {
        setCurrentValue(newValue)
    }

    return (
        <>
            <Tabs
                value={currentValue}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    flexShrink: 0,
                    mt: ".2rem",
                    ml: "1.5rem",
                    color: (theme) => theme.factionTheme.primary,
                    minHeight: 0,
                    ".MuiTab-root": { minHeight: 0, fontSize: "1.2rem" },
                    ".Mui-selected": { color: (theme) => `${theme.factionTheme.primary} !important` },
                    ".MuiTabs-indicator": { backgroundColor: (theme) => theme.factionTheme.primary },
                }}
            >
                <Tab label="WAR MACHINE" value="war-machines" />
                <Tab label="WEAPONS" value="weapons" />
                <Tab label="ATTACHMENTS" value="attachments" />
                <Tab label="PAINT JOBS" value="paint-jobs" />
            </Tabs>

            <TabPanel currentValue={currentValue} value={"war-machines"}>
                <WarMachines />
            </TabPanel>
            <TabPanel currentValue={currentValue} value={"weapons"}>
                WEAPONS
            </TabPanel>
            <TabPanel currentValue={currentValue} value={"attachments"}>
                ATTACHMENTS
            </TabPanel>
            <TabPanel currentValue={currentValue} value={"paint-jobs"}>
                PAINT JOBS
            </TabPanel>
        </>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: tabs
    currentValue: tabs
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in>
                <Box id={`hangar-tabpanel-${value}`} sx={{ px: "1.5rem", pt: "1rem", pb: "1.5rem", flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
