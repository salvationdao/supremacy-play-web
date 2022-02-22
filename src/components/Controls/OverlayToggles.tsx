import { IconButton, Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../assets"
import { useOverlayToggles } from "../../containers/overlayToggles"

export const OverlayToggles = () => {
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                OVERLAYS:{" "}
            </Typography>

            <IconButton
                size="small"
                onClick={toggleIsLiveChartOpen}
                sx={{ opacity: isLiveChartOpen ? 1 : 0.2, transition: "all .2s", ":hover": { opacity: 1 } }}
            >
                <SvgSupToken size="13px" />
            </IconButton>
        </Stack>
    )
}
