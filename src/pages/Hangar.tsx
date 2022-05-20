import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { HangarBg } from "../assets"
import { WarMachines } from "../components/Hangar/WarMachines/WarMachines"
import { siteZIndex } from "../theme/theme"

export const HangarPage = () => {
    const [currentValue, setCurrentValue] = useState(0)

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setCurrentValue(newValue)
    }

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
            <Tabs
                value={currentValue}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mt: ".2rem",
                    ml: "1.5rem",
                    color: (theme) => theme.factionTheme.primary,
                    minHeight: 0,
                    ".MuiTab-root": { minHeight: 0, fontSize: "1.2rem" },
                    ".Mui-selected": { color: (theme) => `${theme.factionTheme.primary} !important` },
                    ".MuiTabs-indicator": { backgroundColor: (theme) => theme.factionTheme.primary },
                }}
            >
                <Tab label="WAR MACHINE" />
                <Tab label="WEAPONS" />
                <Tab label="ATTACHMENTS" />
                <Tab label="PAINT JOBS" />
            </Tabs>

            <TabPanel currentValue={currentValue} index={0}>
                <WarMachines />
            </TabPanel>
            <TabPanel currentValue={currentValue} index={1}>
                WEAPONS
            </TabPanel>
            <TabPanel currentValue={currentValue} index={2}>
                ATTACHMENTS
            </TabPanel>
            <TabPanel currentValue={currentValue} index={3}>
                PAINT JOBS
            </TabPanel>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    currentValue: number
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, index } = props

    if (currentValue === index) {
        return (
            <Fade in>
                <Box id={`hangar-tabpanel-${index}`} sx={{ px: "1.5rem", pt: "1rem", pb: "1.5rem", flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
