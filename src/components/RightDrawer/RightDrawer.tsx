import { Box, Drawer, Fade } from "@mui/material"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useUI } from "../../containers"
import { RIGHT_DRAWER_ARRAY, RIGHT_DRAWER_MAP } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const RIGHT_DRAWER_WIDTH = 38 // rem

export const RightDrawer = () => {
    const { rightDrawerActiveTabID } = useUI()
    const { isMobile } = useMobile()
    const { userID } = useAuth()

    if (isMobile) return null

    const isOpen = !!RIGHT_DRAWER_MAP[rightDrawerActiveTabID]

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
                {RIGHT_DRAWER_ARRAY.map((r) => {
                    if (r.requireAuth && !userID) return null
                    const isActive = r.id === rightDrawerActiveTabID
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
