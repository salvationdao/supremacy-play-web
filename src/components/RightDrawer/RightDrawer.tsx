import { Accordion, AccordionDetails, AccordionSummary, Drawer } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useUI } from "../../containers"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { RightRoutes } from "../../routes"
import { siteZIndex } from "../../theme/theme"

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
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={!!rightDrawerActiveTabID}
                variant="persistent"
                anchor="right"
                sx={{
                    flexShrink: 0,
                    width: rightDrawerActiveTabID ? `${RIGHT_DRAWER_WIDTH}rem` : "7rem",
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${RIGHT_DRAWER_WIDTH}rem`,
                        backgroundColor: `#1B0313`,
                        position: "absolute",
                        borderLeft: `1px solid #9F0410`,
                        overflow: "hidden",
                        transform: !rightDrawerActiveTabID ? `translateX(calc(${RIGHT_DRAWER_WIDTH}rem - 7rem)) !important` : "",
                        visibility: !rightDrawerActiveTabID ? "visible !important" : "",
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
                        <Accordion
                            key={route.id}
                            expanded={route.id === rightDrawerActiveTabID}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                "&:not(:last-child)": {
                                    mb: ".5rem",
                                },
                                "&.Mui-expanded": {
                                    flex: 1,
                                    minHeight: 0,
                                    m: 0,
                                    ".MuiCollapse-root": {
                                        flex: 1,
                                        ".MuiCollapse-wrapper": {
                                            height: "100%",
                                            ".MuiAccordion-region": {
                                                height: "100%",
                                            },
                                        },
                                    },
                                },
                                "&:before": {
                                    display: "none",
                                },
                            }}
                        >
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
                                        height: "100%",
                                        p: 0,
                                        backgroundColor: "#0D0415",
                                    }}
                                >
                                    <route.Component />
                                </AccordionDetails>
                            )}
                        </Accordion>
                    )
                })}
            </Drawer>
        </>
    )
}
