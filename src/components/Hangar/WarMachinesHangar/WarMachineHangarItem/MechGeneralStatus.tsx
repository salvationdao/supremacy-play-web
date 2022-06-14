import { Box, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts, colors } from "../../../../theme/theme"
import { MechStatus } from "../../../../types"

export const MechGeneralStatus = ({ mechStatus }: { mechStatus?: MechStatus }) => {
    const theme = useTheme()

    let text = "LOADING..."
    let color = theme.factionTheme.primary

    if (mechStatus?.status === "IDLE") {
        text = "IDLE"
        color = colors.green
    } else if (mechStatus?.status === "QUEUE") {
        const queuePosition = mechStatus?.queue_position
        text = `IN QUEUE${queuePosition ? `: ${queuePosition}` : ""}`
        color = colors.yellow
    } else if (mechStatus?.status === "BATTLE") {
        text = "IN BATTLE"
        color = colors.red
    } else if (mechStatus?.status === "MARKET") {
        text = "IN MARKETPLACE"
        color = colors.orange
    } else if (mechStatus?.status === "SOLD") {
        text = "SOLD"
        color = colors.lightGrey
    }

    return (
        <Box sx={{ px: "1.6rem", pt: ".9rem", pb: ".6rem", backgroundColor: `${color}10`, border: `${color} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                {text}
            </Typography>
        </Box>
    )
}
