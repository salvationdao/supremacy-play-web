import { Stack, Typography } from "@mui/material"
import { SvgUser } from "../../../assets"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"

export const LiveCounts = () => {
    const viewerCount = useGameServerSubscription<number>({
        URI: "/public/live_viewer_count",
        key: GameServerKeys.SubViewersLiveCount,
    })

    return (
        <Stack justifyContent="center">
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                <SvgUser size="1.2rem" inline fill={colors.text} />
                LIVE VIEWERS: {viewerCount || 0}
            </Typography>
        </Stack>
    )
}
