import { Stack, Typography } from "@mui/material"
import { SvgLoadoutSkin, SvgStats, SvgWeapons } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets, getWeaponTypeColor } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { MechLoadoutItem } from "../../../Hangar/WarMachinesHangar/Common/MechLoadoutItem"
import { WeaponBarStats } from "../../../Hangar/WeaponsHangar/Common/WeaponBarStats"

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
                    <SvgWeapons fill={primaryColor} size="1.8rem" />
                    <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                        WEAPON TYPE
                    </Typography>
                </Stack>

                <Typography variant="h6" sx={{ color: getWeaponTypeColor(weaponDetails?.weapon_type), fontFamily: fonts.nostromoBold }}>
                    {weaponDetails?.weapon_type}
                </Typography>
            </Stack>

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
                    <SvgLoadoutSkin fill={colors.chassisSkin} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.chassisSkin, fontFamily: fonts.nostromoBlack }}>
                        SUBMODEL ({skin ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {skin ? (
                    <MechLoadoutItem imageUrl={skin.image_url || skin.avatar_url} label={skin.label} Icon={SvgLoadoutSkin} rarity={getRarityDeets(skin.tier)} />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>
        </Stack>
    )
}
