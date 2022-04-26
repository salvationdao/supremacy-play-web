import { Button, Typography } from "@mui/material"
import { useOverlayToggles } from "../../containers"

export const PreviousBattle = () => {
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, isEndBattleDetailEnabled } = useOverlayToggles()

    return (
        <Button
            disabled={!isEndBattleDetailEnabled}
            onClick={() => toggleIsEndBattleDetailOpen()}
            sx={{
                flexShrink: 0,
                color: (theme) => theme.factionTheme.primary,
                backgroundColor: (theme) => (isEndBattleDetailOpen ? `${theme.factionTheme.primary}20` : `${theme.factionTheme.primary}06`),
                borderRadius: 0,
            }}
        >
            <Typography variant="caption">PREVIOUS BATTLE</Typography>
        </Button>
    )
}
