import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

enum DrawerPanels {
    None = "NONE",
    LiveChat = "LIVE_CHAT",
    PlayerList = "PLAYER_LIST",
    Assets = "ASSETS",
    PlayerAbilities = "PLAYER_ABILITIES",
}

export const DrawerContainer = createContainer(() => {
    const [activePanel, setActivePanel] = useState<DrawerPanels>(DrawerPanels.LiveChat)

    const togglePanel = useCallback(
        (newPanel: DrawerPanels, value?: boolean) => {
            setActivePanel((prev) => {
                if (prev == newPanel || value === false) return DrawerPanels.None
                return newPanel
            })
        },
        [setActivePanel],
    )

    return {
        isAnyPanelOpen: activePanel !== DrawerPanels.None,
        isLiveChatOpen: activePanel === DrawerPanels.LiveChat,
        isPlayerListOpen: activePanel === DrawerPanels.PlayerList,
        isAssetOpen: activePanel === DrawerPanels.Assets,
        isPlayerAbilitiesOpen: activePanel === DrawerPanels.PlayerAbilities,
        toggleIsLiveChatOpen: (value?: boolean) => togglePanel(DrawerPanels.LiveChat, value),
        toggleIsPlayerListOpen: (value?: boolean) => togglePanel(DrawerPanels.PlayerList, value),
        toggleIsAssetOpen: (value?: boolean) => togglePanel(DrawerPanels.Assets, value),
        toggleIsPlayerAbilitiesOpen: (value?: boolean) => togglePanel(DrawerPanels.PlayerAbilities, value),
    }
})

export const DrawerProvider = DrawerContainer.Provider
export const useDrawer = DrawerContainer.useContainer
