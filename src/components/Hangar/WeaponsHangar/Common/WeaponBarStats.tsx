import { Box, Stack, useTheme } from "@mui/material"
import React from "react"
import { Weapon } from "../../../../types"
import { BarStat } from "../../WarMachinesHangar/Common/MechBarStats"

export const WeaponBarStats = ({
    weapon,
    color,
    fontSize: fs,
    width,
    spacing,
    barHeight,
}: {
    weapon: Weapon
    weaponDetails?: Weapon
    color?: string
    fontSize?: string
    width?: string
    spacing?: string
    barHeight?: string
}) => {
    const theme = useTheme()

    const primaryColor = color || theme.factionTheme.primary
    const fontSize = fs || "1.1rem"

    const ammo = weapon.max_ammo || 0
    const damage = weapon.damage
    const radius = weapon.radius || 0
    const rateOfFire = weapon.rate_of_fire || 0
    const energyCost = weapon.energy_cost || 0
    const projectileSpeed = weapon.projectile_speed || 0

    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                pr: ".8rem",
                py: ".16rem",
                direction: "ltr",

                "::-webkit-scrollbar": {
                    width: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: primaryColor,
                    borderRadius: 3,
                },
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
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="AMMO" current={ammo} total={3000} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="DAMAGE" current={damage} total={1000} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="RADIUS" current={radius} total={2000} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="RATE OF FIRE" current={rateOfFire} total={1000} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="ENERGY COST" current={energyCost} total={100} />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="PROJECTILE SPEED"
                    current={projectileSpeed}
                    total={200000}
                />
            </Stack>
        </Box>
    )
}
