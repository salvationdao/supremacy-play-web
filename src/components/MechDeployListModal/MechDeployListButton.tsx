import { Stack, IconButton, colors } from "@mui/material"
import { SvgRobot } from "../../assets"
import { useSupremacy } from "../../containers"

export const MechDeployListButton = () => {
    const { mechDeployModalOpen, toggleMechDeployModalOpen } = useSupremacy()
    return (
        <Stack alignItems="center" sx={{ backgroundColor: mechDeployModalOpen ? colors.purple : `${colors.purple}60`, opacity: 0.9, ":hover": { opacity: 1 } }}>
            <IconButton size="small" onClick={() => toggleMechDeployModalOpen()}>
                <SvgRobot size="1.7rem" />
            </IconButton>
        </Stack>
    )
}
