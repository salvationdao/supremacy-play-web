import { Accordion, AccordionDetails, AccordionSummary, Drawer } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { LeftRoutes } from "../../routes"
import { siteZIndex } from "../../theme/theme"
import { DRAWER_OFFSET } from "../RightDrawer/RightDrawer"

export const LEFT_DRAWER_WIDTH = 44 // rem

export const LeftDrawer = () => {
    const theme = useTheme()
    const { leftDrawerActiveTabID, setLeftDrawerActiveTabID } = useUI()
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const activeRoute = useActiveRouteID()

    // Hide the drawer if on mobile OR none of the tabs are visible on the page
    if (isMobile || LeftRoutes.filter((r) => !r.matchRouteIDs || (activeRoute && r.matchRouteIDs.includes(activeRoute.id))).length <= 0) return null

    const match = LeftRoutes.find((route) => route.id === leftDrawerActiveTabID)
    const isOpen = match && (match.matchRouteIDs === undefined || (activeRoute && match.matchRouteIDs?.includes(activeRoute.id)))

    return (
        <>
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isOpen}
                variant="persistent"
                anchor="left"
                sx={{
                    flexShrink: 0,
                    width: isOpen ? `${LEFT_DRAWER_WIDTH}rem` : DRAWER_OFFSET,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${LEFT_DRAWER_WIDTH}rem`,
                        backgroundColor: theme.factionTheme.s800,
                        position: "absolute",
                        borderRight: `1px solid ${theme.factionTheme.primary}`,
                        overflow: "hidden",
                        transform: !isOpen ? `translateX(calc(-${LEFT_DRAWER_WIDTH}rem + ${DRAWER_OFFSET})) !important` : "",
                        visibility: !isOpen ? "visible !important" : "",
                    },
                }}
            >
                {LeftRoutes.map((route) => {
                    if (
                        (!route.Header && !route.Component) ||
                        (route.requireAuth && !userID) ||
                        (route.matchRouteIDs && activeRoute && !route.matchRouteIDs.includes(activeRoute.id))
                    )
                        return null
                    return (
                        <Accordion
                            key={route.id}
                            expanded={route.id === leftDrawerActiveTabID}
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
                                onClick={route.id !== leftDrawerActiveTabID ? () => setLeftDrawerActiveTabID(route.id) : undefined}
                            >
                                {route.Header && (
                                    <route.Header
                                        isDrawerOpen={!!isOpen}
                                        isOpen={route.id === leftDrawerActiveTabID}
                                        onClose={() => setLeftDrawerActiveTabID("")}
                                    />
                                )}
                            </AccordionSummary>
                            {route.Component && (
                                <AccordionDetails
                                    sx={{
                                        height: "100%",
                                        p: 0,
                                        backgroundColor: theme.factionTheme.background,
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
