import { IconButton, Stack } from '@mui/material'
import { SvgFullscreen, SvgSettings, SvgVolume } from '../../assets'
import { ControlsProps } from './Controls'

export const VideoPlayerControls = (props: ControlsProps) => {
    // console.log('this is node ', props.screenHandler.node.current.)

    return (
        <Stack direction="row" alignItems="center" sx={{ ml: 'auto' }}>
            <IconButton
                size="small"
                onClick={() => alert('TODO')}
                sx={{ opacity: 0.5, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgVolume size="14px" />
            </IconButton>

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
                        props.screenHandler.exit()
                        return
                    }
                    props.screenHandler.enter()
                }}
                sx={{ opacity: 0.5, transition: 'all .2s', ':hover': { opacity: 1 } }}
            >
                <SvgFullscreen size="14px" />
            </IconButton>
        </Stack>
    )
}
