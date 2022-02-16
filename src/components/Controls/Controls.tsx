import { Stack } from '@mui/material'
import { LiveCounts, VideoPlayerControls } from '..'
import { Stream } from '../../types'
import StreamSelect from '../Stream/streamSelect'

interface ControlsProps {
    setCurrentStream: (s: Stream) => void
    currentStream: Stream | undefined
}

export const Controls = ({ setCurrentStream, currentStream }: ControlsProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, pt: 0.3, pb: 0.2, height: '100%' }}
        >
            <LiveCounts />
            <Stack direction="row" sx={{ height: '100%' }}>
                <StreamSelect setCurrentStream={setCurrentStream} currentStream={currentStream} />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
