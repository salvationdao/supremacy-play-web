import { Stack } from '@mui/material'
import { FullScreenHandle } from 'react-full-screen'
import { LiveCounts, VideoPlayerControls } from '..'

export interface ControlsProps {
    screenHandler: FullScreenHandle
}
export const Controls = (props: ControlsProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            sx={{ px: 2, pt: 0.3, pb: 0.2, height: '100%' }}
        >
            <LiveCounts />
            <VideoPlayerControls {...props} />
        </Stack>
    )
}
