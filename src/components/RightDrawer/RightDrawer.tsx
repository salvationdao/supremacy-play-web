import { Drawer } from "@mui/material"
import { useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { DRAWER_TRANSITION_DURATION, RIGHT_DRAWER_WIDTH } from "../../constants"
import { ChatProvider, useMobile } from "../../containers"
import { useToggle } from "../../hooks"
import { RightDrawerHashes } from "../../routes"
import { colors, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"
import { LiveChat } from "./LiveChat/LiveChat"
import { PlayerList } from "./PlayerList/PlayerList"
import { Socials } from "./Social/Social"

export const RightDrawer = () => {
    const { isMobile } = useMobile()
    if (isMobile) return null
    // For non mobile only
    return <RightDrawerInner />
}

const RightDrawerInner = () => {
    const [isDrawerOpen, toggleIsDrawerOpen] = useToggle()
    const location = useLocation()

    useEffect(() => {
        toggleIsDrawerOpen(location.hash !== RightDrawerHashes.None)
    }, [location.hash, toggleIsDrawerOpen])

    const drawerContent = useMemo(() => {
        switch (location.hash) {
            case RightDrawerHashes.PlayerList:
                return <PlayerList />
            case RightDrawerHashes.Socials:
                return <Socials />
            case RightDrawerHashes.LiveChat:
            default:
                return <LiveChat />
        }
    }, [location.hash])

    return (
        <ChatProvider>
            <DrawerButtons />
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isDrawerOpen}
                variant="persistent"
                anchor="right"
                sx={{
                    flexShrink: 0,
                    width: isDrawerOpen ? `${RIGHT_DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.RightDrawer,
                    "& .MuiDrawer-paper": {
                        width: `${RIGHT_DRAWER_WIDTH}rem`,
                        backgroundColor: colors.darkNavy,
                        position: "absolute",
                        borderLeft: 0,
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </ChatProvider>
    )
}
