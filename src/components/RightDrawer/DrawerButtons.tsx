import { Box, Tabs } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { useAuth } from "../../containers"
import { useTheme } from "../../containers/theme"
import { HASH_ROUTES_ARRAY, RightDrawerHashes } from "../../routes"
import { siteZIndex } from "../../theme/theme"
import { TabButton } from "../LeftDrawer/DrawerButtons"

const DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = () => {
    const theme = useTheme()
    const { userID } = useAuth()
    const location = useLocation()
    const history = useHistory()

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
                background: (theme) => `linear-gradient(to right, #FFFFFF06 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.RightDrawer,
                ".MuiTabs-flexContainer": {
                    "& > :not(:last-child)": {
                        mb: ".2rem",
                    },
                },
                ".MuiTabs-indicator": {
                    display: "none",
                },
                ".MuiSvgIcon-root": {
                    fill: `${theme.factionTheme.secondary} !important`,
                },
            }}
        >
            <Tabs value={0} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {HASH_ROUTES_ARRAY.map((r) => {
                    if (r.requireAuth && !userID) return null
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={true}
                            icon={r.icon}
                            onClick={() => {
                                if (location.hash === r.hash) {
                                    history.replace(`${location.pathname}${location.search}${RightDrawerHashes.None}`)
                                    return
                                }
                                history.replace(`${location.pathname}${location.search}${r.hash}`)
                            }}
                            isActive={location.hash === r.hash}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                        />
                    )
                })}
            </Tabs>
        </Box>
    )
}
