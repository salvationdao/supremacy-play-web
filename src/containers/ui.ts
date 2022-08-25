import { useCallback, useEffect, useRef, useState } from "react"
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

    // Big display vs left drawer
    const [smallDisplayRef, setSmallDisplayRef] = useState<HTMLDivElement | null>(null)
    const [bigDisplayRef, setBigDisplayRef] = useState<HTMLDivElement | null>(null)
    const [isStreamBigDisplay, setIsStreamBigDisplay] = useState((localStorage.getItem("isStreamBigDisplay") || "true") === "true")
    const prevIsStreamBigDisplay = useRef<boolean>()

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

    useEffect(() => {
        localStorage.setItem("isStreamBigDisplay", isStreamBigDisplay.toString())
    }, [isStreamBigDisplay])

    // Toggles the big display, memorizes the previous value
    const toggleIsStreamBigDisplayMemorized = useCallback((value: boolean) => {
        setIsStreamBigDisplay((prev) => {
            if (prevIsStreamBigDisplay.current === undefined) prevIsStreamBigDisplay.current = prev
            return value
        })
    }, [])

    const restoreIsStreamBigDisplayMemorized = useCallback(() => {
        if (prevIsStreamBigDisplay.current !== undefined) {
            setIsStreamBigDisplay(prevIsStreamBigDisplay.current)
            prevIsStreamBigDisplay.current = undefined
        }
    }, [])

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
    }
})

export const UiProvider = uiContainer.Provider
export const useUI = uiContainer.useContainer
