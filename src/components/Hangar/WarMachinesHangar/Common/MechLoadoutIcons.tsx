import { Stack } from "@mui/material"
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
    }

    return (
        <Stack direction="row" spacing=".5rem">
            {hasSkin && <SvgSkin fill={colors.chassisSkin} size="1.3rem" />}

            {hasIntroAnimation && <SvgIntroAnimation fill={colors.introAnimation} size="1.3rem" />}

            {hasOutroAnimation && <SvgOutroAnimation fill={colors.outroAnimation} size="1.3rem" />}

            {hasPowerCore && <SvgPowerCore fill={colors.powerCore} size="1.3rem" />}

            {new Array(weaponCount).fill(0).map((_, index) => (
                <SvgWeapons key={`mech-info-${index}`} fill={colors.weapons} size="1.3rem" />
            ))}

            {new Array(utilityCount).fill(0).map((_, index) => (
                <SvgUtilities key={`mech-info-${index}`} fill={colors.utilities} size="1.3rem" />
            ))}
        </Stack>
    )
}
