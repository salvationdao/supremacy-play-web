import { Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useActiveRouteID } from "../../hooks/useActiveRouteID"
import { RouteGroupID, Routes } from "../../routes"
import { fonts, siteZIndex } from "../../theme/theme"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NavTabs } from "./NavTabs/NavTabs"
import { TabContent } from "./TabContent/TabContent"

export const MainMenuNav = () => {
    const theme = useTheme()
    const { showMainMenu, toggleShowMainMenu } = useUI()
    const activeRouteID = useActiveRouteID()
    const [activeTabID, setActiveTabID] = useState<RouteGroupID>()

    useEffect(() => {
        // no active tab, then we set it based on current page
        setActiveTabID((prev) => {
            if (prev) return prev
            return Routes.find((route) => route.id === activeRouteID)?.showInMainMenu?.groupID || RouteGroupID.BattleArena
        })
    }, [activeRouteID])

    return (
        <Modal open={showMainMenu} onClose={() => toggleShowMainMenu(false)} sx={{ zIndex: siteZIndex.MainMenuModal }}>
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
                    <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} />

                    <TabContent activeTabID={activeTabID} />

                    <NiceButton
                        sheen
                        sx={{ alignSelf: "center", px: "3.8rem" }}
                        onClick={() => toggleShowMainMenu(false)}
                        border={{ color: theme.factionTheme.primary }}
                    >
                        <Stack direction="row" alignItems="center" spacing=".4rem">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                CLOSE
                            </Typography>
                        </Stack>
                    </NiceButton>
                </Stack>
            </Stack>
        </Modal>
    )
}
