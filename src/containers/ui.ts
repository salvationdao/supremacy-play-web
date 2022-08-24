import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"
import { LEFT_DRAWER_ARRAY, RIGHT_DRAWER_ARRAY } from "../routes"
import { useMobile } from "./mobile"

// Control overlays, side drawers etc
const uiContainer = createContainer(() => {
    const { isMobile } = useMobile()
    const [isNavLinksDrawerOpen, toggleIsNavLinksDrawerOpen] = useToggle(false)
    const [leftDrawerActiveTabID, setLeftDrawerActiveTabID] = useState(localStorage.getItem("leftDrawerActiveTabID") || LEFT_DRAWER_ARRAY[0]?.id || "")
    const [rightDrawerActiveTabID, setRightDrawerActiveTabID] = useState(localStorage.getItem("rightDrawerActiveTabID") || RIGHT_DRAWER_ARRAY[0]?.id || "")

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

export const UiProvider = uiContainer.Provider
export const useUI = uiContainer.useContainer
