import { Stack, IconButton } from "@mui/material"
import { useLocation } from "react-router"
import { SvgRobot } from "../../assets"
import { useSupremacy } from "../../containers"
import { colors } from "../../theme/theme"

export const QuickDeployButton = () => {
    const { mechDeployModalOpen, toggleMechDeployModalOpen } = useSupremacy()
    const location = useLocation()

    const inBattleArena = location.pathname === "/"

    if (!inBattleArena) return null

    return (
        <Stack alignItems="center" sx={{ backgroundColor: mechDeployModalOpen ? colors.green : `${colors.green}90`, opacity: 0.9, ":hover": { opacity: 1 } }}>
            <IconButton
                size="small"
                onClick={() => {
                    if (!inBattleArena) return
                    toggleMechDeployModalOpen(true)
                }}
            >
                <SvgRobot size="1.6rem" />
            </IconButton>
        </Stack>
    )
}
