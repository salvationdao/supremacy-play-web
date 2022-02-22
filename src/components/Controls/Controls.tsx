import { Stack } from "@mui/material"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { ResolutionSelect } from "./ResolutionSelect"
import { colors } from "../../theme/theme"
import { StreamSelect } from "./StreamSelect"
import { GAMEBAR_CONSTANTS } from "@ninjasoftware/passport-gamebar"

export const Controls = () => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                pl: `${GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth}px`,
                pt: 0.3,
                pb: 0.2,
                height: "100%",
                backgroundColor: colors.darkNavyBlue,
            }}
        >
            <Stack direction="row" spacing={2}>
                <LiveCounts />
                <OverlayToggles />
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
