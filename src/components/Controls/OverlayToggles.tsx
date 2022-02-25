import { IconButton, Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgGoldBars, SvgRadar } from "../../assets"
import { useOverlayToggles } from "../../containers"

export const OverlayToggles = () => {
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()

    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1, mr: 0.5 }}>
                OVERLAYS:{" "}
            </Typography>

            {/* Live Chart */}
            <TooltipHelper text="Toggle the live voting chart.">
                <IconButton
                    size="small"
                    onClick={toggleIsLiveChartOpen}
                    sx={{
                        filter: isLiveChartOpen ? "grayscale(0)" : "grayscale(1)",
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgGoldBars size="18px" />
                </IconButton>
            </TooltipHelper>

            {/* Map */}
            <TooltipHelper text="Toggle the mini map.">
                <IconButton
                    size="small"
                    onClick={toggleIsMapOpen}
                    sx={{
                        filter: isMapOpen ? "grayscale(0)" : "grayscale(1)",
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgRadar size="17px" />
                </IconButton>
            </TooltipHelper>
        </Stack>
    )
}
