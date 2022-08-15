import { Box, Drawer, Fade } from "@mui/material"
import { ReactNode } from "react"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useAuth, useMobile, useOverlayToggles } from "../../containers"
import { RIGHT_DRAWER_ARRAY, RIGHT_DRAWER_MAP } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

export const DRAWER_WIDTH = 38 // rem

export const RightDrawer = () => {
    const { rightDrawerActiveTabID } = useOverlayToggles()
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
                    width: isOpen ? `${DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.Drawer,
                    "& .MuiDrawer-paper": {
                        width: `${DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        borderLeft: 0,
                    },
                }}
            >
                {RIGHT_DRAWER_ARRAY.map((r) => {
                    if (r.requireAuth && !userID) return null
                    return (
                        <Content key={r.id} isActive={r.id === rightDrawerActiveTabID} mountAllTime={r.mountAllTime}>
                            {r.Component && <r.Component />}
                        </Content>
                    )
                })}
            </Drawer>
        </>
    )
}

const Content = ({ isActive, children, mountAllTime }: { isActive: boolean; children: ReactNode; mountAllTime?: boolean }) => {
    if (isActive || mountAllTime) {
        return (
            <Fade in>
                <Box sx={{ height: isActive ? "100%" : 0, visibility: isActive ? "visible" : "hidden", pointerEvents: isActive ? "all" : "none" }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}
