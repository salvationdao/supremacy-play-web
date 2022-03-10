import { Stack, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { FactionsColorResponse, useGame, useGameServerWebsocket, WebSocketProperties } from "../../containers"
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
    const { factionsColor } = useGame()
    const { state, subscribe, subscribeNetMessage } = useGameServerWebsocket()

    return (
        <LiveCountsInner
            factionsColor={factionsColor}
            state={state}
            subscribe={subscribe}
            subscribeNetMessage={subscribeNetMessage}
        />
    )
}

interface LiveCountsProps extends Partial<WebSocketProperties> {
    factionsColor?: FactionsColorResponse
}

export const LiveCountsInner = ({ factionsColor, subscribe, subscribeNetMessage, state }: LiveCountsProps) => {
    const [viewers, setViewers] = useState<ViewerLiveCount>()

    // Triggered live viewer count tick
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<ViewerLiveCount>(
            GameServerKeys.TriggerViewerLiveCountUpdated,
            (payload) => {
                setViewers(payload)
            },
            null,
        )
    }, [state, subscribe])

    if (!viewers) return null

    return (
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <SvgUser size="9px" fill={colors.text} />
            <Typography variant="body2" sx={{ lineHeight: 1, whiteSpace: "nowrap" }}>
                LIVE VIEWERS:{" "}
            </Typography>

            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center">
                <ReUsedText
                    text={Math.abs(viewers.red_mountain).toFixed()}
                    color={factionsColor?.red_mountain}
                    tooltip="Red Mountain"
                />
                <ReUsedText
                    text={Math.abs(viewers.boston).toFixed()}
                    color={factionsColor?.boston}
                    tooltip="Boston Cybernetics"
                />
                <ReUsedText
                    text={Math.abs(viewers.zaibatsu).toFixed()}
                    color={factionsColor?.zaibatsu}
                    tooltip="Zaibatsu Heavy Industries"
                />
                <Stack sx={{ display: "none" }}>
                    <ReUsedText
                        text={Math.abs(viewers.Other).toFixed()}
                        color={"grey !important"}
                        tooltip="Not enlisted"
                    />
                </Stack>
            </Stack>
        </Stack>
    )
}
