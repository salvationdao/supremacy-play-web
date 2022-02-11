import { Stack } from '@mui/material'
import { LiveCounts, VideoPlayerControls } from '..'

export const Controls = () => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ px: 2, py: 0.3, height: '100%' }}>
            <LiveCounts />
            <VideoPlayerControls />
        </Stack>
    )
}
