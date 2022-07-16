import { Stack, Typography } from "@mui/material"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgStats, SvgUtilities, SvgWeapons } from "../../../../../assets"
import { useTheme } from "../../../../../containers/theme"
import { getRarityDeets } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { MechDetails } from "../../../../../types"
import { MechBarStats } from "../MechBarStats"
import { MechLoadoutItem } from "../MechLoadoutItem"

export const MechStatsDetails = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const theme = useTheme()

    if (!mechDetails) return null

    const primaryColor = theme.factionTheme.primary
    const { weapon_hardpoints, utility_slots, chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mechDetails

    const chassisSkin = mechDetails?.chassis_skin
    const introAnimation = mechDetails?.intro_animation
    const outroAnimation = mechDetails?.outro_animation
    const powerCore = mechDetails?.power_core
    const weapons = mechDetails?.weapons
    const utilities = mechDetails?.utility

    return (
        <Stack spacing="3rem">
            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgStats fill={primaryColor} size="1.8rem" />
                    <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                        WAR MACHINE STATS
                    </Typography>
                </Stack>
                <MechBarStats
                    mech={mechDetails}
                    mechDetails={mechDetails}
                    color={primaryColor}
                    fontSize="1.3rem"
                    width="100%"
                    spacing="1.2rem"
                    barHeight=".8rem"
                />
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgPowerCore fill={colors.powerCore} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.powerCore, fontFamily: fonts.nostromoBlack }}>
                        POWER CORE ({power_core_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {powerCore ? (
                    <MechLoadoutItem
                        imageUrl={powerCore.image_url || powerCore.avatar_url}
                        videoUrls={[powerCore.card_animation_url]}
                        label={powerCore.label}
                        primaryColor={colors.powerCore}
                        Icon={SvgPowerCore}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgWeapons fill={colors.weapons} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.weapons, fontFamily: fonts.nostromoBlack }}>
                        WEAPONS ({weapons?.length || 0}/{weapon_hardpoints})
                    </Typography>
                </Stack>

                {weapons.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap">
                        {weapons.map((w) => {
                            return (
                                <MechLoadoutItem
                                    key={w.id}
                                    imageUrl={w.image_url || w.avatar_url}
                                    videoUrls={[w.card_animation_url]}
                                    label={w.label}
                                    primaryColor={colors.weapons}
                                    Icon={SvgWeapons}
                                />
                            )
                        })}
                    </Stack>
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgUtilities fill={colors.utilities} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.utilities, fontFamily: fonts.nostromoBlack }}>
                        UTILITIES ({utilities?.length || 0}/{utility_slots})
                    </Typography>
                </Stack>

                {utilities && utilities.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap">
                        {utilities.map((w) => {
                            return (
                                <MechLoadoutItem
                                    key={w.id}
                                    imageUrl={w.image_url || w.avatar_url}
                                    videoUrls={[w.card_animation_url]}
                                    label={w.label}
                                    primaryColor={colors.utilities}
                                    Icon={SvgUtilities}
                                />
                            )
                        })}
                    </Stack>
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgSkin fill={colors.chassisSkin} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.chassisSkin, fontFamily: fonts.nostromoBlack }}>
                        SUBMODEL ({chassis_skin_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {chassisSkin ? (
                    <MechLoadoutItem
                        imageUrl={chassisSkin.image_url || chassisSkin.avatar_url}
                        videoUrls={[chassisSkin.card_animation_url]}
                        label={chassisSkin.label}
                        primaryColor={colors.chassisSkin}
                        Icon={SvgSkin}
                        rarity={getRarityDeets(chassisSkin.tier)}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgIntroAnimation fill={colors.introAnimation} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.introAnimation, fontFamily: fonts.nostromoBlack }}>
                        INTRO ANIMATION ({intro_animation_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {introAnimation ? (
                    <MechLoadoutItem
                        imageUrl={introAnimation.image_url || introAnimation.avatar_url}
                        videoUrls={[introAnimation.card_animation_url]}
                        label={introAnimation.label}
                        primaryColor={colors.introAnimation}
                        Icon={SvgIntroAnimation}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgOutroAnimation fill={colors.outroAnimation} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.outroAnimation, fontFamily: fonts.nostromoBlack }}>
                        OUTRO ANIMATION ({outro_animation_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {outroAnimation ? (
                    <MechLoadoutItem
                        imageUrl={outroAnimation.image_url || outroAnimation.avatar_url}
                        videoUrls={[outroAnimation.card_animation_url]}
                        label={outroAnimation.label}
                        primaryColor={colors.outroAnimation}
                        Icon={SvgOutroAnimation}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>
        </Stack>
    )
}
