import { Box, Drawer, Fade } from "@mui/material"
import { useRouteMatch } from "react-router-dom"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useOverlayToggles } from "../../containers"
import { LEFT_DRAWER_ARRAY, LEFT_DRAWER_MAP, ROUTES_ARRAY } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const LEFT_DRAWER_WIDTH = 44 // rem

export const LeftDrawer = () => {
    const { leftDrawerActiveTabID } = useOverlayToggles()
    const { isMobile } = useMobile()
    const { userID } = useAuth()

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))
    let activeRouteID = ""
    if (match) {
        const r = ROUTES_ARRAY.find((r) => r.path === match.path)
        activeRouteID = r?.id || ""
    }

    // Hide the drawer if on mobile OR none of the tabs are visible on the page
    if (isMobile || (activeRouteID && LEFT_DRAWER_ARRAY.filter((r) => !r.matchNavLinkID || r.matchNavLinkID === activeRouteID).length <= 0)) return null

    const isOpen = !!LEFT_DRAWER_MAP[leftDrawerActiveTabID]

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
                {LEFT_DRAWER_ARRAY.map((r) => {
                    if ((r.requireAuth && !userID) || (r.matchNavLinkID && activeRouteID && activeRouteID !== r.matchNavLinkID)) return null
                    const isActive = r.id === leftDrawerActiveTabID
                    if (isActive || r.mountAllTime) {
                        return (
                            <Fade key={r.id} in>
                                <Box
                                    sx={{
                                        height: isActive ? "100%" : 0,
                                        visibility: isActive ? "visible" : "hidden",
                                        pointerEvents: isActive ? "all" : "none",
                                    }}
                                >
                                    {r.Component && <r.Component />}
                                </Box>
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
