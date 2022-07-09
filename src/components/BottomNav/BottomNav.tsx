import { Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react"
import { SvgChat } from "../../assets"
import { BOTTOM_NAV_HEIGHT } from "../../constants"
import { useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { fonts } from "../../theme/theme"

export interface BottomNavStruct {
    icon: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    label: string
    Component?: () => JSX.Element
}

const BOTTOM_NAV_ARRAY: BottomNavStruct[] = [
    {
        icon: <SvgChat size="1.2rem" sx={{ pt: ".1rem" }} />,
        label: "LIVE CHAT",
        Component: () => <></>,
    },
]

export const BottomNav = () => {
    const { isMobile } = useMobile()
    if (!isMobile) return null
    // For mobile only
    return <BottomNavInner />
}

const BottomNavInner = () => {
    const theme = useTheme()
    const { additionalTabs } = useMobile()
    const [currentValue, setCurrentValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentValue(newValue)
    }

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack sx={{ maxHeight: "60vh", height: `${BOTTOM_NAV_HEIGHT}rem`, backgroundColor: `${primaryColor}08` }}>
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
                        ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", py: ".6rem" },
                        ".Mui-selected": {
                            color: `${secondaryColor} !important`,
                            background: `linear-gradient(${primaryColor} 26%, ${primaryColor}BB)`,
                        },
                        ".MuiTabs-indicator": { backgroundColor: primaryColor },
                    }}
                >
                    {[...BOTTOM_NAV_ARRAY, ...additionalTabs].map((item, i) => {
                        return (
                            <Tab
                                key={i}
                                label={
                                    <Stack direction="row" alignItems="center" spacing="1rem">
                                        {item.icon}
                                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold }}>
                                            {item.label}
                                        </Typography>
                                    </Stack>
                                }
                            />
                        )
                    })}
                </Tabs>
            </Box>

            {BOTTOM_NAV_ARRAY.map((item, i) => {
                return (
                    <TabPanel key={i} currentValue={currentValue} value={i}>
                        {item.Component}
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

    if (currentValue === value) {
        return (
            <Fade in>
                <Box id={`marketplace-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
