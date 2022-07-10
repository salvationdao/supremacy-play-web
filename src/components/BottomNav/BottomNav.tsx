import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { BOTTOM_NAV_HEIGHT } from "../../constants"
import { useAuth, useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { HASH_ROUTES_MAP } from "../../routes"
import { fonts } from "../../theme/theme"

export const BottomNav = () => {
    const { isMobile } = useMobile()
    if (!isMobile) return null
    // For mobile only
    return <BottomNavInner />
}

const BottomNavInner = () => {
    const { userID } = useAuth()
    const theme = useTheme()
    const { isNavOpen, toggleIsNavOpen, additionalTabs } = useMobile()
    const [currentValue, setCurrentValue] = useState(0)

    const handleChange = useCallback(
        (event: React.SyntheticEvent, newValue: number) => {
            setCurrentValue(newValue)
            toggleIsNavOpen(true)
        },
        [toggleIsNavOpen],
    )

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    const tabs = [HASH_ROUTES_MAP.live_chat, ...additionalTabs]
    if (userID) tabs.push(HASH_ROUTES_MAP.active_players)

    return (
        <Stack
            sx={{
                maxHeight: "70vh",
                height: isNavOpen ? `${BOTTOM_NAV_HEIGHT}rem` : "4.2rem",
                backgroundColor: `${primaryColor}08`,
                transition: "all .3s",
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: "divider", height: "4.2rem" }}>
                <Tabs
                    value={currentValue}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        flexShrink: 0,
                        color: primaryColor,
                        minHeight: 0,
                        backgroundColor: `${primaryColor}12`,
                        ".MuiTab-root, .Mui-selected": { color: "#FFFFFF", minHeight: 0, fontSize: "1.3rem", py: "1rem" },
                        ".MuiTabs-indicator": { backgroundColor: primaryColor },
                        ...(isNavOpen
                            ? {
                                  ".Mui-selected": {
                                      color: `${secondaryColor} !important`,
                                      background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                                      svg: {
                                          fill: `${secondaryColor} !important`,
                                      },
                                  },
                              }
                            : {}),
                    }}
                >
                    {tabs.map((item, i) => {
                        return (
                            <Tab
                                key={i}
                                value={i}
                                onClick={() => {
                                    if (currentValue === i) toggleIsNavOpen()
                                }}
                                label={
                                    <Stack direction="row" alignItems="center" spacing="1rem">
                                        {item.icon}
                                        <Typography variant="caption" sx={{ color: "inherit", fontFamily: fonts.nostromoBold }}>
                                            {item.label}
                                        </Typography>
                                    </Stack>
                                }
                            />
                        )
                    })}
                </Tabs>
            </Box>

            <Box id="game-ui-container" sx={{ flex: 1, backgroundColor }}>
                {isNavOpen &&
                    tabs.map((item, i) => {
                        return (
                            <TabPanel key={i} currentValue={currentValue} value={i}>
                                {item.Component && <item.Component />}
                            </TabPanel>
                        )
                    })}
            </Box>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: number
    currentValue: number
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props
    const isActive = currentValue === value

    return (
        <Fade in={isActive}>
            <Box
                id={`bottom-nav-tabpanel-${value}`}
                sx={{ height: isActive ? "100%" : 0, visibility: isActive ? "visible" : "hidden", pointerEvents: isActive ? "all" : "none" }}
            >
                {children}
            </Box>
        </Fade>
    )
}
