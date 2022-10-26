import { Modal, Stack } from "@mui/material"
import { useUI } from "../../containers"
import { siteZIndex } from "../../theme/theme"
import { NavTabs } from "./NavTabs/NavTabs"

export const MainMenuNav = () => {
    const { showMainMenu } = useUI()

    return (
        <Modal disableEscapeKeyDown open={showMainMenu} sx={{ zIndex: siteZIndex.MainMenuModal }}>
            <Stack
                alignItems="center"
                justifyContent="flex-start"
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
                <Stack sx={{ width: "calc(100% - 3rem)", maxWidth: "163rem", p: "8rem 3.6rem" }}>
                    <NavTabs />
                </Stack>
            </Stack>
        </Modal>
    )
}
