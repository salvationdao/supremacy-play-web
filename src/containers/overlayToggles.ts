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
    const [isNavLinksDrawerOpen, toggleIsNavLinksDrawerOpen] = useToggle(false)
    const [activePanel, setActivePanel] = useState<LeftDrawerPanels>(LeftDrawerPanels.None)

    const [showTrailer, toggleShowTrailer] = useToggle()
    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()
    const [isMapOpen, toggleIsMapOpen] = useToggle((localStorage.getItem("mapOverlay") || "true") === "true")
    const [isBattleHistoryOpen, toggleIsBattleHistoryOpen] = useToggle()

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
            toggleIsMapOpen(true)
            toggleIsBattleHistoryOpen(true)
        }
    }, [isMobile, toggleIsBattleHistoryOpen, toggleIsMapOpen])

    return {
        isNavLinksDrawerOpen,
        toggleIsNavLinksDrawerOpen,

        // Left side panels are a little different, only 1 can be open at a time
        isEndBattleDetailOpen: activePanel == LeftDrawerPanels.EndBattleDetail,
        toggleIsEndBattleDetailOpen,

        showTrailer,
        isEndBattleDetailEnabled,
        isMapOpen,
        isBattleHistoryOpen,
        toggleShowTrailer,
        toggleIsEndBattleDetailEnabled,
        toggleIsMapOpen,
        toggleIsBattleHistoryOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
