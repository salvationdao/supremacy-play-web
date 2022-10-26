import { Modal, Stack } from "@mui/material"
import { useUI } from "../../containers"
import { siteZIndex } from "../../theme/theme"

export const MainMenuNav = () => {
    const { showMainMenu } = useUI()

    if (!showMainMenu) return null

    return (
        <Modal disableEscapeKeyDown open sx={{ zIndex: siteZIndex.MainMenuModal }}>
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: siteZIndex.Modal * 2,
                    backgroundColor: "#000000",
                }}
            ></Stack>
        </Modal>
    )
}
