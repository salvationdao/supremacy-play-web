import { useTheme } from "../../../../containers/theme"
import { Stack, Typography } from "@mui/material"
import { SvgStats } from "../../../../assets"
import { fonts } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { WeaponBarStats } from "../../../Hangar/WeaponsHangar/Common/WeaponBarStats"

interface Props {
    weaponDetails?: Weapon
}

export const WeaponStatsDetails = ({ weaponDetails }: Props) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary

    if (!weaponDetails) return null

    return (
        <Stack spacing="3rem">
            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgStats fill={primaryColor} size="1.8rem" />
                    <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                        WEAPON STATS
                    </Typography>
                </Stack>
                <WeaponBarStats
                    weapon={weaponDetails}
                    weaponDetails={weaponDetails}
                    color={primaryColor}
                    fontSize="1.3rem"
                    width="100%"
                    spacing="1.2rem"
                    barHeight=".8rem"
                />
            </Stack>
        </Stack>
    )
}
