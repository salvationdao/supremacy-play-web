import { Stack, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { useGame, useWebsocket } from "../../containers"
import HubKey from "../../keys"
import { colors } from "../../theme/theme"
import { NetMessageType, ViewerLiveCount } from "../../types"

const ReUsedText = ({ text, color, tooltip }: { text: string; color?: string; tooltip: string }) => {
    return (
        <TooltipHelper text={tooltip} isCentered>
            <Typography variant="body2" sx={{ color: color || colors.text, lineHeight: 1 }}>
                {text}
            </Typography>
        </TooltipHelper>
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
            <Typography variant="body2" sx={{ lineHeight: 1, whiteSpace: "nowrap" }}>
                LIVE VIEWERS:{" "}
            </Typography>

            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center">
                <ReUsedText
                    text={Math.abs(viewers.RedMountain).toFixed()}
                    color={factionsColor?.redMountain}
                    tooltip="Red Mountain"
                />
                <ReUsedText
                    text={Math.abs(viewers.Boston).toFixed()}
                    color={factionsColor?.boston}
                    tooltip="Boston Cybernetics"
                />
                <ReUsedText
                    text={Math.abs(viewers.Zaibatsu).toFixed()}
                    color={factionsColor?.zaibatsu}
                    tooltip="Zaibatsu Heavy Industries"
                />
                {/* <ReUsedText text={Math.abs(viewers.Other).toFixed()} color={"grey !important"} tooltip="Not enlisted" /> */}
            </Stack>
        </Stack>
    )
}
