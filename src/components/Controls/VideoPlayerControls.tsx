import { Box, IconButton, Slider, Stack } from "@mui/material"
import { FullScreenHandle } from "react-full-screen"
import { SvgFullscreen, SvgVolume, SvgVolumeMute } from "../../assets"
import { useStream } from "../../containers"

export interface VideoPlayerControlsProps {
    fullScreenHandleContainer: FullScreenHandle
}
export const VideoPlayerControls = (props: VideoPlayerControlsProps) => {
    const { enter, exit } = props.fullScreenHandleContainer
    const { toggleIsMute, isMute, volume, setVolume } = useStream()

    const handleVolumeChange = (_: Event, newValue: number | number[]) => {
        setVolume(newValue as number)
    }

    return (
        <Stack direction="row" alignItems="center">
            <Box sx={{ width: 200, mr: 2 }}>
                <Stack spacing={1} direction="row" alignItems="center">
                    <IconButton
                        size="small"
                        onClick={toggleIsMute}
                        sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                    >
                        {isMute ? (
                            <SvgVolumeMute size="14px" sx={{ pb: 0 }} />
                        ) : (
                            <SvgVolume size="14px" sx={{ pb: 0 }} />
                        )}
                    </IconButton>
                    <Slider
                        size="small"
                        min={0.1}
                        max={1}
                        step={0.01}
                        aria-label="Volume"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </Stack>
            </Box>

            <IconButton
                size="small"
                onClick={() => {
                    if (window.innerWidth == screen.width && window.innerHeight == screen.height) {
                        exit()
                        return
                    }
                    enter()
                }}
                sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
            >
                <SvgFullscreen size="14px" />
            </IconButton>
        </Stack>
    )
}
