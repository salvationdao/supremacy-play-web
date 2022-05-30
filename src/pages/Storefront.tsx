import { Box, Fade, Stack, Tab, Tabs } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { HangarBg } from "../assets"
import { siteZIndex } from "../theme/theme"

type tabs = "mystery-crates" | "skins" | "merchandise"

export const StorefrontPage = () => {
    const [currentValue, setCurrentValue] = useState<tabs>("mystery-crates")

    const handleChange = (event: SyntheticEvent, newValue: tabs) => {
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
                <Tab label="MYSTERY CRATES" value="mystery-crates" />
                <Tab label="SKINS" value="skins" />
                <Tab label="MERCHANDISE" value="merchandise" />
            </Tabs>

            <TabPanel currentValue={currentValue} value="mystery-crates">
                MYSTERY CRATES
            </TabPanel>
            <TabPanel currentValue={currentValue} value="skins">
                SKINS
            </TabPanel>
            <TabPanel currentValue={currentValue} value="merchandise">
                MERCHANDISE
            </TabPanel>
        </Stack>
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
