import { Typography } from "@mui/material"
import { useUI } from "../../containers"
import { useTheme } from "../../containers/theme"
import { FancyButton } from "../Common/FancyButton"

export const ShowTrailerButton = () => {
    const theme = useTheme()
    const { showTrailer, toggleShowTrailer } = useUI()

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "4px",
                clipSlantSize: "0px",
                backgroundColor: theme.factionTheme.primary,
                opacity: showTrailer ? 0.5 : 0.1,
                border: { borderColor: theme.factionTheme.primary, borderThickness: "1px" },
                sx: { position: "relative", opacity: showTrailer ? 1 : 0.8 },
            }}
            sx={{ px: "1rem", pt: ".1rem", pb: 0, color: "#FFFFFF" }}
            onClick={() => toggleShowTrailer()}
        >
            <Typography variant="body2" sx={{ color: showTrailer ? theme.factionTheme.secondary : "#FFFFFF" }}>
                WATCH TRAILER
            </Typography>
        </FancyButton>
    )
}
