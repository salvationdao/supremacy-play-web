import { useState } from "react"
import { createContainer } from "unstated-next"

enum DrawerPanels {
	None = "NONE",
	LiveChat = "LIVE_CHAT",
	Assets = "ASSETS",
	MechQueue = "MECH_QUEUE",
}

export const DrawerContainer = createContainer(() => {
	const [activePanel, setActivePanel] = useState<DrawerPanels>(DrawerPanels.LiveChat)

	const togglePanel = (newPanel: DrawerPanels, value: boolean) => {
		setActivePanel((prev) => {
			if (prev == newPanel || !value) return DrawerPanels.None
			return newPanel
		})
	}

	return {
		isAnyPanelOpen: activePanel != DrawerPanels.None,
		isLiveChatOpen: activePanel == DrawerPanels.LiveChat,
		isAssetOpen: activePanel == DrawerPanels.Assets,
		isMechQueueOpen: activePanel == DrawerPanels.MechQueue,
		toggleIsLiveChatOpen: (value: boolean) => togglePanel(DrawerPanels.LiveChat, value),
		toggleIsAssetOpen: (value: boolean) => togglePanel(DrawerPanels.Assets, value),
		toggleIsMechQueueOpen: (value: boolean) => togglePanel(DrawerPanels.MechQueue, value),
	}
})

export const DrawerProvider = DrawerContainer.Provider
export const useDrawer = DrawerContainer.useContainer
