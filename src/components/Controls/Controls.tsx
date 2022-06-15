import { Stack } from "@mui/material"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { CONTROLS_HEIGHT } from "../../constants"
import { useOverlayToggles } from "../../containers"
import { siteZIndex } from "../../theme/theme"
import { BattleStats } from "../BattleStats/BattleStats"
import { PreviousBattle } from "./PreviousBattle"
import { ResolutionSelect } from "./ResolutionSelect"
import { StreamSelect } from "./StreamSelect"

export const Controls = () => {
    const { isLiveChartOpen } = useOverlayToggles()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing="1.6rem"
            sx={{
                position: "relative",
                width: "100%",
                height: `${CONTROLS_HEIGHT}rem`,
                pr: "1rem",
                pt: ".24rem",
                pb: ".16rem",
                background: (theme) => `linear-gradient(#FFFFFF03 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.Controls,
                overflowX: "auto",
                overflowY: "hidden",

                "::-webkit-scrollbar": {
                    height: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 0,
                },
                "::-webkit-scrollbar-thumb": {
                    background: (theme) => `${theme.factionTheme.primary}50`,
                    borderRadius: 0,
                },
            }}
        >
            <Stack direction="row" spacing="1.6rem" sx={{ flexShrink: 0, height: "100%" }}>
                <PreviousBattle />
                <LiveCounts />
                <OverlayToggles />
                <BattleStats hideContributionTotal={isLiveChartOpen} hideContributorAmount={isLiveChartOpen} />
            </Stack>

            <Stack id="tutorial-stream-options" direction="row" spacing="1.6rem" sx={{ flexShrink: 0, height: "100%" }}>
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
