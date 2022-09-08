import { Box, Tab, Tabs } from "@mui/material"
import { useRouteMatch } from "react-router-dom"
import { useAuth, useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { RIGHT_DRAWER_ARRAY, ROUTES_ARRAY } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"

const BUTTON_WIDTH = 20 //rem
const RIGHT_DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = () => {
    const { rightDrawerActiveTabID, setRightDrawerActiveTabID } = useUI()
    const theme = useTheme()
    const { userID } = useAuth()

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))
    let activeRouteID = "home"
    if (match) {
        const r = ROUTES_ARRAY.find((r) => r.path === match.path)
        activeRouteID = r?.id || ""
    }

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${RIGHT_DRAWER_BAR_WIDTH}rem`,
                background: (theme) => `linear-gradient(to right, #FFFFFF06 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.Drawer,
                ".MuiTabs-flexContainer": {
                    "& > :not(:last-child)": {
                        mb: ".2rem",
                    },
                },
                ".MuiTabs-indicator": {
                    display: "none",
                },
                ".MuiSvgIcon-root": {
                    fill: `${colors.neonBlue} !important`,
                    width: "3rem",
                    height: "3rem",
                },
                svg: { transform: "rotate(90deg)" },
            }}
        >
            <Tabs value={0} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {RIGHT_DRAWER_ARRAY.map((r) => {
                    if ((r.requireAuth && !userID) || (r.matchNavLinkIDs && !r.matchNavLinkIDs.includes(activeRouteID))) return null
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={true}
                            icon={r.icon}
                            onClick={() => {
                                setRightDrawerActiveTabID((prev) => {
                                    if (r.id === prev) {
                                        return ""
                                    }
                                    return r.id
                                })
                            }}
                            isActive={r.id === rightDrawerActiveTabID}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                        />
                    )
                })}
            </Tabs>
        </Box>
    )
}

export const TabButton = ({
    label,
    enable,
    icon,
    isActive,
    primaryColor,
    secondaryColor,
    onClick,
}: {
    label: string
    enable?: boolean
    icon?: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    isActive?: boolean
    primaryColor: string
    secondaryColor: string
    onClick: () => void
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: `${BUTTON_WIDTH}rem`,
                width: `${RIGHT_DRAWER_BAR_WIDTH}rem`,
            }}
        >
            <Tab
                label={label}
                icon={icon}
                iconPosition="end"
                onClick={onClick}
                disabled={!enable}
                sx={{
                    p: 0,
                    pt: ".2rem",
                    position: "absolute",
                    whiteSpace: "nowrap",
                    fontFamily: fonts.nostromoBold,
                    fontSize: "1.2rem",
                    lineHeight: 1,
                    color: isActive ? secondaryColor : "#FFFFFF",
                    backgroundColor: enable ? (isActive ? `${primaryColor}CC` : `${primaryColor}25`) : `${primaryColor}20`,
                    opacity: isActive ? 1 : 0.6,
                    transform: `translate(${-BUTTON_WIDTH / 2 + RIGHT_DRAWER_BAR_WIDTH / 2}rem, ${
                        BUTTON_WIDTH / 2 - RIGHT_DRAWER_BAR_WIDTH / 2
                    }rem) rotate(-90deg)`,
                    ":hover": {
                        opacity: 1,
                    },
                    "&, .MuiTouchRipple-root": {
                        width: `${BUTTON_WIDTH}rem`,
                        height: `${RIGHT_DRAWER_BAR_WIDTH}rem`,
                        minHeight: `${RIGHT_DRAWER_BAR_WIDTH}rem`,
                    },
                    "& svg": {
                        fill: isActive ? `${secondaryColor} !important` : "#FFFFFF",
                    },
                }}
            />
        </Box>
    )
}
