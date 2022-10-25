import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"
import { LEFT_DRAWER_ARRAY, RIGHT_DRAWER_ARRAY } from "../routes"
import { useAuth } from "./auth"
import { useMobile } from "./mobile"

// Control overlays, side drawers etc
const uiContainer = createContainer(() => {
    const isTraining = location.pathname.includes("/training")
    const { pathname } = useLocation()
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const [isNavLinksDrawerOpen, toggleIsNavLinksDrawerOpen] = useToggle(false)
    const [leftDrawerActiveTabID, setLeftDrawerActiveTabID] = useState(
        !userID ? "" : localStorage.getItem("leftDrawerActiveTabID") || LEFT_DRAWER_ARRAY[0]?.id || "",
    )
    const [rightDrawerActiveTabID, setRightDrawerActiveTabID] = useState(
        isTraining ? "" : localStorage.getItem("rightDrawerActiveTabID") || RIGHT_DRAWER_ARRAY[0]?.id || "",
    )
    // Big display vs left drawer
    const [smallDisplayRef, setSmallDisplayRef] = useState<HTMLDivElement | null>(null)
    const [bigDisplayRef, setBigDisplayRef] = useState<HTMLDivElement | null>(null)
    const [isStreamBigDisplay, setIsStreamBigDisplay] = useState((localStorage.getItem("isStreamBigDisplay") || "true") === "true")
    const prevIsStreamBigDisplay = useRef<boolean>()

    const [showTrailer, toggleShowTrailer] = useToggle()
    const [showUpcomingBattle, toggleShowUpcomingBattle] = useToggle()
    const [isBattleHistoryOpen, toggleIsBattleHistoryOpen] = useToggle()
    const [stopMapRender, setStopMapRender] = useState(false)

    useEffect(() => {
        if (userID && showUpcomingBattle) {
            setLeftDrawerActiveTabID("quick_deploy")
            return
        }
    }, [showUpcomingBattle, setLeftDrawerActiveTabID, userID])

    useEffect(() => {
        localStorage.setItem("leftDrawerActiveTabID", leftDrawerActiveTabID)
    }, [leftDrawerActiveTabID])

    useEffect(() => {
        localStorage.setItem("rightDrawerActiveTabID", rightDrawerActiveTabID)
    }, [rightDrawerActiveTabID])

    useEffect(() => {
        if (pathname.includes("/training")) {
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
        showUpcomingBattle,
        toggleShowUpcomingBattle,

        hasModalsOpen,
        stopMapRender,
        setStopMapRender,
    }
})

export const UiProvider = uiContainer.Provider
export const useUI = uiContainer.useContainer
