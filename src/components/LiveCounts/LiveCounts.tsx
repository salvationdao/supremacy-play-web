import { Fade, Box, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useWebsocket } from '../../containers'
import { NetMessageType, ViewerLiveCount } from '../../types'

export const LiveCounts = () => {
    const { state, subscribeNetMessage } = useWebsocket()
    const [viewers, setViewers] = useState<ViewerLiveCount>()

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<ViewerLiveCount | undefined>(NetMessageType.ViewerLiveCountTick, (payload) => {
            if (!payload) return
            setViewers(payload)
        })
    }, [state, subscribeNetMessage])

    if (!viewers) return null

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 10,
                left: 500,
                zIndex: 38,
                filter: 'drop-shadow(0 3px 3px #00000050)',
            }}
        >
            <Fade in={true}>
                <Box>
                    <Typography variant="body1">Red Mountain: {viewers.RedMountain}</Typography>
                    <Typography variant="body1">Boston Cybernetics: {viewers.Boston}</Typography>
                    <Typography variant="body1">Zaibatsu: {viewers.Zaibatsu}</Typography>
                    <Typography variant="body1">Others: {viewers.Other}</Typography>
                </Box>
            </Fade>
        </Box>
    )
}
