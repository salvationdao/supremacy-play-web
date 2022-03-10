import { Stack, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { FactionsAll, useGame, useGameServerWebsocket, WebSocketProperties } from "../../containers"
import { GameServerKeys } from "../../keys"
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
    const { factionsAll } = useGame()
    const { state, subscribe, subscribeNetMessage } = useGameServerWebsocket()

    return (
        <LiveCountsInner
            factionsAll={factionsAll}
            state={state}
            subscribe={subscribe}
            subscribeNetMessage={subscribeNetMessage}
        />
    )
}

interface LiveCountsProps extends Partial<WebSocketProperties> {
    factionsAll?: FactionsAll
}

export const LiveCountsInner = ({ factionsAll, subscribe, subscribeNetMessage, state }: LiveCountsProps) => {
    const [viewers, setViewers] = useState<ViewerLiveCount>()

    // Triggered live viewer count tick
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerViewerLiveCountUpdated, () => null, null)
    }, [state, subscribe])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<ViewerLiveCount | undefined>(NetMessageType.ViewerLiveCountTick, (payload) => {
            if (!payload) return
            setViewers(payload)
        })
    }, [state, subscribeNetMessage])

    if (!viewers || !factionsAll) return null

    return (
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <SvgUser size="9px" fill={colors.text} />
            <Typography variant="body2" sx={{ lineHeight: 1, whiteSpace: "nowrap" }}>
                LIVE VIEWERS:{" "}
            </Typography>

            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center">
                <ReUsedText
                    text={Math.abs(viewers.red_mountain).toFixed()}
                    color={factionsAll["red_mountain"]?.theme.primary}
                    tooltip="Red Mountain"
                />
                <ReUsedText
                    text={Math.abs(viewers.boston).toFixed()}
                    color={factionsAll["boston"]?.theme.primary}
                    tooltip="Boston Cybernetics"
                />
                <ReUsedText
                    text={Math.abs(viewers.zaibatsu).toFixed()}
                    color={factionsAll["zaibatsu"]?.theme.primary}
                    tooltip="Zaibatsu Heavy Industries"
                />
                <Stack sx={{ display: "none" }}>
                    <ReUsedText
                        text={Math.abs(viewers.other).toFixed()}
                        color={"grey !important"}
                        tooltip="Not enlisted"
                    />
                </Stack>
            </Stack>
        </Stack>
    )
}
