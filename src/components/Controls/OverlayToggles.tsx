import { IconButton, Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgTrailer, SvgUpcomingBattle } from "../../assets"
import { useUI } from "../../containers"

export const OverlayToggles = () => {
    const { showUpcomingBattle, toggleShowUpcomingBattle, showTrailer, toggleShowTrailer } = useUI()

    return (
        <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
            <Typography variant="body2" sx={{ lineHeight: 1, mr: ".4rem" }}>
                OVERLAYS:{" "}
            </Typography>

            {/* Upcoming battle */}
            <TooltipHelper text="Toggle the upcoming battle screen.">
                <IconButton
                    size="small"
                    onClick={() => {
                        toggleShowUpcomingBattle()
                    }}
                    sx={{
                        filter: showUpcomingBattle ? "grayscale(0)" : "grayscale(1)",
                        opacity: showUpcomingBattle ? 1 : 0.4,
                        transition: "all .2s",
                        ":hover": { filter: "grayscale(0.2)" },
                        ":active": { filter: "grayscale(.6)" },
                    }}
                >
                    <SvgUpcomingBattle size="1.7rem" fill="#E8BB3F" />
                </IconButton>
            </TooltipHelper>

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
            <TooltipHelper text="Watch the Supremacy trailer video.">
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
            </TooltipHelper>
        </Stack>
    )
}
