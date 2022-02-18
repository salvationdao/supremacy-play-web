import { Stack } from '@mui/material'
import { FullScreenHandle } from 'react-full-screen'
import { LiveCounts, VideoPlayerControls } from '..'
import { ResolutionSelect } from './ResolutionSelect'
import { colors } from '../../theme/theme'
import { StreamSelect } from './StreamSelect'

export interface ControlsProps {
    screenHandler: FullScreenHandle
    muteToggle: () => void
    isMute: boolean
    volume: number
    setVolume: (v: number) => void
    resolutionsList: number[]
    forceResolutionFn: (quality: number) => void
    defaultValue: number
}
export const Controls = (props: ControlsProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, pt: 0.3, pb: 0.2, height: '100%', backgroundColor: colors.darkNavyBlue }}
        >
            <LiveCounts />

            <Stack direction="row" spacing={1}>
                <StreamSelect />
                <ResolutionSelect defaultValue={props.defaultValue} />
                <VideoPlayerControls {...props} />
            </Stack>
        </Stack>
    )
}
