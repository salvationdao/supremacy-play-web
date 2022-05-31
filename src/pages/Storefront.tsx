import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState, SyntheticEvent } from "react"
import { HangarBg } from "../assets"
import { ConnectButton } from "../components"
import { MysteryCrates } from "../components/Storefront/MysteryCrates/MysteryCrates"
import { useAuth } from "../containers"
import { useTheme } from "../containers/theme"
import { fonts, siteZIndex } from "../theme/theme"

type tabs = "mystery-crates" | "skins" | "merchandise"

export const StorefrontPage = () => {
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
                <StorefrontPageInner />
            )}
        </Stack>
    )
}

const StorefrontPageInner = () => {
    const theme = useTheme()
    const [currentValue, setCurrentValue] = useState<tabs>("mystery-crates")

    const handleChange = (event: SyntheticEvent, newValue: tabs) => {
        setCurrentValue(newValue)
    }

    return (
        <>
            <Stack sx={{ m: "1.5rem", height: "100%" }}>
                <Box sx={{ width: "fit-content", mb: ".8rem", border: `${theme.factionTheme.primary}CC .4rem solid` }}>
                    <Tabs
                        value={currentValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            width: "fit-content",
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
                        <Tab label="MYSTERY CRATES" value="mystery-crates" />
                        <Tab label="SKINS" value="skins" />
                        <Tab label="MERCHANDISE" value="merchandise" />
                    </Tabs>
                </Box>

                <TabPanel currentValue={currentValue} value="mystery-crates">
                    <MysteryCrates />
                </TabPanel>
                <TabPanel currentValue={currentValue} value="skins">
                    SKINS
                </TabPanel>
                <TabPanel currentValue={currentValue} value="merchandise">
                    MERCHANDISE
                </TabPanel>
            </Stack>
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
                <Box id={`hangar-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
