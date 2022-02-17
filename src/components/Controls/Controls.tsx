import { Stack } from '@mui/material'
import { FullScreenHandle } from 'react-full-screen'
import { LiveCounts, VideoPlayerControls } from '..'
import { StreamSelect } from './StreamSelect'

export interface ControlsProps {
    screenHandler: FullScreenHandle
    muteToggle: () => void
    isMute: boolean
    volume: number
    setVolume: (v: number) => void
}
export const Controls = (props: ControlsProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, pt: 0.3, pb: 0.2, height: '100%' }}
        >
            <LiveCounts />

            <Stack direction="row" spacing={1}>
                <StreamSelect />
                <VideoPlayerControls {...props} />
            </Stack>
        </Stack>
    )
}
