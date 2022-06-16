import { Stack, IconButton, colors } from "@mui/material"
import { useLocation } from "react-router"
import { SvgRobot } from "../../assets"
import { useSupremacy } from "../../containers"

export const MechDeployListButton = () => {
    const { mechDeployModalOpen, toggleMechDeployModalOpen } = useSupremacy()
    const location = useLocation()

    return (
        <Stack alignItems="center" sx={{ backgroundColor: mechDeployModalOpen ? colors.purple : `${colors.purple}60`, opacity: 0.9, ":hover": { opacity: 1 } }}>
            <IconButton
                size="small"
                onClick={() => {
                    if (location.pathname !== "/") return
                    toggleMechDeployModalOpen(true)
                }}
            >
                <SvgRobot size="1.6rem" />
            </IconButton>
        </Stack>
    )
}
