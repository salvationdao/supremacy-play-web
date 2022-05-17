import { Box, Tabs, Theme, useTheme } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { ROUTES_ARRAY } from "../../routes"
import { RightDrawerPanels } from "../../containers"
import { siteZIndex } from "../../theme/theme"
import { TabButton } from "../LeftDrawer/DrawerButtons"
import { useCallback } from "react"

const DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = ({
    activePanel,
    togglePanel,
}: {
    activePanel: RightDrawerPanels
    togglePanel: (newPanel: RightDrawerPanels, value?: boolean | undefined) => void
}) => {
    const theme = useTheme<Theme>()
    const location = useLocation()
    const history = useHistory()

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
                backgroundColor: (theme) => theme.factionTheme.background,
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
                    fill: "#FFFFFF !important",
                },
            }}
        >
            <Tabs value="" orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {ROUTES_ARRAY.filter((r) => r.rightDrawerPanel).map((r) => {
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={r.enable}
                            value=""
                            icon={r.icon}
                            onClick={() => {
                                if (!r.rightDrawerPanel) return
                                history.push(r.path)
                                togglePanel(r.rightDrawerPanel)
                            }}
                            isActive={activePanel === r.rightDrawerPanel}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                        />
                    )
                })}
            </Tabs>
        </Box>
    )
}
