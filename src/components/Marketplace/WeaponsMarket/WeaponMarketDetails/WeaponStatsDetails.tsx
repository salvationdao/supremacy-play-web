import { useTheme } from "../../../../containers/theme"
import { Stack, Typography } from "@mui/material"
import { SvgSkin, SvgStats } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { WeaponBarStats } from "../../../Hangar/WeaponsHangar/Common/WeaponBarStats"
import { MechLoadoutItem } from "../../../Hangar/WarMachinesHangar/Common/MechLoadoutItem"
import { getRarityDeets } from "../../../../helpers"

interface Props {
    weaponDetails?: Weapon
}

export const WeaponStatsDetails = ({ weaponDetails }: Props) => {
    const theme = useTheme()

    if (!weaponDetails) return null

    const primaryColor = theme.factionTheme.primary
    const skin = weaponDetails?.weapon_skin

    return (
        <Stack spacing="3rem">
            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgStats fill={primaryColor} size="1.8rem" />
                    <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                        WEAPON STATS
                    </Typography>
                </Stack>

                <WeaponBarStats weapon={weaponDetails} color={primaryColor} fontSize="1.3rem" width="100%" spacing="1.2rem" barHeight=".8rem" />
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgSkin fill={colors.chassisSkin} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.chassisSkin, fontFamily: fonts.nostromoBlack }}>
                        SUBMODEL ({skin ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {skin ? (
                    <MechLoadoutItem
                        imageUrl={skin.image_url}
                        videoUrls={[skin.card_animation_url]}
                        label={skin.label}
                        primaryColor={colors.chassisSkin}
                        Icon={SvgSkin}
                        rarity={getRarityDeets(skin.tier)}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>
        </Stack>
    )
}
