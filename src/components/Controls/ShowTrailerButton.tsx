import { Typography } from "@mui/material"
import { useOverlayToggles } from "../../containers"
import { FancyButton } from "../Common/FancyButton"

export const ShowTrailerButton = () => {
    const { showTrailer, toggleShowTrailer } = useOverlayToggles()

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "6px",
                backgroundColor: "#FFFFFF",
                opacity: showTrailer ? 0.2 : 0.001,
                sx: { position: "relative", opacity: showTrailer ? 1 : 0.8 },
            }}
            sx={{ px: "1rem", pt: ".1rem", pb: 0, color: "#FFFFFF" }}
            onClick={() => toggleShowTrailer()}
        >
            <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                WATCH TRAILER
            </Typography>
        </FancyButton>
    )
}
