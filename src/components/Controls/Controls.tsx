import { Stack } from "@mui/material"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { ResolutionSelect } from "./ResolutionSelect"
import { colors } from "../../theme/theme"
import { StreamSelect } from "./StreamSelect"
import { GAMEBAR_CONSTANTS } from "../GameBar"
import { useAuth } from "../../containers"
import { shadeColor } from "../../helpers"

export const Controls = () => {
    const { user } = useAuth()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{
                pl: `${GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth}px`,
                pt: 0.3,
                pb: 0.2,
                height: "100%",
                backgroundColor:
                    user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
            }}
        >
            <Stack direction="row" spacing={2}>
                <LiveCounts />
                <OverlayToggles />
            </Stack>

            <Stack direction="row" spacing={2}>
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
