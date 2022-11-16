import { Accordion, AccordionDetails, AccordionSummary, Drawer } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useUI } from "../../containers"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { RightRoutes } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const RIGHT_DRAWER_WIDTH = 38 // rem

export const RightDrawer = () => {
    const { rightDrawerActiveTabID, setRightDrawerActiveTabID } = useUI()
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const activeRoute = useActiveRouteID()

    // Hide the drawer if on mobile OR none of the tabs are visible on the page
    if (isMobile || RightRoutes.filter((r) => !r.matchRouteIDs || (activeRoute && r.matchRouteIDs.includes(activeRoute.id))).length <= 0) return null

    return (
        <>
            <DrawerButtons />
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open
                variant="persistent"
                anchor="right"
                sx={{
                    flexShrink: 0,
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
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
                    if (
                        (!route.Header && !route.Component) ||
                        (route.requireAuth && !userID) ||
                        (route.matchRouteIDs && activeRoute && !route.matchRouteIDs.includes(activeRoute.id))
                    )
                        return null

                    return (
                        <Accordion key={route.id} expanded={route.id === rightDrawerActiveTabID}>
                            <AccordionSummary
                                sx={{
                                    p: 0,
                                    minHeight: "auto !important",
                                    ".MuiAccordionSummary-content": {
                                        m: 0,
                                    },
                                    ".MuiAccordionSummary-content.Mui-expanded": {
                                        m: 0,
                                    },
                                    ":hover": {
                                        opacity: 1,
                                    },
                                }}
                                onClick={route.id !== rightDrawerActiveTabID ? () => setRightDrawerActiveTabID(route.id) : undefined}
                            >
                                {route.Header && <route.Header isOpen={route.id === rightDrawerActiveTabID} onClose={() => setRightDrawerActiveTabID("")} />}
                            </AccordionSummary>
                            {route.Component && (
                                <AccordionDetails
                                    sx={{
                                        p: 0,
                                    }}
                                >
                                    <route.Component />
                                </AccordionDetails>
                            )}
                        </Accordion>
                    )
                })}
                {/* {RightRoutes.map((route) => {
                    if ((route.requireAuth && !userID) || (route.matchRouteIDs && activeRoute && !route.matchRouteIDs.includes(activeRoute.id))) return null
                    const isActive = route.id === rightDrawerActiveTabID
                    if (isActive) {
                        return (
                            <Fade key={route.id} in>
                                <Box
                                    sx={{
                                        height: isActive ? "100%" : 0,
                                        visibility: isActive ? "visible" : "hidden",
                                        pointerEvents: isActive ? "all" : "none",
                                    }}
                                >
                                    {route.Header && <route.Header />}
                                    {route.Component && <route.Component />}
                                </Box>
                            </Fade>
                        )
                    }
                    return null
                })} */}
            </Drawer>
        </>
    )
}
