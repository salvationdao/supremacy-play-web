import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { BOTTOM_NAV_HEIGHT } from "../../constants"
import { useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { HASH_ROUTES_ARRAY } from "../../routes"
import { fonts } from "../../theme/theme"

export const BottomNav = () => {
    const { isMobile } = useMobile()
    if (!isMobile) return null
    // For mobile only
    return <BottomNavInner />
}

const BottomNavInner = () => {
    const theme = useTheme()
    const { additionalTabs } = useMobile()
    const [isNavOpen, toggleIsNavOpen] = useToggle(true)
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

    return (
        <Stack
            sx={{
                maxHeight: "70vh",
                height: isNavOpen ? `${BOTTOM_NAV_HEIGHT}rem` : "3.2rem",
                backgroundColor: `${primaryColor}08`,
                transition: "all .3s",
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
                        ".MuiTab-root, .Mui-selected": { color: "#FFFFFF", minHeight: 0, fontSize: "1.3rem", py: ".6rem" },
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
                    {[...HASH_ROUTES_ARRAY, ...additionalTabs].map((item, i) => {
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

            {isNavOpen &&
                [...HASH_ROUTES_ARRAY, ...additionalTabs].map((item, i) => {
                    return (
                        <TabPanel key={i} currentValue={currentValue} value={i}>
                            {item.Component && <item.Component />}
                        </TabPanel>
                    )
                })}
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

    return (
        <Fade in={currentValue === value}>
            <Box id={`bottom-nav-tabpanel-${value}`} sx={{ flex: 1, display: currentValue === value ? "unset" : "none" }}>
                {children}
            </Box>
        </Fade>
    )
}
