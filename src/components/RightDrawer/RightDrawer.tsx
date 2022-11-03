import { Box, Drawer, Fade } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useUI } from "../../containers"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { RightRoutes } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const RIGHT_DRAWER_WIDTH = 38 // rem

export const RightDrawer = () => {
    const { rightDrawerActiveTabID } = useUI()
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const activeRouteID = useActiveRouteID()

    // Hide the drawer if on mobile OR none of the tabs are visible on the page
    if (isMobile || RightRoutes.filter((r) => !r.matchRouteIDs || r.matchRouteIDs.includes(activeRouteID)).length <= 0) return null

    const match = RightRoutes.find((route) => route.id === rightDrawerActiveTabID)
    const isOpen = match && (match.matchRouteIDs === undefined || match.matchRouteIDs?.includes(activeRouteID))

    return (
        <>
            <DrawerButtons />
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isOpen}
                variant="persistent"
                anchor="right"
                sx={{
                    flexShrink: 0,
                    width: isOpen ? `${RIGHT_DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${RIGHT_DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        borderLeft: 0,
                        overflow: "hidden",
                    },
                }}
            >
                {RightRoutes.map((route) => {
                    if ((route.requireAuth && !userID) || (route.matchRouteIDs && !route.matchRouteIDs.includes(activeRouteID))) return null
                    const isActive = route.id === rightDrawerActiveTabID
                    if (isActive || route.mountAllTime) {
                        return (
                            <Fade key={route.id} in>
                                <Box
                                    sx={{
                                        height: isActive ? "100%" : 0,
                                        visibility: isActive ? "visible" : "hidden",
                                        pointerEvents: isActive ? "all" : "none",
                                    }}
                                >
                                    {route.Component && <route.Component />}
                                </Box>
                            </Fade>
                        )
                    }
                    return null
                })}
            </Drawer>
        </>
    )
}
