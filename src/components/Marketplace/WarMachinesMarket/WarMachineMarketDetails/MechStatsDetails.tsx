import { Box } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
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

    return <Box>TODO</Box>
}
