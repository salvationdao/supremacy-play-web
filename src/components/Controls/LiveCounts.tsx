import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { FactionIDs } from "../../constants"
import { FactionsAll, useSupremacy, useGameServerAuth, useGameServerWebsocket, WebSocketProperties } from "../../containers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { ViewerLiveCount } from "../../types"

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
    const { factionsAll } = useSupremacy()
    const { state, subscribe, subscribeNetMessage } = useGameServerWebsocket()

    return <LiveCountsInner factionsAll={factionsAll} state={state} subscribe={subscribe} subscribeNetMessage={subscribeNetMessage} />
}

interface LiveCountsProps extends Partial<WebSocketProperties> {
    factionsAll?: FactionsAll
}

export const LiveCountsInner = ({ factionsAll, subscribe, state }: LiveCountsProps) => {
    const [viewers, setViewers] = useState<ViewerLiveCount>()
    const { userID } = useGameServerAuth()

    // Triggered live viewer count tick
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<ViewerLiveCount>(
            GameServerKeys.SubViewersLiveCount,
            (payload) => {
                setViewers(payload)
            },
            null,
            true,
        )
    }, [state, subscribe, userID])

    if (!viewers || !factionsAll) return null

    return (
        <Stack direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
            <SvgUser size=".9rem" fill={colors.text} />
            <Typography variant="body2" sx={{ lineHeight: 1, whiteSpace: "nowrap" }}>
                LIVE VIEWERS:{" "}
            </Typography>

            <Stack direction="row" spacing=".64rem" alignItems="center" justifyContent="center">
                <ReUsedText text={Math.abs(viewers.red_mountain).toFixed()} color={factionsAll[FactionIDs.RM]?.theme.primary} tooltip="Red Mountain" />
                <ReUsedText text={Math.abs(viewers.boston).toFixed()} color={factionsAll[FactionIDs.BC]?.theme.primary} tooltip="Boston Cybernetics" />
                <ReUsedText
                    text={Math.abs(viewers.zaibatsu).toFixed()}
                    color={factionsAll[FactionIDs.ZHI]?.theme.primary}
                    tooltip="Zaibatsu Heavy Industries"
                />
                <ReUsedText text={Math.abs(viewers.other).toFixed()} color={"grey !important"} tooltip="Not enlisted" />
            </Stack>
        </Stack>
    )
}
