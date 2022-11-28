import { Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { PlayerQueueStatus } from "../../../types/battle_queue"

export const MechQueueLimit = ({ playerQueueStatus }: { playerQueueStatus: PlayerQueueStatus }) => {
    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "4.3rem", backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, whiteSpace: "nowrap" }}>
                <strong>QUEUE LIMIT:</strong>{" "}
                <span style={{ color: playerQueueStatus.total_queued >= playerQueueStatus.queue_limit ? colors.red : "#FFFFFF" }}>
                    {playerQueueStatus.total_queued}
                </span>
                /{playerQueueStatus.queue_limit}
            </Typography>
        </Stack>
    )
}
