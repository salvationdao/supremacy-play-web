import { Typography } from "@mui/material"
import { useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { FancyButton } from "../Common/FancyButton"

export const ShowUpcomingBattleButton = () => {
    const theme = useTheme()
    const { showUpcomingBattle, toggleShowUpcomingBattle } = useUI()

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "4px",
                clipSlantSize: "0px",
                backgroundColor: theme.factionTheme.primary,
                opacity: showUpcomingBattle ? 0.5 : 0.1,
                border: { borderColor: theme.factionTheme.primary, borderThickness: "1px" },
                sx: { position: "relative", opacity: showUpcomingBattle ? 1 : 0.8 },
            }}
            sx={{ px: "1rem", pt: ".1rem", pb: 0, color: "#FFFFFF" }}
            onClick={() => toggleShowUpcomingBattle()}
        >
            <Typography variant="body2" sx={{ color: showUpcomingBattle ? theme.factionTheme.secondary : "#FFFFFF" }}>
                NEXT BATTLE
            </Typography>
        </FancyButton>
    )
}
