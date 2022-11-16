import { Box, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { PlayerQueueStatus } from "../../../types/battle_queue"

export const MechQueueLimit = ({ playerQueueStatus }: { playerQueueStatus: PlayerQueueStatus }) => {
    return (
        <Stack direction="row" alignItems="center">
            <Box sx={{ height: "3rem", p: ".2rem 1rem", border: "#FFFFFF50 1px solid" }}>
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, whiteSpace: "nowrap" }}>
                    <strong>QUEUE LIMIT:</strong>{" "}
                    <span style={{ color: playerQueueStatus.total_queued >= playerQueueStatus.queue_limit ? colors.red : "#FFFFFF" }}>
                        {playerQueueStatus.total_queued}
                    </span>
                    /{playerQueueStatus.queue_limit}
                </Typography>
            </Box>
        </Stack>
    )
}
