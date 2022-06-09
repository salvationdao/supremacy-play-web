import { MechDetails } from "../../../../types"
import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../../theme/theme"
import { getRarityDeets } from "../../../../helpers"
import { useMemo } from "react"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"

export const MechInfo = ({
    isGridView,
    name,
    label,
    tier,
    mechDetails,
}: {
    isGridView: boolean
    name: string
    label: string
    tier: string
    mechDetails?: MechDetails
}) => {
    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

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
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: rarityDeets.color,
                }}
            >
                {rarityDeets.label}
            </Typography>

            <Typography
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {name || label}
            </Typography>

            <Stack direction="row" spacing=".5rem" sx={{ pt: isGridView ? ".4rem" : "" }}>
                {hasSkin && <SvgSkin size="1.3rem" />}

                {hasIntroAnimation && <SvgIntroAnimation size="1.3rem" />}

                {hasOutroAnimation && <SvgOutroAnimation size="1.3rem" />}

                {hasPowerCore && <SvgPowerCore size="1.3rem" />}

                {new Array(weaponCount).fill(0).map((_, index) => (
                    <SvgWeapons key={`mech-info-${index}`} size="1.3rem" />
                ))}

                {new Array(utilityCount).fill(0).map((_, index) => (
                    <SvgUtilities key={`mech-info-${index}`} size="1.3rem" />
                ))}
            </Stack>
        </Stack>
    )
}
