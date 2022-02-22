import { IconButton, Stack, Typography } from "@mui/material"
import { SvgGoldBars, SvgRadar } from "../../assets"
import { useGame, useOverlayToggles } from "../../containers"
import { overlayPulseEffect } from "../../theme/keyframes"

export const OverlayToggles = () => {
    const { votingState } = useGame()
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()

    const isBattleStarted = votingState && votingState.phase !== "HOLD" && votingState.phase !== "WAIT_MECH_INTRO"

    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1, mr: 0.5 }}>
                OVERLAYS:{" "}
            </Typography>

            {/* Live Chart */}
            <IconButton
                size="small"
                onClick={toggleIsLiveChartOpen}
                disabled={!isBattleStarted}
                sx={{
                    filter: isLiveChartOpen ? "grayscale(0)" : "grayscale(1)",
                    transition: "all .2s",
                    ":hover": { animation: "unset", filter: "grayscale(0)" },
                    animation: isLiveChartOpen ? "" : `${overlayPulseEffect} 6s infinite`,
                }}
            >
                <SvgGoldBars size="18px" />
            </IconButton>

            {/* Map */}
            <IconButton
                size="small"
                onClick={toggleIsMapOpen}
                disabled={!isBattleStarted}
                sx={{
                    filter: isMapOpen ? "grayscale(0)" : "grayscale(1)",
                    transition: "all .2s",
                    ":hover": { animation: "unset", filter: "grayscale(0)" },
                    animation: isMapOpen ? "" : `${overlayPulseEffect} 6s infinite`,
                }}
            >
                <SvgRadar size="17px" />
            </IconButton>
        </Stack>
    )
}
