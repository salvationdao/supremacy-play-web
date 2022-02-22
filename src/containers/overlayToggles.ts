import { useEffect } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"

// Control left side bar button and open states
export const OverlayTogglesContainer = createContainer(() => {
    const [isEndBattleDetailOpen, toggleIsEndBattleDetailOpen] = useToggle()
    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()
    const [isLiveChartOpen, toggleIsLiveChartOpen] = useToggle(localStorage.getItem("liveChartOverlay") === "true")
    const [isMapOpen, toggleIsMapOpen] = useToggle(localStorage.getItem("mapOverlay") === "true")

    useEffect(() => {
        localStorage.setItem("liveChartOverlay", isLiveChartOpen)
    }, [isLiveChartOpen])

    useEffect(() => {
        localStorage.setItem("mapOverlay", isMapOpen)
    }, [isMapOpen])

    return {
        isEndBattleDetailOpen,
        isEndBattleDetailEnabled,
        isLiveChartOpen,
        isMapOpen,
        toggleIsEndBattleDetailOpen,
        toggleIsEndBattleDetailEnabled,
        toggleIsLiveChartOpen,
        toggleIsMapOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
