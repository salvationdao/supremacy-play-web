import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"
import { useMobile } from "./mobile"

// Control overlays, side drawers etc
const OverlayTogglesContainer = createContainer(() => {
    const { isMobile } = useMobile()
    const [isNavLinksDrawerOpen, toggleIsNavLinksDrawerOpen] = useToggle(false)
    const [leftDrawerActiveTabID, setLeftDrawerActiveTabID] = useState(localStorage.getItem("leftDrawerActiveTabID") || "")
    const [rightDrawerActiveTabID, setRightDrawerActiveTabID] = useState(localStorage.getItem("rightDrawerActiveTabID") || "")

    const [showTrailer, toggleShowTrailer] = useToggle()
    const [isBattleHistoryOpen, toggleIsBattleHistoryOpen] = useToggle()

    useEffect(() => {
        localStorage.setItem("leftDrawerActiveTabID", leftDrawerActiveTabID)
    }, [leftDrawerActiveTabID])

    useEffect(() => {
        localStorage.setItem("rightDrawerActiveTabID", rightDrawerActiveTabID)
    }, [rightDrawerActiveTabID])

    useEffect(() => {
        if (isMobile) {
            toggleIsBattleHistoryOpen(true)
        }
    }, [isMobile, toggleIsBattleHistoryOpen])

    return {
        isNavLinksDrawerOpen,
        toggleIsNavLinksDrawerOpen,

        leftDrawerActiveTabID,
        setLeftDrawerActiveTabID,

        rightDrawerActiveTabID,
        setRightDrawerActiveTabID,

        showTrailer,
        isBattleHistoryOpen,
        toggleShowTrailer,
        toggleIsBattleHistoryOpen,
    }
})

export const OverlayTogglesProvider = OverlayTogglesContainer.Provider
export const useOverlayToggles = OverlayTogglesContainer.useContainer
