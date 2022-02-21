import { Stack } from "@mui/material"
import { LiveCounts, VideoPlayerControls } from ".."
import { ResolutionSelect } from "./ResolutionSelect"
import { colors } from "../../theme/theme"
import { StreamSelect } from "./StreamSelect"
import { SIDE_BARS_WIDTH } from "../../constants"

export const Controls = () => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{ pl: `${SIDE_BARS_WIDTH}px`, pt: 0.3, pb: 0.2, height: "100%", backgroundColor: colors.darkNavyBlue }}
        >
            <LiveCounts />

            <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
