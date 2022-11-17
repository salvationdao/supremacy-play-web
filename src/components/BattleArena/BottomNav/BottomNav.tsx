import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useAuth, useMobile } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { RightRouteID, RightRoutes } from "../../../routes"
import { fonts } from "../../../theme/theme"

export const BottomNav = () => {
    const { isMobile } = useMobile()
    if (!isMobile) return null
    // For mobile only
    return <BottomNavInner />
}

/**
 * This thing replaces the left and right drawers on mobile view
 * @returns
 */

const BottomNavInner = () => {
    const { userID } = useAuth()
    const theme = useTheme()
    const { isNavOpen, setIsNavOpen, additionalTabs, allowCloseNav } = useMobile()
    const [currentValue, setCurrentValue] = useState(0)

    const handleChange = useCallback(
        (event: React.SyntheticEvent, newValue: number) => {
            setCurrentValue(newValue)
            setIsNavOpen(true)
        },
        [setIsNavOpen],
    )

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.text
    const backgroundColor = theme.factionTheme.background

    const tabs = [
        RightRoutes.find((route) => route.id === RightRouteID.LiveChat),
        ...additionalTabs,
        RightRoutes.find((route) => route.id === RightRouteID.ActivePlayers),
    ]

    return (
        <Stack
            sx={{
                maxHeight: "calc(100% - 240px)",
                height: isNavOpen ? `62%` : "4.2rem",
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
                        ".MuiTabScrollButton-root": { display: "none" },
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
                        if (!item || (item.requireAuth && !userID)) return null
                        return (
                            <Tab
                                key={i}
                                value={i}
                                onClick={() => {
                                    if (currentValue === i) {
                                        setIsNavOpen((prev) => {
                                            if (!!prev && !allowCloseNav.current) return prev
                                            return !prev
                                        })
                                    }
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

            {isNavOpen && (
                <Box sx={{ flex: 1, backgroundColor }}>
                    {tabs.map((item, i) => {
                        if (!item || (item.requireAuth && !userID)) return null
                        return (
                            <TabPanel key={i} currentValue={currentValue} value={i} mountAllTime={item.mountAllTime}>
                                {item.Component && <item.Component />}
                            </TabPanel>
                        )
                    })}
                </Box>
            )}
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: number
    currentValue: number
    mountAllTime: boolean
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value, mountAllTime } = props
    const isActive = currentValue === value

    if (!isActive && !mountAllTime) return null

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
