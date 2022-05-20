import { Box, Typography } from "@mui/material"
import { useRef } from "react"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MechBasic } from "../../../../types"

export const MechGeneralStatus = ({ mech }: { mech: MechBasic }) => {
    const theme = useTheme()
    const { tier } = mech
    const rarityDeets = useRef(getRarityDeets(tier || ""))
    const primaryColor = theme.factionTheme.primary

    return (
        <Box sx={{ px: "1.6rem", py: ".6rem", backgroundColor: `${primaryColor}10`, border: `${primaryColor} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color: primaryColor, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                IN QUEUE
            </Typography>
        </Box>
    )
}
