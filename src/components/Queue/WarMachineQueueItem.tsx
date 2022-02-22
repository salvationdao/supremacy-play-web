import { Box, Stack, Typography } from "@mui/material"
import { colors } from "../../theme/theme"
import { QueuedWarMachine } from "../../types"

export const WarMachineQueueItem = ({ index, queueItem }: { index: number; queueItem: QueuedWarMachine }) => {
    return (
        <Stack
            direction="row"
            spacing={1.3}
            sx={{
                position: "relative",
                px: 2,
                py: 1.4,
                backgroundColor: index % 2 === 0 ? colors.navy : undefined,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: 45,
                    height: 45,
                    flexShrink: 0,
                    overflow: "hidden",
                    backgroundImage: `url(${queueItem.warMachineMetadata.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    cursor: "pointer",
                }}
            >
                <Box sx={{ position: "absolute" }}>{queueItem.position + 1}</Box>
            </Box>

            <Stack spacing={0.5}>
                <Typography
                    variant="body1"
                    sx={{ color: "#FFFFFF", fontWeight: "fontWeightBold", wordBreak: "break-word" }}
                >
                    {queueItem.warMachineMetadata.model || queueItem.warMachineMetadata.name}
                </Typography>
                <Typography variant="body2">Queue Position: {queueItem.position + 1}</Typography>
            </Stack>
        </Stack>
    )
}
