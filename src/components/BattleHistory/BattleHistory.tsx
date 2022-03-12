import { Fade } from "@mui/material"
import { Box } from "@mui/system"
import { useOverlayToggles } from "../../containers"
import { WaitingPage } from "./WaitingPage"

export const BattleHistory = () => {
    const { isBattleHistoryOpen } = useOverlayToggles()

    return (
        <Fade in={isBattleHistoryOpen}>
            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 45 }}>
                <WaitingPage />
            </Box>
        </Fade>
    )
}
