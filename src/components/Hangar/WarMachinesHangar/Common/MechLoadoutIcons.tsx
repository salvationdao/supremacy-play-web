import { Stack, Box } from "@mui/material"
import { TooltipHelper } from "../../.."
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechLoadoutIcons = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    let hasSkin = false
    let hasIntroAnimation = false
    let hasOutroAnimation = false
    let hasPowerCore = false
    let weaponCount = 0
    let utilityCount = 0

    let weaponSlots = 0
    let utilitySlots = 0

    if (mechDetails) {
        const { chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mechDetails
        const weapons = mechDetails.weapons?.length
        const utilities = mechDetails.utility?.length

        if (chassis_skin_id) hasSkin = true
        if (intro_animation_id) hasIntroAnimation = true
        if (outro_animation_id) hasOutroAnimation = true
        if (power_core_id) hasPowerCore = true
        weaponCount += weapons
        utilityCount += utilities

        weaponSlots = mechDetails.weapon_hardpoints
        utilitySlots = mechDetails.utility_slots
    }

    return (
        <Stack direction="row" spacing=".5rem">
            <TooltipHelper text="Weapon skin" placement="bottom">
                <Box>
                    <SvgSkin fill={hasSkin ? colors.chassisSkin : `${colors.darkGrey}80`} size="1.5rem" />
                </Box>
            </TooltipHelper>

            <TooltipHelper text="Outro animation" placement="bottom">
                <Box>
                    <SvgIntroAnimation fill={hasIntroAnimation ? colors.introAnimation : `${colors.darkGrey}80`} size="1.5rem" />
                </Box>
            </TooltipHelper>

            <TooltipHelper text="Intro animation" placement="bottom">
                <Box>
                    <SvgOutroAnimation fill={hasOutroAnimation ? colors.outroAnimation : `${colors.darkGrey}80`} size="1.5rem" />
                </Box>
            </TooltipHelper>

            <TooltipHelper text="Power core" placement="bottom">
                <Box>
                    <SvgPowerCore fill={hasPowerCore ? colors.powerCore : `${colors.darkGrey}80`} size="1.5rem" />
                </Box>
            </TooltipHelper>

            {weaponCount > 0 &&
                new Array(weaponCount).fill(0).map((_, index) => (
                    <TooltipHelper key={`mech-info-${index}`} text="Weapon" placement="bottom">
                        <Box>
                            <SvgWeapons fill={colors.weapons} size="1.5rem" />
                        </Box>
                    </TooltipHelper>
                ))}

            {new Array(weaponSlots - weaponCount).fill(0).map((_, index) => (
                <TooltipHelper key={`mech-info-${index}`} text="Weapon" placement="bottom">
                    <Box>
                        <SvgWeapons fill={`${colors.darkGrey}80`} size="1.5rem" />
                    </Box>
                </TooltipHelper>
            ))}

            {utilityCount > 0 &&
                new Array(utilityCount).fill(0).map((_, index) => (
                    <TooltipHelper key={`mech-info-${index}`} text="Utility" placement="bottom">
                        <Box>
                            <SvgUtilities fill={colors.utilities} size="1.5rem" />
                        </Box>
                    </TooltipHelper>
                ))}

            {new Array(utilitySlots - utilityCount).fill(0).map((_, index) => (
                <TooltipHelper key={`mech-info-${index}`} text="Utility" placement="bottom">
                    <Box>
                        <SvgUtilities fill={`${colors.darkGrey}80`} size="1.5rem" />
                    </Box>
                </TooltipHelper>
            ))}
        </Stack>
    )
}
