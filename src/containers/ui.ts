import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"
import { LeftRoutes, RightRoutes } from "../routes"
import { useMobile } from "./mobile"

// Control overlays, side drawers etc
const uiContainer = createContainer(() => {
    const isTutorial = location.pathname.includes("/tutorial")
    const { pathname } = useLocation()
    const { isMobile } = useMobile()
    const [leftDrawerActiveTabID, setLeftDrawerActiveTabID] = useState(localStorage.getItem("leftDrawerActiveTabID") || LeftRoutes[0]?.id || undefined)
    const [rightDrawerActiveTabID, setRightDrawerActiveTabID] = useState(
        isTutorial ? "" : localStorage.getItem("rightDrawerActiveTabID") || RightRoutes[0]?.id || undefined,
    )
    // Big display vs left drawer
    const [smallDisplayRef, setSmallDisplayRef] = useState<HTMLDivElement | null>(null)
    const [bigDisplayRef, setBigDisplayRef] = useState<HTMLDivElement | null>(null)
    const [isStreamBigDisplay, setIsStreamBigDisplay] = useState((localStorage.getItem("isStreamBigDisplay") || "true") === "true")
    const prevIsStreamBigDisplay = useRef<boolean>()

    const [showTrailer, toggleShowTrailer] = useToggle()
    const [isBattleHistoryOpen, toggleIsBattleHistoryOpen] = useToggle()
    const [stopMapRender, setStopMapRender] = useState(false)
    const [showMainMenu, toggleShowMainMenu] = useToggle()

    useEffect(() => {
        localStorage.setItem("leftDrawerActiveTabID", leftDrawerActiveTabID || "")
    }, [leftDrawerActiveTabID])

    useEffect(() => {
        localStorage.setItem("rightDrawerActiveTabID", rightDrawerActiveTabID || "")
    }, [rightDrawerActiveTabID])

    useEffect(() => {
        if (pathname.includes("/tutorial")) {
            setRightDrawerActiveTabID("")
        }
    }, [pathname])

    useEffect(() => {
        if (isMobile) {
            toggleIsBattleHistoryOpen(true)
        }
    }, [isMobile, toggleIsBattleHistoryOpen])

    useEffect(() => {
        localStorage.setItem("isStreamBigDisplay", isStreamBigDisplay.toString())
    }, [isStreamBigDisplay])

    // Check if the UI has any modals open
    const hasModalsOpen = useCallback(() => {
        return !!document.querySelector(".MuiModal-root")
    }, [])

    // Toggles the big display, memorizes the previous value
    const toggleIsStreamBigDisplayMemorized = useCallback(
        (value: boolean) => {
            if (hasModalsOpen()) return
            setIsStreamBigDisplay((prev) => {
                if (prevIsStreamBigDisplay.current === undefined) prevIsStreamBigDisplay.current = prev
                return value
            })
        },
        [hasModalsOpen],
    )

    const restoreIsStreamBigDisplayMemorized = useCallback(() => {
        if (hasModalsOpen()) return
        if (prevIsStreamBigDisplay.current !== undefined) {
            setIsStreamBigDisplay(prevIsStreamBigDisplay.current)
            prevIsStreamBigDisplay.current = undefined
        }
    }, [hasModalsOpen])

    return {
        smallDisplayRef,
        setSmallDisplayRef,
        bigDisplayRef,
        setBigDisplayRef,
        isStreamBigDisplay,
        setIsStreamBigDisplay,
        toggleIsStreamBigDisplayMemorized,
        restoreIsStreamBigDisplayMemorized,

        leftDrawerActiveTabID,
        setLeftDrawerActiveTabID,

        rightDrawerActiveTabID,
        setRightDrawerActiveTabID,

        showTrailer,
        isBattleHistoryOpen,
        toggleShowTrailer,
        toggleIsBattleHistoryOpen,

        hasModalsOpen,
        stopMapRender,
        setStopMapRender,
        showMainMenu,
        toggleShowMainMenu,
    }
})

export const UiProvider = uiContainer.Provider
export const useUI = uiContainer.useContainer
