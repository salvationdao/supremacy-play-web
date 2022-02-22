import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"

enum LeftDrawerPanels {
    None = "NONE",
    EndBattleDetail = "END_BATTLE_DETAIL",
}

// Control left side bar button and open states
export const OverlayTogglesContainer = createContainer(() => {
    const [activePanel, setActivePanel] = useState<LeftDrawerPanels>(LeftDrawerPanels.None)

    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()
    const [isLiveChartOpen, toggleIsLiveChartOpen] = useToggle(localStorage.getItem("liveChartOverlay") === "true")

    useEffect(() => {
        localStorage.setItem("liveChartOverlay", isLiveChartOpen)
    }, [isLiveChartOpen])

    const togglePanel = (newPanel: LeftDrawerPanels, value: boolean) => {
        setActivePanel((prev) => {
            if (prev == newPanel || !value) return LeftDrawerPanels.None
            return newPanel
        })
    }

    return {
        isEndBattleDetailOpen: activePanel == LeftDrawerPanels.EndBattleDetail,
        toggleIsEndBattleDetailOpen: (value: boolean) => togglePanel(LeftDrawerPanels.EndBattleDetail, value),
        isLiveChartOpen,
        isEndBattleDetailEnabled,
        toggleIsEndBattleDetailEnabled,
        toggleIsLiveChartOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
