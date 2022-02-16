import { Divider, Stack } from '@mui/material'
import { LiveCounts, VideoPlayerControls } from '..'
import { colors } from '../../theme/theme'
import { Stream } from '../../types'
import { StreamSelect } from './StreamSelect'

export const Controls = () => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, pt: 0.3, pb: 0.2, height: '100%' }}
        >
            <LiveCounts />

            <Stack direction="row" spacing={1}>
                <StreamSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
