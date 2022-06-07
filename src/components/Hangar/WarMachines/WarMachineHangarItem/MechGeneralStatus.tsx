import { Box, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic } from "../../../../types"

export const MechGeneralStatus = ({ mechQueuePosition }: { mechQueuePosition: number }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    return (
        <Box sx={{ px: "1.6rem", py: ".6rem", backgroundColor: `${primaryColor}10`, border: `${primaryColor} 1.5px dashed` }}>
            {mechQueuePosition === -1 && <Typography variant="body2" sx={{ color: primaryColor, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                IN HANGAR
            </Typography>}
            {mechQueuePosition === 0 && <Typography variant="body2" sx={{ color: 'green', textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                IN BATTLE
            </Typography>}
            {mechQueuePosition > 0 && <Typography variant="body2" sx={{ color: 'orange', textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                POSITION {mechQueuePosition}
            </Typography>}
        </Box>
    )
}
