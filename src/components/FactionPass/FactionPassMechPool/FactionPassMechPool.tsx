import { Stack } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { useActiveRouteID } from "../../../hooks/useActiveRouteID"
import { Routes, RouteSingleID } from "../../../routes"
import { NavTabs } from "../../Common/NavTabs/NavTabs"

export const FactionPassMechPool = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const activeRoute = useActiveRouteID()
    const [activeTabID, setActiveTabID] = useState<RouteSingleID>()

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

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
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = curIndex - 1 < 0 ? tabs.length - 1 : curIndex - 1
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    const nextTab = useCallback(
        (_activeTabID: RouteSingleID) => {
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = (curIndex + 1) % tabs.length
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    if (tabs.length <= 0) {
        return null
    }

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                padding: "2rem",
                position: "relative",
                height: "100%",
                backgroundColor: faction.background_color,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />
        </Stack>
    )
}
