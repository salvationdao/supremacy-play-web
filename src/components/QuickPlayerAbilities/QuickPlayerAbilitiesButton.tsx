import { IconButton, Stack } from "@mui/material"
import { useLocation } from "react-router"
import { SvgMeteor } from "../../assets"
import { useAuth, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { pulseEffect } from "../../theme/keyframes"
import { FeatureName } from "../../types"

export const QuickPlayerAbilitiesButton = () => {
    const theme = useTheme()
    const { userHasFeature } = useAuth()
    const { isQuickPlayerAbilitiesOpen, toggleIsQuickPlayerAbilitiesOpen } = useSupremacy()
    const location = useLocation()

    const inBattleArena = location.pathname === "/"

    if (!inBattleArena || !userHasFeature(FeatureName.playerAbility)) return null

    return (
        <Stack
            alignItems="center"
            sx={{
                backgroundColor: isQuickPlayerAbilitiesOpen ? theme.factionTheme.primary : `${theme.factionTheme.primary}75`,
                ":hover": { opacity: 1 },
            }}
        >
            <IconButton
                size="small"
                sx={{ animation: isQuickPlayerAbilitiesOpen ? "unset" : `${pulseEffect} 3s infinite` }}
                onClick={() => {
                    if (!inBattleArena) return
                    toggleIsQuickPlayerAbilitiesOpen()
                }}
            >
                <SvgMeteor size="1.6rem" fill={theme.factionTheme.secondary} />
            </IconButton>
        </Stack>
    )
}
