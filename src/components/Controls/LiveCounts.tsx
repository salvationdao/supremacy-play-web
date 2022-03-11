import { Stack, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { FactionsAll, useGame, useGameServerAuth, useGameServerWebsocket, WebSocketProperties } from "../../containers"
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
    const { userID } = useGameServerAuth()

    // Triggered live viewer count tick
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<ViewerLiveCount>(
            GameServerKeys.TriggerViewerLiveCountUpdated,
            (payload) => {
                setViewers(payload)
            },
            null,
            true,
        )
    }, [state, subscribe, userID])

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
                    color={factionsAll["98bf7bb3-1a7c-4f21-8843-458d62884060"]?.theme.primary}
                    tooltip="Red Mountain"
                />
                <ReUsedText
                    text={Math.abs(viewers.boston).toFixed()}
                    color={factionsAll["7c6dde21-b067-46cf-9e56-155c88a520e2"]?.theme.primary}
                    tooltip="Boston Cybernetics"
                />
                <ReUsedText
                    text={Math.abs(viewers.zaibatsu).toFixed()}
                    color={factionsAll["880db344-e405-428d-84e5-6ebebab1fe6d"]?.theme.primary}
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
