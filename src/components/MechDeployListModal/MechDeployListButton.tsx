import { Stack, IconButton } from "@mui/material"
import { useLocation } from "react-router"
import { SvgRobot } from "../../assets"
import { useSupremacy } from "../../containers"
import { colors } from "../../theme/theme"

export const MechDeployListButton = () => {
    const { mechDeployModalOpen, toggleMechDeployModalOpen } = useSupremacy()
    const location = useLocation()

    return (
        <Stack alignItems="center" sx={{ backgroundColor: mechDeployModalOpen ? colors.green : `${colors.green}90`, opacity: 0.9, ":hover": { opacity: 1 } }}>
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
