import { Drawer } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { DRAWER_TRANSITION_DURATION, RIGHT_DRAWER_WIDTH } from "../../constants"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { Assets } from "./Assets/Assets"
import { DrawerButtons } from "./DrawerButtons"
import { LiveChat } from "./LiveChat/LiveChat"
import { PlayerList } from "./PlayerList/PlayerList"

export enum DrawerPanels {
    None = "NONE",
    LiveChat = "LIVE_CHAT",
    PlayerList = "PLAYER_LIST",
    Assets = "ASSETS",
}

export const RightDrawer = () => {
    const [isDrawerOpen, toggleIsDrawerOpen] = useToggle()
    const [activePanel, setActivePanel] = useState<DrawerPanels>(DrawerPanels.LiveChat)

    const togglePanel = useCallback(
        (newPanel: DrawerPanels, value?: boolean) => {
            setActivePanel((prev) => {
                if (prev === newPanel || value === false) return DrawerPanels.None
                return newPanel
            })
        },
        [setActivePanel],
    )

    useEffect(() => {
        toggleIsDrawerOpen(activePanel !== DrawerPanels.None)
    }, [activePanel])

    const drawerContent = useMemo(() => {
        switch (activePanel) {
            case DrawerPanels.LiveChat:
                return <LiveChat />
            case DrawerPanels.PlayerList:
                return <PlayerList />
            case DrawerPanels.Assets:
                return <Assets />
            default:
                return null
        }
    }, [activePanel])

    return (
        <>
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
        </>
    )
}
