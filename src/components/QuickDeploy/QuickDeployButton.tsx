import { Stack, IconButton } from "@mui/material"
import { useLocation } from "react-router"
import { SvgRobot } from "../../assets"
import { useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { pulseEffect } from "../../theme/keyframes"

export const QuickDeployButton = () => {
    const theme = useTheme()
    const { mechDeployModalOpen, toggleMechDeployModalOpen } = useSupremacy()
    const location = useLocation()

    const inBattleArena = location.pathname === "/"

    if (!inBattleArena) return null

    return (
        <Stack
            alignItems="center"
            sx={{
                backgroundColor: mechDeployModalOpen ? theme.factionTheme.primary : `${theme.factionTheme.primary}75`,
                ":hover": { opacity: 1 },
            }}
        >
            <IconButton
                size="small"
                sx={{ animation: mechDeployModalOpen ? "unset" : `${pulseEffect} 3s infinite` }}
                onClick={() => {
                    if (!inBattleArena) return
                    toggleMechDeployModalOpen()
                }}
            >
                <SvgRobot size="1.6rem" fill={theme.factionTheme.secondary} />
            </IconButton>
        </Stack>
    )
}
