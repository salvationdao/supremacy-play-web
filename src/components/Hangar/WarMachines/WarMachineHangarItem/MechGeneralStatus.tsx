import { Box, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts, colors } from "../../../../theme/theme"

export const MechGeneralStatus = ({ mechQueuePosition }: { mechQueuePosition: number }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    let text = "LOADING..."
    let color = colors.neonBlue

    if (mechQueuePosition === -1) {
        text = "IN HANGAR"
        color = primaryColor
    }

    if (mechQueuePosition === 0) {
        text = "IN BATTLE"
        color = colors.green
    }

    if (mechQueuePosition > 0) {
        text = `POSITION ${mechQueuePosition}`
        color = colors.orange
    }

    return (
        <Box sx={{ px: "1.6rem", pt: ".9rem", pb: ".6rem", backgroundColor: `${primaryColor}10`, border: `${primaryColor} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                {text}
            </Typography>
        </Box>
    )
}
