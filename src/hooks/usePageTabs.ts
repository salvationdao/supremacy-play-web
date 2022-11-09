import { useCallback, useEffect, useMemo, useState } from "react"
import { useActiveRouteID } from "../hooks/useActiveRouteID"
import { Routes, RouteSingleID } from "../routes"

// This hook does all the hard work for you when implementing a nav tab
// inside page to nav between other pages in the same route group
export const usePageTabs = () => {
    const activeRoute = useActiveRouteID()
    const [activeTabID, setActiveTabID] = useState<RouteSingleID>()

    // Work out an array of tabs to show based on the current active route
    const tabs = useMemo(
        () =>
            Routes.filter((route) => route.showInMainMenu?.groupID === activeRoute?.showInMainMenu?.groupID).map((route) => ({
                id: route.id,
                label: route.showInMainMenu?.label || "---",
            })),
        [activeRoute?.showInMainMenu?.groupID],
    )

    // Set the current active tab based on the current active route
    useEffect(() => {
        setActiveTabID((prev) => {
            if (prev) return prev
            // If no active tab, then we set it based on current page
            return activeRoute?.id || RouteSingleID.Home
        })
    }, [activeRoute])

    const prevTab = useCallback(
        (_activeTabID: RouteSingleID) => {
            // If main menu modal is open, then ignore key events
            if (document.getElementById("main-menu-modal")) return
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = curIndex - 1 < 0 ? tabs.length - 1 : curIndex - 1
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    const nextTab = useCallback(
        (_activeTabID: RouteSingleID) => {
            // If main menu modal is open, then ignore key events
            if (document.getElementById("main-menu-modal")) return
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = (curIndex + 1) % tabs.length
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    return {
        tabs,
        activeTabID,
        setActiveTabID,
        prevTab,
        nextTab,
    }
}
