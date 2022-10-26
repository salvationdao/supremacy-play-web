import { Modal, Stack } from "@mui/material"
import { useState } from "react"
import { useUI } from "../../containers"
import { RouteGroupID } from "../../routes"
import { siteZIndex } from "../../theme/theme"
import { NavTabs } from "./NavTabs/NavTabs"
import { TabContent } from "./TabContent/TabContent"

export const MainMenuNav = () => {
    const { showMainMenu } = useUI()
    const [activeTabID, setActiveTabID] = useState<RouteGroupID>(RouteGroupID.BattleArena)

    return (
        <Modal disableEscapeKeyDown open={showMainMenu} sx={{ zIndex: siteZIndex.MainMenuModal }}>
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
                    backdropFilter: "blur(5px)",
                }}
            >
                <Stack sx={{ width: "calc(100% - 3rem)", maxWidth: "153rem", height: "100%", p: "8rem 3.6rem" }} spacing="2.6rem">
                    <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} />

                    <TabContent activeTabID={activeTabID} />
                </Stack>
            </Stack>
        </Modal>
    )
}
