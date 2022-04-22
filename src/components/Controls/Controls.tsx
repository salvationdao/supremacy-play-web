import { Stack } from "@mui/material"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { ResolutionSelect } from "./ResolutionSelect"
import { colors } from "../../theme/theme"
import { StreamSelect } from "./StreamSelect"
import { useGameServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { CONTROLS_HEIGHT, DRAWER_BAR_WIDTH } from "../../constants"
import { BattleStats } from "../BattleStats/BattleStats"

export const Controls = () => {
    const { user } = useGameServerAuth()

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
                pl: `${DRAWER_BAR_WIDTH}rem`,
                pt: ".24rem",
                pb: ".16rem",
                backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
            }}
        >
            <Stack direction="row" spacing="1.6rem">
                <LiveCounts />
                <BattleStats />
                <OverlayToggles />
            </Stack>

            <Stack direction="row" spacing="1.6rem">
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
