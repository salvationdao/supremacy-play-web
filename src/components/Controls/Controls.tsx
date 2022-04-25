import { Stack, useTheme, Theme } from "@mui/material"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { CONTROLS_HEIGHT } from "../../constants"
import { useOverlayToggles } from "../../containers"
import { shadeColor } from "../../helpers"
import { BattleStats } from "../BattleStats/BattleStats"
import { PreviousBattle } from "./PreviousBattle"
import { ResolutionSelect } from "./ResolutionSelect"
import { StreamSelect } from "./StreamSelect"

export const Controls = () => {
    const theme = useTheme<Theme>()
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
                backgroundColor: shadeColor(theme.factionTheme.primary, -95),
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    height: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 0,
                },
                "::-webkit-scrollbar-thumb": {
                    background: `${theme.factionTheme.primary}50`,
                    borderRadius: 0,
                },
            }}
        >
            <Stack direction="row" spacing="1.6rem" sx={{ flexShrink: 0 }}>
                <PreviousBattle />
                <LiveCounts />
                <OverlayToggles />
                <BattleStats hideContributionTotal={isLiveChartOpen} hideContributorAmount={isLiveChartOpen} />
            </Stack>

            <Stack direction="row" spacing="1.6rem" sx={{ flexShrink: 0 }}>
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
