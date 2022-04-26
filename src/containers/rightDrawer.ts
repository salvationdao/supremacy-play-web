import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

export enum RightDrawerPanels {
    None = "NONE",
    LiveChat = "LIVE_CHAT",
    PlayerList = "PLAYER_LIST",
    Assets = "ASSETS",
}

export const RightDrawerContainer = createContainer(() => {
    const [activePanel, setActivePanel] = useState<RightDrawerPanels>(RightDrawerPanels.LiveChat)

    const togglePanel = useCallback(
        (newPanel: RightDrawerPanels, value?: boolean) => {
            setActivePanel((prev) => {
                if (prev === newPanel || value === false) return RightDrawerPanels.None
                return newPanel
            })
        },
        [setActivePanel],
    )

    return {
        activePanel,
        togglePanel,
    }
})

export const RightDrawerProvider = RightDrawerContainer.Provider
export const useRightDrawer = RightDrawerContainer.useContainer
