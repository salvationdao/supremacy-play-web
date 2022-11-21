import { Box, Tabs } from "@mui/material"
import { useAuth, useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { LeftRoutes } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { TabButton } from "../RightDrawer/DrawerButtons"

export const LEFT_DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = () => {
    const { leftDrawerActiveTabID, setLeftDrawerActiveTabID } = useUI()
    const theme = useTheme()
    const { userID } = useAuth()
    const activeRoute = useActiveRouteID()

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${LEFT_DRAWER_BAR_WIDTH}rem`,
                background: (theme) => `linear-gradient(to right, #FFFFFF06 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.Drawer + 10,
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
                {LeftRoutes.map((route) => {
                    if ((route.requireAuth && !userID) || (route.matchRouteIDs && activeRoute && !route.matchRouteIDs.includes(activeRoute.id))) return null
                    return (
                        <TabButton
                            key={route.id}
                            label={route.label}
                            enable={true}
                            icon={route.icon}
                            onClick={() => {
                                setLeftDrawerActiveTabID((prev) => {
                                    if (route.id === prev) {
                                        return ""
                                    }
                                    return route.id
                                })
                            }}
                            isActive={route.id === leftDrawerActiveTabID}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.text}
                        />
                    )
                })}
            </Tabs>
        </Box>
    )
}
