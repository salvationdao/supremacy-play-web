import { Stack, Box, Typography } from "@mui/material"
import { useMemo } from "react"
import { TooltipHelper } from "../../.."
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechLoadoutIcons = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.chassis_skin?.tier || mechDetails?.tier || ""), [mechDetails])

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
        <Stack direction="row" spacing=".5rem" alignItems="center">
            {hasSkin && (
                <Stack spacing=".4rem" direction="row" alignItems="center">
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBold,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                    <SvgSkin fill={rarityDeets.color} size="1.7rem" />
                </Stack>
            )}

            {!hasSkin && (
                <TooltipHelper color={colors.chassisSkin} text="Submodel" placement="bottom">
                    <Box>
                        <SvgSkin fill={hasSkin ? colors.chassisSkin : `${colors.darkGrey}80`} size="1.7rem" />
                    </Box>
                </TooltipHelper>
            )}

            <TooltipHelper color={colors.powerCore} text="Power core" placement="bottom">
                <Box>
                    <SvgPowerCore fill={hasPowerCore ? colors.powerCore : `${colors.darkGrey}80`} size="1.7rem" />
                </Box>
            </TooltipHelper>

            {weaponCount > 0 &&
                new Array(weaponCount).fill(0).map((_, index) => (
                    <TooltipHelper color={colors.weapons} key={`mech-info-${index}`} text="Weapon" placement="bottom">
                        <Box>
                            <SvgWeapons fill={colors.weapons} size="1.7rem" />
                        </Box>
                    </TooltipHelper>
                ))}

            {weaponSlots - weaponCount > 0 &&
                new Array(weaponSlots - weaponCount).fill(0).map((_, index) => (
                    <TooltipHelper color={colors.weapons} key={`mech-info-${index}`} text="Weapon" placement="bottom">
                        <Box>
                            <SvgWeapons fill={`${colors.darkGrey}80`} size="1.7rem" />
                        </Box>
                    </TooltipHelper>
                ))}

            {utilityCount > 0 &&
                new Array(utilityCount).fill(0).map((_, index) => (
                    <TooltipHelper color={colors.utilities} key={`mech-info-${index}`} text="Utility" placement="bottom">
                        <Box>
                            <SvgUtilities fill={colors.utilities} size="1.7rem" />
                        </Box>
                    </TooltipHelper>
                ))}

            {utilitySlots - utilityCount > 0 &&
                new Array(utilitySlots - utilityCount).fill(0).map((_, index) => (
                    <TooltipHelper color={colors.utilities} key={`mech-info-${index}`} text="Utility" placement="bottom">
                        <Box>
                            <SvgUtilities fill={`${colors.darkGrey}80`} size="1.7rem" />
                        </Box>
                    </TooltipHelper>
                ))}

            <TooltipHelper color={colors.introAnimation} text="Outro animation" placement="bottom">
                <Box>
                    <SvgIntroAnimation fill={hasIntroAnimation ? colors.introAnimation : `${colors.darkGrey}80`} size="1.7rem" />
                </Box>
            </TooltipHelper>

            <TooltipHelper color={colors.outroAnimation} text="Intro animation" placement="bottom">
                <Box>
                    <SvgOutroAnimation fill={hasOutroAnimation ? colors.outroAnimation : `${colors.darkGrey}80`} size="1.7rem" />
                </Box>
            </TooltipHelper>
        </Stack>
    )
}
