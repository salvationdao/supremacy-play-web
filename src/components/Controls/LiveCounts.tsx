import { Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgUser } from "../../assets"
import { FactionIDs } from "../../constants"
import { useSupremacy } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Faction, ViewerLiveCount } from "../../types"

export const LiveCounts = () => {
    const { getFaction } = useSupremacy()
    const viewers = useGameServerSubscription<ViewerLiveCount>({
        URI: "/public/live_data",
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

    return (
        <Stack direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
            <SvgUser size=".9rem" fill={colors.text} />
            <Typography variant="body2" sx={{ lineHeight: 1, whiteSpace: "nowrap" }}>
                LIVE VIEWERS:{" "}
            </Typography>

            <Stack direction="row" spacing=".64rem" alignItems="center" justifyContent="center">
                <ReUsedText text={Math.abs(viewers.red_mountain).toFixed()} color={getFaction(FactionIDs.RM).primary_color} tooltip="Red Mountain" />
                <ReUsedText text={Math.abs(viewers.boston).toFixed()} color={getFaction(FactionIDs.BC).primary_color} tooltip="Boston Cybernetics" />
                <ReUsedText text={Math.abs(viewers.zaibatsu).toFixed()} color={getFaction(FactionIDs.ZHI).primary_color} tooltip="Zaibatsu Heavy Industries" />
                {/* <ReUsedText text={Math.abs(viewers.other).toFixed()} color={"grey !important"} tooltip="Not enlisted" /> */}
            </Stack>
        </Stack>
    )
}

const ReUsedText = ({ text, color, tooltip }: { text: string; color?: string; tooltip: string }) => {
    return (
        <TooltipHelper text={tooltip} isCentered>
            <Typography variant="body2" sx={{ color: color || colors.text, lineHeight: 1 }}>
                {text}
            </Typography>
        </TooltipHelper>
    )
}
