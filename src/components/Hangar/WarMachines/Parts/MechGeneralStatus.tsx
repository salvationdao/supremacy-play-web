import { Box, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic } from "../../../../types"

export const MechGeneralStatus = ({ mech }: { mech: MechBasic }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    console.log({ mech })

    return (
        <Box sx={{ px: "1.6rem", py: ".6rem", backgroundColor: `${primaryColor}10`, border: `${primaryColor} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color: primaryColor, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                IN QUEUE
            </Typography>
        </Box>
    )
}
