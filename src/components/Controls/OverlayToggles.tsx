import { IconButton, Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgGoldBars, SvgHistory, SvgRadar } from "../../assets"
import { useOverlayToggles } from "../../containers"

export const OverlayToggles = () => {
    const {
        isMapOpen,
        toggleIsMapOpen,
        isLiveChartOpen,
        toggleIsLiveChartOpen,
        isBattleHistoryOpen,
        toggleIsBattleHistoryOpen,
    } = useOverlayToggles()

    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1, mr: ".4rem" }}>
                OVERLAYS:{" "}
            </Typography>

            {/* Live Chart */}
            <TooltipHelper text="Toggle the live voting chart.">
                <IconButton
                    size="small"
                    onClick={() => toggleIsLiveChartOpen()}
                    sx={{
                        filter: isLiveChartOpen ? "grayscale(0)" : "grayscale(1)",
                        opacity: isLiveChartOpen ? 1 : 0.4,
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgGoldBars size="1.8rem" />
                </IconButton>
            </TooltipHelper>

            {/* Map */}
            <TooltipHelper text="Toggle the mini map, it will show when the battle begins.">
                <IconButton
                    size="small"
                    onClick={() => toggleIsMapOpen()}
                    sx={{
                        filter: isMapOpen ? "grayscale(0)" : "grayscale(1)",
                        opacity: isMapOpen ? 1 : 0.4,
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgRadar size="1.6rem" />
                </IconButton>
            </TooltipHelper>

            {/* Battle history */}
            <TooltipHelper text="Toggle the battle history page.">
                <IconButton
                    size="small"
                    onClick={() => toggleIsBattleHistoryOpen()}
                    sx={{
                        filter: isBattleHistoryOpen ? "grayscale(0)" : "grayscale(1)",
                        opacity: isBattleHistoryOpen ? 1 : 0.4,
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgHistory size="1.7rem" fill="#E8BB3F" />
                </IconButton>
            </TooltipHelper>
        </Stack>
    )
}
