import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechBarStats = ({
    mech,
    mechDetails,
    color,
    fontSize: fs,
    width,
    spacing,
    barHeight,
}: {
    mech: MechBasic
    mechDetails?: MechDetails
    color?: string
    fontSize?: string
    width?: string
    spacing?: string
    barHeight?: string
}) => {
    const theme = useTheme()

    const primaryColor = color || theme.factionTheme.primary
    const fontSize = fs || "1.1rem"

    const health = mech.max_hitpoints
    const speed = mech.speed
    let powerCoreCapacity = 0
    let powerCoreRechargeRate = 0
    let totalShield = 0
    let totalShieldRechargeRate = 0

    if (mechDetails) {
        powerCoreCapacity = mechDetails.power_core?.capacity || 0
        powerCoreRechargeRate = mechDetails.power_core?.recharge_rate || 0

        mechDetails.utility?.forEach((utility) => {
            if (utility.shield) {
                totalShield += utility.shield.hitpoints
                totalShieldRechargeRate += utility.shield.recharge_rate
            }
        })
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
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="HEALTH" current={health} total={3000} />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="SPEED" current={speed} total={3000} unit="M/S" />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="Power Core CAPACITY"
                    current={powerCoreCapacity}
                    total={3000}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="Power Core REGEN"
                    current={powerCoreRechargeRate}
                    total={500}
                    unit="/S"
                />
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="SHIELD" current={totalShield} total={3000} />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="SHIELD REGEN"
                    current={totalShieldRechargeRate}
                    total={1000}
                />
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
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
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

                <Stack direction="row" alignItems="center" spacing=".6rem">
                    <Box sx={{ flex: 1, height: barHeight || ".7rem", backgroundColor: "#FFFFFF25" }}>
                        <Box
                            sx={{
                                width: `${(100 * current) / total}%`,
                                height: "100%",
                                backgroundColor: primaryColor,
                                transition: "all .15s",
                            }}
                        />
                    </Box>

                    <Typography
                        variant="caption"
                        sx={{
                            width: "8rem",
                            fontSize,
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
            </Box>
        )
    }, [barHeight, current, fontSize, label, primaryColor, total, unit])
}

const BarStat = React.memo(BarStatInner)
