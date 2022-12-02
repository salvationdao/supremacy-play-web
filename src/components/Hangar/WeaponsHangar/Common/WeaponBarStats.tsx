import { Box, Stack, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import {
    SvgAmmo,
    SvgDamage1,
    SvgDamageFalloff,
    SvgDamageFalloffRate,
    SvgEnergy,
    SvgProjectileSpeed,
    SvgRadius,
    SvgRadiusDamageFalloffRate,
    SvgRateOfFire,
    SvgSpread,
} from "../../../../assets"
import { GetWeaponMaxStats } from "../../../../fetching"
import { Weapon, WeaponMaxStats } from "../../../../types"
import { BarStat, IconStat } from "../../WarMachinesHangar/Common/MechBarStats"

interface WeaponBarStatsProps {
    weapon: Weapon
    compareTo?: Weapon
    color?: string
    fontSize?: string
    width?: string
    spacing?: string
    barHeight?: string
    iconVersion?: boolean
}

export const WeaponBarStats = ({ weapon, compareTo, color, fontSize: fs, width, spacing, barHeight, iconVersion }: WeaponBarStatsProps) => {
    const theme = useTheme()

    const primaryColor = color || theme.factionTheme.primary
    const fontSize = fs || "1.1rem"

    const [weaponMaxStats, setWeaponMaxStats] = useState<WeaponMaxStats>()
    const { query: queryGetWeaponMaxStats } = useParameterizedQuery(GetWeaponMaxStats)

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryGetWeaponMaxStats(undefined)
                if (resp.error || !resp.payload) return
                setWeaponMaxStats(resp.payload)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get the list of streams."
                console.error(message)
            }
        })()
    }, [queryGetWeaponMaxStats])

    const ammo = weapon.max_ammo || 0
    const damage = weapon.damage
    const damageFalloff = weapon.damage_falloff || 0
    const damageFalloffRate = weapon.damage_falloff_rate || 0
    const radius = weapon.radius || 0
    const radiusDamageFalloff = weapon.radius_damage_falloff || 0
    const rateOfFire = weapon.rate_of_fire || 0
    const energyCost = weapon.energy_cost || 0
    const projectileSpeed = weapon.projectile_speed || 0
    const spread = weapon.spread || 0

    const compareToObj = compareTo
        ? {
              ammo: compareTo.max_ammo || 0,
              damage: compareTo.damage,
              damageFalloff: compareTo.damage_falloff || 0,
              damageFalloffRate: compareTo.damage_falloff_rate || 0,
              radius: compareTo.radius || 0,
              radiusDamageFalloff: compareTo.radius_damage_falloff || 0,
              rateOfFire: compareTo.rate_of_fire || 0,
              energyCost: compareTo.energy_cost || 0,
              projectileSpeed: compareTo.projectile_speed || 0,
              spread: compareTo.spread || 0,
          }
        : undefined

    if (iconVersion) {
        return (
            <Stack alignItems="center" justifyContent="flex-start" direction="row" flexWrap="wrap">
                <IconStat primaryColor={primaryColor} fontSize={fontSize} label="AMMO" current={ammo} total={weaponMaxStats?.max_ammo || 3000} Icon={SvgAmmo} />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="DAMAGE"
                    current={damage}
                    total={weaponMaxStats?.damage || 1000}
                    Icon={SvgDamage1}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="DAMAGE FALLOFF"
                    current={damageFalloff}
                    total={weaponMaxStats?.damage_falloff || 1000}
                    Icon={SvgDamageFalloff}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="DAMAGE FALLOFF RATE"
                    current={damageFalloffRate}
                    total={weaponMaxStats?.damage_falloff_rate || 1000}
                    Icon={SvgDamageFalloffRate}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="RADIUS"
                    current={radius}
                    total={weaponMaxStats?.radius || 2000}
                    Icon={SvgRadius}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="RADIUS DAMAGE FALLOFF"
                    current={radiusDamageFalloff}
                    total={weaponMaxStats?.radius_damage_falloff || 2000}
                    Icon={SvgRadiusDamageFalloffRate}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="RATE OF FIRE"
                    current={rateOfFire}
                    total={weaponMaxStats?.rate_of_fire || 1000}
                    Icon={SvgRateOfFire}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="ENERGY COST"
                    current={energyCost}
                    total={weaponMaxStats?.energy_cost || 100}
                    Icon={SvgEnergy}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="PROJECTILE SPEED"
                    current={projectileSpeed}
                    total={weaponMaxStats?.projectile_speed || 200000}
                    Icon={SvgProjectileSpeed}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="SPREAD"
                    current={spread}
                    total={weaponMaxStats?.spread || 100}
                    Icon={SvgSpread}
                />
            </Stack>
        )
    }

    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                pr: ".8rem",
                py: ".16rem",
                direction: "ltr",
            }}
        >
            <Stack
                spacing={spacing || ".7rem"}
                sx={{
                    height: "100%",
                    width: width || "26rem",
                    flexShrink: 0,
                }}
            >
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="AMMO"
                    current={ammo}
                    compareTo={compareToObj?.ammo}
                    total={3000}
                    Icon={SvgAmmo}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="DAMAGE"
                    current={damage}
                    compareTo={compareToObj?.damage}
                    total={1000}
                    Icon={SvgDamage1}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="DAMAGE FALLOFF"
                    current={damageFalloff}
                    compareTo={compareToObj?.damageFalloff}
                    total={1000}
                    Icon={SvgDamageFalloff}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="DAMAGE FALLOFF RATE"
                    current={damageFalloffRate}
                    compareTo={compareToObj?.damageFalloffRate}
                    total={1000}
                    Icon={SvgDamageFalloffRate}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="RADIUS"
                    current={radius}
                    compareTo={compareToObj?.radius}
                    total={2000}
                    Icon={SvgRadius}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="RADIUS DAMAGE FALLOFF"
                    current={radiusDamageFalloff}
                    compareTo={compareToObj?.radiusDamageFalloff}
                    total={2000}
                    Icon={SvgRadiusDamageFalloffRate}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="RATE OF FIRE"
                    current={rateOfFire}
                    compareTo={compareToObj?.rateOfFire}
                    total={1000}
                    Icon={SvgRateOfFire}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="ENERGY COST"
                    current={energyCost}
                    compareTo={compareToObj?.energyCost}
                    total={100}
                    Icon={SvgEnergy}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="PROJECTILE SPEED"
                    current={projectileSpeed}
                    compareTo={compareToObj?.projectileSpeed}
                    total={200000}
                    Icon={SvgProjectileSpeed}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="SPREAD"
                    current={spread}
                    compareTo={compareToObj?.spread}
                    total={100}
                    Icon={SvgSpread}
                />
            </Stack>
        </Box>
    )
}
