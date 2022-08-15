import { Box, Drawer, Fade } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useOverlayToggles } from "../../containers"
import { LEFT_DRAWER_ARRAY, LEFT_DRAWER_MAP } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons, DRAWER_BAR_WIDTH } from "./DrawerButtons"

export const DRAWER_WIDTH = 48 // rem

export const LeftDrawer = () => {
    const { leftDrawerActiveTabID } = useOverlayToggles()
    const { isMobile } = useMobile()
    const { userID } = useAuth()

    if (isMobile) return null

    const isOpen = !!LEFT_DRAWER_MAP[leftDrawerActiveTabID]

    return (
        <>
            <DrawerButtons />
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isOpen}
                variant="persistent"
                anchor="left"
                sx={{
                    flexShrink: 0,
                    width: isOpen ? `${DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        ml: `${DRAWER_BAR_WIDTH}rem`,
                        borderRight: 0,
                        overflow: "hidden",
                    },
                }}
            >
                {LEFT_DRAWER_ARRAY.map((r) => {
                    if (r.requireAuth && !userID) return null
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
        </>
    )
}
