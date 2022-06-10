import { Box, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechStatsDetails = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    if (!mechDetails) return null

    const { chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mechDetails

    const chassisSkin = mechDetails?.chassis_skin
    const introAnimation = mechDetails?.intro_animation
    const outroAnimation = mechDetails?.outro_animation
    const powerCore = mechDetails?.power_core
    const weapons = mechDetails?.weapons
    const utilities = mechDetails?.utility

    if (mechDetails)
        console.log({
            primaryColor,
            chassis_skin_id,
            intro_animation_id,
            outro_animation_id,
            power_core_id,
            chassisSkin,
            introAnimation,
            outroAnimation,
            powerCore,
            weapons,
            utilities,
        })

    return (
        <Box>
            <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                DESCRIPTION
            </Typography>
            <Typography variant="h5">aaaaaaaaaa</Typography>
        </Box>
    )
}
