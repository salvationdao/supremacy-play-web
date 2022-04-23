import { Stack } from "@mui/material"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { CONTROLS_HEIGHT } from "../../constants"
import { useGameServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"
import { BattleStats } from "../BattleStats/BattleStats"
import { ResolutionSelect } from "./ResolutionSelect"
import { StreamSelect } from "./StreamSelect"

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
                px: "1rem",
                pt: ".24rem",
                pb: ".16rem",
                backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
            }}
        >
            <Stack direction="row" spacing="1.6rem">
                <LiveCounts />
                <OverlayToggles />
                <BattleStats />
            </Stack>

            <Stack direction="row" spacing="1.6rem">
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
