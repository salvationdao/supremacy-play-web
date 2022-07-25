import { useMobile } from "./mobile"
import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"

enum LeftDrawerPanels {
    None = "NONE",
    EndBattleDetail = "END_BATTLE_DETAIL",
}

// Control left side bar button and open states
const OverlayTogglesContainer = createContainer(() => {
    const { isMobile } = useMobile()
    const [isLeftDrawerOpen, toggleIsLeftDrawerOpen] = useToggle(false)
    const [activePanel, setActivePanel] = useState<LeftDrawerPanels>(LeftDrawerPanels.None)

    const [showTrailer, toggleShowTrailer] = useToggle()
    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()
    const [isLiveChartOpen, toggleIsLiveChartOpen] = useToggle((localStorage.getItem("liveChartOverlay") || "true") === "true")
    const [isMapOpen, toggleIsMapOpen] = useToggle((localStorage.getItem("mapOverlay") || "true") === "true")
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

    useEffect(() => {
        if (isMobile) {
            toggleIsLiveChartOpen(true)
            toggleIsMapOpen(true)
            toggleIsBattleHistoryOpen(true)
        }
    }, [isMobile, toggleIsBattleHistoryOpen, toggleIsLiveChartOpen, toggleIsMapOpen])

    return {
        isLeftDrawerOpen,
        toggleIsLeftDrawerOpen,

        // Left side panels are a little different, only 1 can be open at a time
        isEndBattleDetailOpen: activePanel == LeftDrawerPanels.EndBattleDetail,
        toggleIsEndBattleDetailOpen,

        showTrailer,
        isLiveChartOpen,
        isEndBattleDetailEnabled,
        isMapOpen,
        isBattleHistoryOpen,
        toggleShowTrailer,
        toggleIsEndBattleDetailEnabled,
        toggleIsLiveChartOpen,
        toggleIsMapOpen,
        toggleIsBattleHistoryOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
