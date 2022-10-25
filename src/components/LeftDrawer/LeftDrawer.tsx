import { Box, Drawer, Fade } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useUI } from "../../containers"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { LeftRoutes } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const LEFT_DRAWER_WIDTH = 44 // rem

export const LeftDrawer = () => {
    const { leftDrawerActiveTabID } = useUI()
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const activeRouteID = useActiveRouteID()

    // Hide the drawer if on mobile OR none of the tabs are visible on the page
    if (isMobile || LeftRoutes.filter((r) => !r.matchRouteIDs || r.matchRouteIDs.includes(activeRouteID)).length <= 0) return null

    const match = LeftRoutes.find((route) => route.id === leftDrawerActiveTabID)
    const isOpen = match && (match.matchRouteIDs === undefined || match.matchRouteIDs?.includes(activeRouteID))

    return (
        <>
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isOpen}
                variant="persistent"
                anchor="left"
                sx={{
                    flexShrink: 0,
                    width: isOpen ? `${LEFT_DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${LEFT_DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        borderRight: 0,
                        overflow: "hidden",
                    },
                }}
            >
                {LeftRoutes.map((route) => {
                    if ((route.requireAuth && !userID) || (route.matchRouteIDs && !route.matchRouteIDs.includes(activeRouteID))) return null
                    const isActive = route.id === leftDrawerActiveTabID
                    if (isActive || route.mountAllTime) {
                        return (
                            <Fade key={route.id} in>
                                <Box sx={{ display: isActive ? "block" : "none", height: "100%" }}>{route.Component && <route.Component />}</Box>
                            </Fade>
                        )
                    }
                    return null
                })}
            </Drawer>
            <DrawerButtons />
        </>
    )
}
