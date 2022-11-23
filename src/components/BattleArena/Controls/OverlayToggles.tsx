import { IconButton, Stack, Typography } from "@mui/material"
import { NiceTooltip } from "../.."
import { SvgMeteor, SvgTrailer } from "../../../assets"
import { useSupremacy, useUI } from "../../../containers"

export const OverlayToggles = () => {
    const { isTransparentMode, setIsTransparentMode } = useSupremacy()
    const { showTrailer, toggleShowTrailer } = useUI()

    return (
        <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
            <Typography variant="body2" sx={{ lineHeight: 1, mr: ".4rem" }}>
                OVERLAYS:{" "}
            </Typography>
            {/* Battle history */}
            {/* <TooltipHelper text="Toggle the battle history page.">
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
            </TooltipHelper> */}
            {/* Watch trailer */}
            <NiceTooltip text="Watch the Supremacy trailer video.">
                <IconButton
                    size="small"
                    onClick={() => toggleShowTrailer()}
                    sx={{
                        filter: showTrailer ? "grayscale(0)" : "grayscale(1)",
                        opacity: showTrailer ? 1 : 0.4,
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgTrailer size="1.7rem" fill="#E8BB3F" />
                </IconButton>
            </NiceTooltip>

            {/* Desktop client mode */}
            <NiceTooltip text="Desktop client mode.">
                <IconButton
                    size="small"
                    onClick={() => setIsTransparentMode((prev) => !prev)}
                    sx={{
                        filter: isTransparentMode ? "grayscale(0)" : "grayscale(1)",
                        opacity: isTransparentMode ? 1 : 0.4,
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgMeteor size="1.7rem" fill="#E8BB3F" />
                </IconButton>
            </NiceTooltip>
        </Stack>
    )
}
