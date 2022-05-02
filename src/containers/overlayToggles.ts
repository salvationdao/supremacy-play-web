import { useCallback, useEffect, useState } from "react"
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
        localStorage.setItem("liveChartOverlay", isLiveChartOpen.toString())
    }, [isLiveChartOpen])

    useEffect(() => {
        localStorage.setItem("mapOverlay", isMapOpen.toString())
    }, [isMapOpen])

    const togglePanel = useCallback(
        (newPanel: LeftDrawerPanels, value?: boolean) => {
            setActivePanel((prev) => {
                if (prev == newPanel || value === false) return LeftDrawerPanels.None
                return newPanel
            })
        },
        [setActivePanel],
    )

    const toggleIsEndBattleDetailOpen = useCallback((value?: boolean) => togglePanel(LeftDrawerPanels.EndBattleDetail, value), [togglePanel])

    return {
        // Left side panels are a little different, only 1 can be open at a time
        isEndBattleDetailOpen: activePanel == LeftDrawerPanels.EndBattleDetail,
        toggleIsEndBattleDetailOpen,

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
