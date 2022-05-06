import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { siteZIndex } from "../theme/theme"

export const HangarPage = () => {
    const [currentValue, setCurrentValue] = useState(0)

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setCurrentValue(newValue)
    }

    return (
        <Stack sx={{ height: "100%", zIndex: siteZIndex.RoutePage }}>
            <Box sx={{ height: "100%", minWidth: "95rem", maxWidth: "70%" }}>
                <Tabs
                    value={currentValue}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        color: (theme) => theme.factionTheme.primary,
                        minHeight: 0,
                        ".MuiTab-root": { minHeight: 0, fontSize: "1.1rem" },
                        ".Mui-selected": { color: (theme) => theme.factionTheme.primary },
                        ".MuiTabs-indicator": { backgroundColor: (theme) => theme.factionTheme.primary },
                    }}
                >
                    <Tab label="WAR MACHINE" />
                    <Tab label="WEAPONS" />
                    <Tab label="ATTACHMENTS" />
                    <Tab label="PAINT JOBS" />
                </Tabs>

                <TabPanel currentValue={currentValue} index={0}>
                    WAR MACHINE
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
            </Box>
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
                <Box id={`hangar-tabpanel-${index}`} sx={{ px: "2rem", py: "1.5rem", height: "100%" }}>
                    <Typography>{children}</Typography>
                </Box>
            </Fade>
        )
    }

    return null
}
