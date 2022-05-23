import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { WarMachines } from "../components/Hangar/WarMachines/WarMachines"
import { useAuth } from "../containers"
import { fonts, siteZIndex } from "../theme/theme"

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
                <Stack spacing="1.3rem" alignItems="center" sx={{ my: "auto", px: "3.6rem", py: "2.8rem", backgroundColor: "#00000060" }}>
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
    const [currentValue, setCurrentValue] = useState(0)

    const handleChange = (event: SyntheticEvent, newValue: number) => {
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
        </>
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
