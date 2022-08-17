import { IconButton, Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgHistory, SvgRadar } from "../../assets"
import { useOverlayToggles } from "../../containers"
import { Box } from "@mui/system"

export const OverlayToggles = () => {
    const { isMapOpen, toggleIsMapOpen, isBattleHistoryOpen, toggleIsBattleHistoryOpen } = useOverlayToggles()

    return (
        <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
            <Typography variant="body2" sx={{ lineHeight: 1, mr: ".4rem" }}>
                OVERLAYS:{" "}
            </Typography>

            {/* Map */}
            <TooltipHelper
                text={
                    <>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Typography sx={{ display: "inline", textAlign: "justify" }}>Toggle the mini map</Typography>
                            <Typography sx={{ float: "right" }} fontStyle={"italic"}>
                                [m]
                            </Typography>
                        </Stack>
                        <Typography>Shown when a battle begins</Typography>
                    </>
                }
            >
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
