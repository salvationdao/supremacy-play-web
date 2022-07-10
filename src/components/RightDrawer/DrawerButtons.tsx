import { Box, Tabs } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { HASH_ROUTES_ARRAY, RightDrawerHashes } from "../../routes"
import { siteZIndex } from "../../theme/theme"
import { TabButton } from "../LeftDrawer/DrawerButtons"

const DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = () => {
    const { isMobile } = useMobile()
    const theme = useTheme()
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
                    fill: `#FFFFFF !important`,
                },
            }}
        >
            {!isMobile && (
                <Tabs value={0} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                    {HASH_ROUTES_ARRAY.map((r) => {
                        return (
                            <TabButton
                                key={r.id}
                                label={r.label}
                                enable={true}
                                icon={r.icon}
                                onClick={() => {
                                    if (location.hash === r.hash) {
                                        history.replace(`${location.pathname}${RightDrawerHashes.None}`)
                                        return
                                    }
                                    history.replace(`${location.pathname}${r.hash}`)
                                }}
                                isActive={location.hash === r.hash}
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.secondary}
                            />
                        )
                    })}
                </Tabs>
            )}
        </Box>
    )
}
