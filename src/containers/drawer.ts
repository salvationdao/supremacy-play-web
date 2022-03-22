import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

enum DrawerPanels {
    None = "NONE",
    LiveChat = "LIVE_CHAT",
    Assets = "ASSETS",
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
        isAnyPanelOpen: activePanel != DrawerPanels.None,
        isLiveChatOpen: activePanel == DrawerPanels.LiveChat,
        isAssetOpen: activePanel == DrawerPanels.Assets,
        toggleIsLiveChatOpen: (value?: boolean) => togglePanel(DrawerPanels.LiveChat, value),
        toggleIsAssetOpen: (value?: boolean) => togglePanel(DrawerPanels.Assets, value),
    }
})

export const DrawerProvider = DrawerContainer.Provider
export const useDrawer = DrawerContainer.useContainer
