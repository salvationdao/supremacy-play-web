import { Box, IconButton, Slider, Stack } from "@mui/material"
import { SvgFullscreen, SvgVolume, SvgVolumeMute } from "../../assets"
import { ControlsProps } from "./Controls"

export const VideoPlayerControls = (props: ControlsProps) => {
    const { streamContainer, fullScreenHandleContainer } = props
    const { muteToggle, isMute, volume, setVolume } = streamContainer
    const { enter, exit } = fullScreenHandleContainer

    const handleVolumeChange = (_: Event, newValue: number | number[]) => {
        setVolume(newValue as number)
    }

    return (
        <Stack direction="row" alignItems="center" sx={{ ml: "auto" }}>
            <Box sx={{ width: 200, marginRight: 5 }}>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <IconButton
                        size="small"
                        onClick={muteToggle}
                        sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                    >
                        {isMute ? <SvgVolumeMute size="14px" /> : <SvgVolume size="14px" />}
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
