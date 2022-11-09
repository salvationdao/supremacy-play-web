import { Modal, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { RouteGroupID, RouteGroups } from "../../routes"
import { fonts, siteZIndex } from "../../theme/theme"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { TabContent } from "./TabContent/TabContent"

export const MainMenuNav = () => {
    const theme = useTheme()
    const { showMainMenu, toggleShowMainMenu } = useUI()
    const activeRoute = useActiveRouteID()
    const [activeTabID, setActiveTabID] = useState<RouteGroupID>()

    // Set the current active tab based on the current active route
    useEffect(() => {
        setActiveTabID((prev) => {
            if (prev) return prev
            // If no active tab, then we set it based on current page
            return activeRoute?.showInMainMenu?.groupID || RouteGroupID.BattleArena
        })
    }, [activeRoute])

    const tabs = useMemo(() => RouteGroups.map((routeGroup) => ({ id: routeGroup.id, label: routeGroup.label })), [])

    const prevTab = useCallback(
        (_activeTabID: RouteGroupID) => {
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = curIndex - 1 < 0 ? tabs.length - 1 : curIndex - 1
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    const nextTab = useCallback(
        (_activeTabID: RouteGroupID) => {
            const curIndex = tabs.findIndex((routeGroup) => routeGroup.id === _activeTabID)
            const newIndex = (curIndex + 1) % tabs.length
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    return (
        <Modal id="main-menu-modal" open={showMainMenu} onClose={() => toggleShowMainMenu(false)} sx={{ zIndex: siteZIndex.MainMenuModal }}>
            <Stack
                alignItems="center"
                justifyContent="flex-start"
                spacing="2rem"
                sx={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: siteZIndex.MainMenuModal,
                    backgroundColor: "#00000050",
                    backdropFilter: "blur(6px)",
                }}
            >
                <Stack sx={{ width: "calc(100% - 3rem)", maxWidth: "153rem", height: "100%", p: "8rem 3.6rem" }} spacing="2.6rem">
                    <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

                    <TabContent activeTabID={activeTabID} />

                    <NiceButton
                        sx={{ alignSelf: "center", px: "3.8rem" }}
                        onClick={() => toggleShowMainMenu(false)}
                        border={{ color: theme.factionTheme.primary }}
                    >
                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            CLOSE
                        </Typography>
                    </NiceButton>
                </Stack>
            </Stack>
        </Modal>
    )
}
