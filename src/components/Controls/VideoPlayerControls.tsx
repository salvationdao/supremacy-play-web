import { IconButton, Stack } from '@mui/material'
import { SvgFullscreen, SvgSettings, SvgVolume } from '../../assets'

export const VideoPlayerControls = () => {
    return (
        <Stack direction="row" alignItems="center">
            <IconButton
                size="small"
                onClick={() => alert('TODO')}
                sx={{ opacity: 0.6, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgVolume size="14px" />
            </IconButton>

            <IconButton
                size="small"
                onClick={() => alert('TODO')}
                sx={{ opacity: 0.6, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgSettings size="14px" />
            </IconButton>

            <IconButton
                size="small"
                onClick={() => alert('TODO')}
                sx={{ opacity: 0.6, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgFullscreen size="14px" />
            </IconButton>
        </Stack>
    )
}
