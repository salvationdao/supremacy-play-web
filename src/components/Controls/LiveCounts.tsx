import { Stack, Box, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { SvgUser } from "../../assets"
import { useGame, useWebsocket } from "../../containers"
import HubKey from "../../keys"
import { colors } from "../../theme/theme"
import { NetMessageType, ViewerLiveCount } from "../../types"

const ReUsedText = ({ text, color }: { text: string; color?: string }) => {
    return (
        <Typography variant="body2" sx={{ color: color || colors.text }}>
            {text}
        </Typography>
    )
}

export const LiveCounts = () => {
    const { state, subscribe, subscribeNetMessage } = useWebsocket()
    const { factionsColor } = useGame()
    const [viewers, setViewers] = useState<ViewerLiveCount>()
    // Triggered live viewer count tick
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(HubKey.TriggerViewerLiveCountUpdated, () => console.log(""), null)
    }, [state, subscribe])
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<ViewerLiveCount | undefined>(NetMessageType.ViewerLiveCountTick, (payload) => {
            if (!payload) return
            setViewers(payload)
        })
    }, [state, subscribeNetMessage])

    if (!viewers) return null

    return (
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <SvgUser size="9px" />
            <Typography variant="body2">LIVE VIEWERS: </Typography>

            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center">
                <ReUsedText text={viewers.RedMountain.toFixed()} color={factionsColor?.redMountain} />
                <ReUsedText text={viewers.Boston.toFixed()} color={factionsColor?.boston} />
                <ReUsedText text={viewers.Zaibatsu.toFixed()} color={factionsColor?.zaibatsu} />
                <ReUsedText text={viewers.Other.toFixed()} color={"grey !important"} />
            </Stack>
        </Stack>
    )
}
