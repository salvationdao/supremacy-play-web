import { Drawer } from "@mui/material"
import { useEffect, useMemo } from "react"
import { DRAWER_TRANSITION_DURATION, RIGHT_DRAWER_WIDTH } from "../../constants"
import { ChatProvider } from "../../containers"
import { useToggle } from "../../hooks"
import { colors, siteZIndex } from "../../theme/theme"
import { Assets } from "./Assets/Assets"
import { DrawerButtons } from "./DrawerButtons"
import { LiveChat } from "./LiveChat/LiveChat"
import { PlayerList } from "./PlayerList/PlayerList"
import { useLocation } from "react-router-dom"
import { RightDrawerHashes } from "../../routes"
import { Socials } from "./Social/Social"

export const RightDrawer = () => {
    const [isDrawerOpen, toggleIsDrawerOpen] = useToggle()
    const location = useLocation()

    useEffect(() => {
        toggleIsDrawerOpen(location.hash !== RightDrawerHashes.None)
    }, [location.hash, toggleIsDrawerOpen])

    const drawerContent = useMemo(() => {
        switch (location.hash) {
            case RightDrawerHashes.LiveChat:
                return <LiveChat />
            case RightDrawerHashes.PlayerList:
                return <PlayerList />
            case RightDrawerHashes.Assets:
                return <Assets />
            case RightDrawerHashes.Socials:
                return <Socials />
            default:
                return null
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
