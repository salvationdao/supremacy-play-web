import { Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { useSupremacy } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Faction, ViewerLiveCount } from "../../types"

export const LiveCounts = () => {
    const { getFaction } = useSupremacy()
    const viewers = useGameServerSubscription<ViewerLiveCount>({
        URI: "/public/live_viewer_count",
        key: GameServerKeys.SubViewersLiveCount,
    })

    return <LiveCountsInner getFaction={getFaction} viewers={viewers} />
}

interface InnerProps {
    getFaction?: (factionID: string) => Faction
    viewers?: ViewerLiveCount
}

export const LiveCountsInner = ({ getFaction, viewers }: InnerProps) => {
    if (!viewers || !getFaction) return null

    const total = viewers.boston + viewers.red_mountain + viewers.zaibatsu + viewers.other

    return (
        <Stack direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
            <SvgUser size=".9rem" fill={colors.text} />
            <Typography variant="body2" sx={{ lineHeight: 1, whiteSpace: "nowrap" }}>
                LIVE VIEWERS:{" "}
            </Typography>

            <Stack direction="row" spacing=".64rem" alignItems="center" justifyContent="center">
                <ReUsedText text={total.toFixed()} tooltip="Viewers" />
            </Stack>
        </Stack>
    )
}

const ReUsedText = ({ text, color, textColor, tooltip }: { text: string; color?: string; textColor?: string; tooltip: string }) => {
    return (
        <TooltipHelper color={color} textColor={textColor} text={tooltip} isCentered>
            <Typography variant="body2" sx={{ color: color || colors.text, lineHeight: 1 }}>
                {text}
            </Typography>
        </TooltipHelper>
    )
}
