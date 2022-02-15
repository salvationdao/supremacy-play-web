import { VolumeDown, VolumeUp } from '@mui/icons-material'
import { Box, IconButton, Slider, Stack } from '@mui/material'
import { SvgFullscreen, SvgSettings, SvgVolume } from '../../assets'
import { ControlsProps } from './Controls'

export const VideoPlayerControls = (props: ControlsProps) => {
    const { muteToggle, screenHandler, volume, setVolume } = props
    const handleChange = (event: Event, newValue: number | number[]) => {
        console.log('this is new val', newValue)
        console.log('this is new val', newValue)
        console.log('this is new val', newValue)
        console.log('this is new val', newValue)

        setVolume(newValue as number)
    }
    return (
        <Stack direction="row" alignItems="center" sx={{ ml: 'auto' }}>
            <Box sx={{ width: 200 }}>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <IconButton
                        size="small"
                        onClick={muteToggle}
                        sx={{ opacity: 0.5, transition: 'all .2s', ':hover': { opacity: 1 } }}
                    >
                        <SvgVolume size="14px" />
                    </IconButton>
                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.1}
                        aria-label="Volume"
                        value={volume}
                        onChange={handleChange}
                    />
                </Stack>
            </Box>

            <IconButton
                size="small"
                onClick={() => alert('TODO')}
                sx={{ opacity: 0.5, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgSettings size="14px" />
            </IconButton>

            <IconButton
                size="small"
                onClick={() => {
                    if (window.innerWidth == screen.width && window.innerHeight == screen.height) {
                        screenHandler.exit()
                        return
                    }
                    screenHandler.enter()
                }}
                sx={{ opacity: 0.5, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgFullscreen size="14px" />
            </IconButton>
        </Stack>
    )
}
