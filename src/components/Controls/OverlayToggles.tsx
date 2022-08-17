import { IconButton, Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgHistory } from "../../assets"
import { useOverlayToggles } from "../../containers"

export const OverlayToggles = () => {
    const { isBattleHistoryOpen, toggleIsBattleHistoryOpen } = useOverlayToggles()

    return (
        <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
            <Typography variant="body2" sx={{ lineHeight: 1, mr: ".4rem" }}>
                OVERLAYS:{" "}
            </Typography>

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
