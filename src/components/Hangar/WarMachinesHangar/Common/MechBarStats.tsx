import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { TooltipHelper } from "../../.."
import { SvgWrapperProps } from "../../../../assets"
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
                <BarStat primaryColor={primaryColor} fontSize={fontSize} barHeight={barHeight} label="SPEED" current={speed} total={5000} unit="CM/S" />
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

export const BarStat = ({
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
    current: number | string
    total: number
    unit?: string
    barHeight?: string
}) => {
    return useMemo(() => {
        const parsedCurrent = typeof current === "string" ? parseFloat(current) : current
        if (!parsedCurrent) return null

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
                        {parsedCurrent}
                        {unit}
                    </Typography>
                </Stack>

                <Box sx={{ height: barHeight || ".7rem", backgroundColor: "#FFFFFF25" }}>
                    <Box
                        sx={{
                            width: `${(100 * parsedCurrent) / total}%`,
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

export const IconStat = ({
    primaryColor,
    fontSize,
    label,
    current,
    total,
    Icon,
}: {
    primaryColor: string
    fontSize: string
    label: string
    current: number | string
    total: number
    unit?: string
    Icon: React.VoidFunctionComponent<SvgWrapperProps>
}) => {
    return useMemo(() => {
        const parsedCurrent = typeof current === "string" ? parseFloat(current) : current
        if (!parsedCurrent) return null

        return (
            <TooltipHelper text={`${label}: ${current}/${total}`} placement="bottom">
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".2rem"
                    sx={{ mr: ".6rem", mb: ".4rem", px: ".4rem", pt: ".1rem", backgroundColor: `${primaryColor}38`, borderRadius: 0.6 }}
                >
                    <Icon size={fontSize} sx={{ pb: "3px", height: "unset" }} />
                    <Typography sx={{ lineHeight: 1, fontSize }}>{parsedCurrent}</Typography>
                </Stack>
            </TooltipHelper>
        )
    }, [Icon, current, fontSize, label, primaryColor, total])
}
