import { Button, Typography, useTheme, Theme } from "@mui/material"
import { useOverlayToggles } from "../../containers"

export const PreviousBattle = () => {
    const theme = useTheme<Theme>()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, isEndBattleDetailEnabled } = useOverlayToggles()

    return (
        <Button
            disabled={!isEndBattleDetailEnabled}
            onClick={() => toggleIsEndBattleDetailOpen()}
            sx={{
                flexShrink: 0,
                color: theme.factionTheme.primary,
                backgroundColor: isEndBattleDetailOpen ? `${theme.factionTheme.primary}20` : `${theme.factionTheme.primary}06`,
                borderRadius: 0,
            }}
        >
            <Typography variant="caption">PREVIOUS BATTLE</Typography>
        </Button>
    )
}
