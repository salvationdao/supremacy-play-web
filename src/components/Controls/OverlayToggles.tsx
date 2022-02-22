import { IconButton, Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../assets"
import { useOverlayToggles } from '../../containers'

export const OverlayToggles = () => {
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                OVERLAYS:{" "}
            </Typography>

            {/* Live Chart */}
            <IconButton
                size="small"
                onClick={toggleIsLiveChartOpen}
                sx={{ opacity: isLiveChartOpen ? 1 : 0.2, transition: "all .2s", ":hover": { opacity: 1 } }}
            >
                <SvgSupToken size="13px" />
            </IconButton>

            {/* Map */}
            <IconButton
                size="small"
                onClick={toggleIsMapOpen}
                sx={{ opacity: isMapOpen ? 1 : 0.2, transition: "all .2s", ":hover": { opacity: 1 } }}
            >
                <SvgSupToken size="13px" />
            </IconButton>
        </Stack>
    )
}
