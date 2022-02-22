import { useEffect } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"

// Control left side bar button and open states
export const OverlayTogglesContainer = createContainer(() => {
    const [isEndBattleDetailOpen, toggleIsEndBattleDetailOpen] = useToggle()
    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()
    const [isLiveChartOpen, toggleIsLiveChartOpen] = useToggle(localStorage.getItem("liveChartOverlay") === "true")

    useEffect(() => {
        localStorage.setItem("liveChartOverlay", isLiveChartOpen)
    }, [isLiveChartOpen])

    return {
        isEndBattleDetailOpen,
        isEndBattleDetailEnabled,
        isLiveChartOpen,
        toggleIsEndBattleDetailOpen,
        toggleIsEndBattleDetailEnabled,
        toggleIsLiveChartOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
