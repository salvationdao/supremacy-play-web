import { Box, Stack, Typography, useTheme } from "@mui/material"
import React, { useMemo } from "react"
import { fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"

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
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="DAMAGE" current={damage} total={130} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="RADIUS" current={radius} total={900} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="RATE OF FIRE" current={rateOfFire} total={300} />
            </Stack>
        </Box>
    )
}

const BarStatInner = ({
    primaryColor,
    fontSize,
    label,
    current,
    total,
    unit,
    barHeight,
}: {
    primaryColor: string
    fontSize: string
    label: string
    current: number
    total: number
    unit?: string
    barHeight?: string
}) => {
    return useMemo(() => {
        if (!current) return null

        return (
            <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing=".6rem">
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {label}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            fontSize,
                            textAlign: "end",
                            fontFamily: fonts.nostromoBold,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {current}
                        {unit}
                    </Typography>
                </Stack>

                <Box sx={{ height: barHeight || ".7rem", backgroundColor: "#FFFFFF25" }}>
                    <Box
                        sx={{
                            width: `${(100 * current) / total}%`,
                            height: "100%",
                            backgroundColor: primaryColor,
                            transition: "all .15s",
                        }}
                    />
                </Box>
            </Box>
        )
    }, [barHeight, current, fontSize, label, primaryColor, total, unit])
}

const BarStat = React.memo(BarStatInner)
