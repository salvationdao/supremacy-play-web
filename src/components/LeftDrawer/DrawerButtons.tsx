import { Box, Tabs } from "@mui/material"
import { useRouteMatch } from "react-router-dom"
import { useArena, useAuth, useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { LEFT_DRAWER_ARRAY, ROUTES_ARRAY } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { TabButton } from "../RightDrawer/DrawerButtons"

export const LEFT_DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = () => {
    const { currentArena } = useArena()
    const { leftDrawerActiveTabID, setLeftDrawerActiveTabID } = useUI()
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
                {LEFT_DRAWER_ARRAY.map((r) => {
                    if ((r.requireAuth && !userID) || (r.matchNavLinkIDs && !r.matchNavLinkIDs.includes(activeRouteID))) return null
                    if ((currentArena?.status?.is_idle && r.id !== "quick_deploy") || (!currentArena?.status?.is_idle && r.id === "quick_deploy")) return null
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={true}
                            icon={r.icon}
                            onClick={() => {
                                setLeftDrawerActiveTabID((prev) => {
                                    if (r.id === prev) {
                                        return ""
                                    }
                                    return r.id
                                })
                            }}
                            isActive={r.id === leftDrawerActiveTabID}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                        />
                    )
                })}
            </Tabs>
        </Box>
    )
}
