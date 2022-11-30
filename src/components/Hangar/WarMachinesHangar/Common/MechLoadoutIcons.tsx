import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { NiceTooltip } from "../../.."
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgLoadoutSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"
import { truncateTextLines } from "../../../../helpers"

export const MechLoadoutIcons = ({ mech, mechDetails }: { mech?: MechBasic; mechDetails?: MechDetails }) => {
    const rarityDeets = useMemo(() => getRarityDeets(mech?.tier || mechDetails?.chassis_skin?.tier || mechDetails?.tier || ""), [mech, mechDetails])

    let hasSkin = !!mech?.chassis_skin_id
    let hasIntroAnimation = !!mech?.intro_animation_id
    let hasOutroAnimation = !!mech?.outro_animation_id
    let hasPowerCore = !!mech?.power_core_id
    let weaponCount = mech?.equipped_weapon_count || 0
    let utilityCount = mech?.equipped_utility_count || 0

    let weaponSlots = mech?.weapon_hardpoints || 0
    let utilitySlots = mech?.utility_slots || 0

    if (mechDetails) {
        const { chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mechDetails
        const weapons = mechDetails.weapons?.length || 0
        const utilities = mechDetails.utility?.length || 0

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
        <Stack direction="row" spacing=".5rem" alignItems="center">
            {hasSkin && (
                <Stack spacing=".4rem" direction="row" alignItems="center">
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBold,
                            ...truncateTextLines(1),
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                    <SvgLoadoutSkin fill={rarityDeets.color} size="1.7rem" />
                </Stack>
            )}

            {!hasSkin && (
                <NiceTooltip color={colors.chassisSkin} text="Submodel" placement="bottom">
                    <Box>
                        <SvgLoadoutSkin fill={hasSkin ? colors.chassisSkin : `${colors.darkGrey}80`} size="1.7rem" />
                    </Box>
                </NiceTooltip>
            )}

            <NiceTooltip color={colors.powerCore} text="Power core" placement="bottom">
                <Box>
                    <SvgPowerCore fill={hasPowerCore ? colors.powerCore : `${colors.darkGrey}80`} size="1.7rem" />
                </Box>
            </NiceTooltip>

            {weaponCount > 0 &&
                new Array(weaponCount).fill(0).map((_, index) => (
                    <NiceTooltip color={colors.weapons} key={`mech-info-${index}`} text="Weapon" placement="bottom">
                        <Box>
                            <SvgWeapons fill={colors.weapons} size="1.7rem" />
                        </Box>
                    </NiceTooltip>
                ))}

            {weaponSlots - weaponCount > 0 &&
                new Array(weaponSlots - weaponCount).fill(0).map((_, index) => (
                    <NiceTooltip color={colors.weapons} key={`mech-info-${index}`} text="Weapon" placement="bottom">
                        <Box>
                            <SvgWeapons fill={`${colors.darkGrey}80`} size="1.7rem" />
                        </Box>
                    </NiceTooltip>
                ))}

            {utilityCount > 0 &&
                new Array(utilityCount).fill(0).map((_, index) => (
                    <NiceTooltip color={colors.utilities} key={`mech-info-${index}`} text="Utility" placement="bottom">
                        <Box>
                            <SvgUtilities fill={colors.utilities} size="1.7rem" />
                        </Box>
                    </NiceTooltip>
                ))}

            {utilitySlots - utilityCount > 0 &&
                new Array(utilitySlots - utilityCount).fill(0).map((_, index) => (
                    <NiceTooltip color={colors.utilities} key={`mech-info-${index}`} text="Utility" placement="bottom">
                        <Box>
                            <SvgUtilities fill={`${colors.darkGrey}80`} size="1.7rem" />
                        </Box>
                    </NiceTooltip>
                ))}

            <NiceTooltip color={colors.introAnimation} text="Outro animation" placement="bottom">
                <Box>
                    <SvgIntroAnimation fill={hasIntroAnimation ? colors.introAnimation : `${colors.darkGrey}80`} size="1.7rem" />
                </Box>
            </NiceTooltip>

            <NiceTooltip color={colors.outroAnimation} text="Intro animation" placement="bottom">
                <Box>
                    <SvgOutroAnimation fill={hasOutroAnimation ? colors.outroAnimation : `${colors.darkGrey}80`} size="1.7rem" />
                </Box>
            </NiceTooltip>
        </Stack>
    )
}
