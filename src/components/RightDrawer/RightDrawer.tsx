import { Drawer } from "@mui/material"
import { useEffect, useMemo } from "react"
import { DRAWER_TRANSITION_DURATION, RIGHT_DRAWER_WIDTH } from "../../constants"
import { ChatProvider, RightDrawerPanels, useRightDrawer } from "../../containers"
import { useToggle } from "../../hooks"
import { colors, siteZIndex } from "../../theme/theme"
import { Assets } from "./Assets/Assets"
import { DrawerButtons } from "./DrawerButtons"
import { LiveChat } from "./LiveChat/LiveChat"
import { PlayerList } from "./PlayerList/PlayerList"
import { useLocation } from "react-router-dom"

export const RightDrawer = () => {
    const [isDrawerOpen, toggleIsDrawerOpen] = useToggle()
    const { activePanel, togglePanel } = useRightDrawer()
    const location = useLocation()

    useEffect(() => {
        toggleIsDrawerOpen(activePanel !== RightDrawerPanels.None)
    }, [activePanel, toggleIsDrawerOpen])

    const drawerContent = useMemo(() => {
        console.log(activePanel)
        switch (activePanel) {
            case RightDrawerPanels.LiveChat:
                return <LiveChat />
            case RightDrawerPanels.PlayerList:
                return <PlayerList />
            case RightDrawerPanels.Assets:
                return <Assets />
            default:
                return null
        }
    }, [activePanel, location.pathname])

    return (
        <ChatProvider>
            <DrawerButtons activePanel={activePanel} togglePanel={togglePanel} />
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
