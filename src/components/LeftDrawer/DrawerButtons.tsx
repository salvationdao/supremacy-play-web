import { Box, Tabs } from "@mui/material"
import { useAuth, useOverlayToggles } from "../../containers"
import { useTheme } from "../../containers/theme"
import { LEFT_DRAWER_ARRAY } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { TabButton } from "../RightDrawer/DrawerButtons"

export const DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = () => {
    const { leftDrawerActiveTabID, setLeftDrawerActiveTabID } = useOverlayToggles()
    const theme = useTheme()
    const { userID } = useAuth()

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
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
            }}
        >
            <Tabs value={0} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {LEFT_DRAWER_ARRAY.map((r) => {
                    if (r.requireAuth && !userID) return null
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
