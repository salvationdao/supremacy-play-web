import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { SvgWeapons } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { MechWeaponSlot } from "../../../types/battle_queue"
import { NiceTooltip, TooltipPlacement } from "../../Common/Nice/NiceTooltip"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"

interface WeaponSlotProps {
    weaponSlot: MechWeaponSlot
    tooltipPlacement: TooltipPlacement
    size?: string
}
export const WeaponSlot = ({ weaponSlot, tooltipPlacement, size }: WeaponSlotProps) => {
    const { factionTheme } = useTheme()
    const weapon = weaponSlot.weapon

    const weaponStat = useCallback((label: string, value: string | number) => {
        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" fontFamily={fonts.nostromoMedium}>
                    {label}:
                </Typography>
                <Typography variant="body2" fontFamily={fonts.nostromoLight} sx={{ minWidth: "6rem" }}>
                    {value}
                </Typography>
            </Stack>
        )
    }, [])

    return useMemo(() => {
        if (!weapon)
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: size || "4rem",
                        width: size || "4rem",
                        border: `${colors.grey}80 2px solid`,
                        borderRadius: 0,
                        backgroundColor: `${factionTheme.background}`,
                        "&:hover": {
                            border: `${factionTheme.primary} 2px solid`,
                        },
                        opacity: "0.5",
                    }}
                >
                    <SvgWeapons />
                </Box>
            )

        const weaponRarity = getRarityDeets(weapon?.tier || "")
        return (
            <NiceTooltip
                tooltipSx={{
                    maxWidth: "50rem",
                }}
                color={factionTheme.background}
                renderNode={
                    <Stack direction="column" sx={{ width: "30rem", p: "1rem" }}>
                        <Stack direction="row" alignItems="center">
                            <Box
                                key={!weapon.avatar_url ? weapon.image_url : weapon.avatar_url}
                                component="img"
                                src={!weapon.avatar_url ? weapon.image_url : weapon.avatar_url}
                                sx={{
                                    width: "6rem",
                                    height: "6rem",
                                    objectFit: "cover",
                                    borderRadius: 0,
                                    animation: `${scaleUpKeyframes} .5s ease-out`,
                                }}
                            />
                            <Stack direction="column" sx={{ ml: "1rem" }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: fonts.nostromoHeavy,
                                        color: weaponRarity.color,
                                    }}
                                >
                                    {weaponRarity.label}
                                </Typography>
                                <Typography fontFamily={fonts.nostromoBlack}>{weapon.label}</Typography>
                            </Stack>
                        </Stack>
                        {weaponStat("DAMAGE", weapon.damage)}
                        {weaponStat("DAMAGE FALLOFF", weapon.damage_falloff)}
                        {weaponStat("RADIUS", weapon.radius)}
                        {weaponStat("RADIAL DAMAGE FALLOFF", weapon.radius_damage_falloff)}
                        {weaponStat("SPREAD", weapon.spread)}
                        {weaponStat("RATE OF FIRE", weapon.rate_of_fire)}
                        {weaponStat("ENERGY COST", weapon.power_cost)}
                    </Stack>
                }
                placement={tooltipPlacement}
            >
                <NiceBoxThing
                    border={{ color: `${weaponRarity.color}80`, thickness: "very-lean" }}
                    caret={{ position: "bottom-right", size: "small" }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: size || "4rem",
                        width: size || "4rem",
                        backgroundColor: `${factionTheme.background}`,
                        "&:hover": {
                            border: `${factionTheme.primary} 2px solid`,
                        },
                    }}
                >
                    <Box
                        key={!weapon.avatar_url ? weapon.image_url : weapon.avatar_url}
                        component="img"
                        src={!weapon.avatar_url ? weapon.image_url : weapon.avatar_url}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            animation: `${scaleUpKeyframes} .5s ease-out`,
                        }}
                    />
                </NiceBoxThing>
            </NiceTooltip>
        )
    }, [factionTheme.background, factionTheme.primary, size, tooltipPlacement, weapon, weaponStat])
}
