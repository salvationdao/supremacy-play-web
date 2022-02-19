import { Stack } from "@mui/material"
import { FullScreenHandle } from "react-full-screen"
import { LiveCounts, VideoPlayerControls } from ".."
import { ResolutionSelect } from "./ResolutionSelect"
import { colors } from "../../theme/theme"
import { StreamSelect } from "./StreamSelect"
import { StreamContainerType } from "../../containers"

export interface ControlsProps {
    fullScreenHandleContainer: FullScreenHandle
    streamContainer: StreamContainerType
    forceResolutionFn: (quality: number) => void
}
export const Controls = (props: ControlsProps) => {
    const { streamContainer, forceResolutionFn } = props
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, pt: 0.3, pb: 0.2, height: "100%", backgroundColor: colors.darkNavyBlue }}
        >
            <LiveCounts />

            <Stack direction="row" spacing={1}>
                <StreamSelect />
                <ResolutionSelect forceResolutionFn={forceResolutionFn} streamContainer={streamContainer} />
                <VideoPlayerControls {...props} />
            </Stack>
        </Stack>
    )
}
