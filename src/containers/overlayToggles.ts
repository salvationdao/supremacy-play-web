import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"

enum LeftDrawerPanels {
    None = "NONE",
    EndBattleDetail = "END_BATTLE_DETAIL",
}

// Control left side bar button and open states
const OverlayTogglesContainer = createContainer(() => {
    const [activePanel, setActivePanel] = useState<LeftDrawerPanels>(LeftDrawerPanels.None)

    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()
    const [isLiveChartOpen, toggleIsLiveChartOpen] = useToggle(localStorage.getItem("liveChartOverlay") === "true")
    const [isMapOpen, toggleIsMapOpen] = useToggle(localStorage.getItem("mapOverlay") === "true")
    const [isBattleHistoryOpen, toggleIsBattleHistoryOpen] = useToggle()

    useEffect(() => {
        localStorage.setItem("liveChartOverlay", isLiveChartOpen)
    }, [isLiveChartOpen])

    useEffect(() => {
        localStorage.setItem("mapOverlay", isMapOpen)
    }, [isMapOpen])

    const togglePanel = (newPanel: LeftDrawerPanels, value: boolean) => {
        setActivePanel((prev) => {
            if (prev == newPanel || !value) return LeftDrawerPanels.None
            return newPanel
        })
    }

    return {
        // Left side panels are a little different, only 1 can be open at a time
        isEndBattleDetailOpen: activePanel == LeftDrawerPanels.EndBattleDetail,
        toggleIsEndBattleDetailOpen: (value: boolean) => togglePanel(LeftDrawerPanels.EndBattleDetail, value),

        isLiveChartOpen,
        isEndBattleDetailEnabled,
        isMapOpen,
        isBattleHistoryOpen,
        toggleIsEndBattleDetailEnabled,
        toggleIsLiveChartOpen,
        toggleIsMapOpen,
        toggleIsBattleHistoryOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
