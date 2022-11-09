import { Box, Stack, SxProps, Typography } from "@mui/material"
import React, { useMemo } from "react"
import {
    SvgLoadoutArmour,
    SvgLoadoutPowerCoreCapacity,
    SvgLoadoutPowerCoreRegen,
    SvgLoadoutShield,
    SvgLoadoutShieldPowerCost,
    SvgLoadoutShieldRegen,
    SvgLoadoutSpeed,
    SvgWrapperProps,
} from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { TruncateTextLines } from "../../../../theme/styles"
import { colors, fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"
import { NiceTooltip } from "../../../Common/Nice/NiceTooltip"

export const MechBarStats = ({
    mech,
    mechDetails,
    color,
    fontSize: fs,
    width,
    spacing,
    barHeight,
    iconVersion,
    compact,
    outerSx,
}: {
    mech: MechBasic
    mechDetails?: MechDetails
    color?: string
    fontSize?: string
    width?: string
    spacing?: string
    barHeight?: string
    iconVersion?: boolean
    compact?: boolean
    outerSx?: SxProps
}) => {
    const theme = useTheme()

    const primaryColor = color || theme.factionTheme.primary
    const fontSize = fs || "1.1rem"

    const health = mechDetails?.max_hitpoints || mech.max_hitpoints
    const boostedHealth = mechDetails?.boosted_max_hitpoints || mech.boosted_max_hitpoints
    const speed = mechDetails?.speed || mech.speed
    const boostedSpeed = mechDetails?.boosted_speed || mech.boosted_speed
    const totalShield = mechDetails?.shield || mech.shield
    const totalShieldRechargeRate = mechDetails?.shield_recharge_rate || mech.shield_recharge_rate
    const boostedTotalShieldRechargeRate = mechDetails?.shield_recharge_rate || mech.shield_recharge_rate
    const totalShieldRechargePowerCost = mechDetails?.shield_recharge_power_cost || mech.shield_recharge_power_cost
    const powerCoreCapacity = mechDetails?.power_core?.capacity || mech.power_core_capacity || 0
    const powerCoreRechargeRate = mechDetails?.power_core?.recharge_rate || mech.power_core_recharge_rate || 0

    if (iconVersion) {
        return (
            <Stack alignItems="center" justifyContent="flex-start" direction="row" flexWrap="wrap">
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="HEALTH"
                    current={health}
                    boostedTo={boostedHealth}
                    total={3000}
                    Icon={SvgLoadoutArmour}
                />
                <IconStat primaryColor={primaryColor} fontSize={fontSize} label="SHIELD" current={totalShield} total={3000} Icon={SvgLoadoutShield} />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="SHIELD REGEN"
                    current={totalShieldRechargeRate}
                    boostedTo={boostedTotalShieldRechargeRate}
                    total={1000}
                    Icon={SvgLoadoutShieldRegen}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="SHIELD REGEN POWER COST"
                    current={totalShieldRechargePowerCost}
                    total={100}
                    unit="/S"
                    Icon={SvgLoadoutShieldPowerCost}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="SPEED"
                    current={speed}
                    boostedTo={boostedSpeed}
                    total={5000}
                    unit="CM/S"
                    Icon={SvgLoadoutSpeed}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="Power Core CAPACITY"
                    current={powerCoreCapacity}
                    total={3000}
                    Icon={SvgLoadoutPowerCoreCapacity}
                />
                <IconStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    label="Power Core REGEN"
                    current={powerCoreRechargeRate}
                    total={500}
                    unit="/S"
                    Icon={SvgLoadoutPowerCoreRegen}
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
                ...outerSx,
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
                    label="HEALTH"
                    current={health}
                    boostedTo={boostedHealth}
                    total={15000}
                    Icon={SvgLoadoutArmour}
                    compact={compact}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="SHIELD"
                    current={totalShield}
                    total={4000}
                    Icon={SvgLoadoutShield}
                    compact={compact}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="SHIELD REGEN"
                    current={totalShieldRechargeRate}
                    boostedTo={boostedTotalShieldRechargeRate}
                    total={500}
                    Icon={SvgLoadoutShieldRegen}
                    compact={compact}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="SHIELD REGEN POWER COST"
                    current={totalShieldRechargePowerCost}
                    total={100}
                    unit="/S"
                    Icon={SvgLoadoutShieldPowerCost}
                    compact={compact}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="SPEED"
                    current={speed}
                    boostedTo={boostedSpeed}
                    total={5000}
                    unit="CM/S"
                    Icon={SvgLoadoutSpeed}
                    compact={compact}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="Power Core CAPACITY"
                    current={powerCoreCapacity}
                    total={3000}
                    Icon={SvgLoadoutPowerCoreCapacity}
                    compact={compact}
                />
                <BarStat
                    primaryColor={primaryColor}
                    fontSize={fontSize}
                    barHeight={barHeight}
                    label="Power Core REGEN"
                    current={powerCoreRechargeRate}
                    total={500}
                    unit="/S"
                    Icon={SvgLoadoutPowerCoreRegen}
                    compact={compact}
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
    boostedTo,
    total,
    unit,
    barHeight,
    Icon,
    compact,
}: {
    primaryColor: string
    fontSize: string
    label: string
    current: number | string
    boostedTo?: number | string
    total: number
    unit?: string
    barHeight?: string
    Icon: React.VoidFunctionComponent<SvgWrapperProps>
    compact?: boolean
}) => {
    const parsedCurrent = useMemo(() => (typeof current === "string" ? parseFloat(current) : current), [current])
    const parsedBoosted = useMemo(() => (typeof boostedTo === "string" ? parseFloat(boostedTo) : boostedTo), [boostedTo])
    if (!parsedCurrent && !parsedBoosted) return null

    if (compact)
        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing=".6rem">
                <NiceTooltip
                    placement="left-end"
                    renderNode={
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize,
                                fontFamily: fonts.nostromoMedium,
                                ...TruncateTextLines(1),
                            }}
                        >
                            {label}
                        </Typography>
                    }
                >
                    <Box>
                        <Icon size={`calc(${fontSize} + 1rem)`} sx={{ pb: "3px", height: "unset" }} />
                    </Box>
                </NiceTooltip>

                <Box flex={1} sx={{ height: barHeight || ".7rem", backgroundColor: "#FFFFFF25", position: "relative" }}>
                    <Box
                        sx={{
                            width: `${(100 * parsedCurrent) / total}%`,
                            height: "100%",
                            backgroundColor: primaryColor,
                            transition: "all .15s",
                            zIndex: 10,
                            position: "absolute",
                        }}
                    />
                    {parsedBoosted && (
                        <Box
                            sx={{
                                width: `${(100 * parsedBoosted) / total}%`,
                                height: "100%",
                                backgroundColor: colors.gold,
                                transition: "all .15s",
                                zIndex: 9,
                                position: "absolute",
                            }}
                        />
                    )}
                </Box>
                <NiceTooltip
                    placement="right"
                    text={
                        parsedBoosted && parsedBoosted != parsedCurrent
                            ? `The attached submodel has boosted this stat from ${parsedCurrent} to ${parsedBoosted}`
                            : ""
                    }
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize,
                            textAlign: "end",
                            fontFamily: fonts.nostromoBold,
                            color: parsedBoosted && parsedBoosted != parsedCurrent ? colors.gold : "#FFFFFF",
                            width: "10rem",
                            ...TruncateTextLines(1),
                        }}
                    >
                        {parsedBoosted || parsedCurrent}
                        {unit}
                    </Typography>
                </NiceTooltip>
            </Stack>
        )

    return (
        <Box>
            <NiceTooltip
                placement="right"
                text={
                    parsedBoosted && parsedBoosted != parsedCurrent
                        ? `The attached submodel has boosted this stat from ${parsedCurrent} to ${parsedBoosted}`
                        : ""
                }
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing=".6rem">
                    <Stack spacing=".5rem" direction="row" alignItems="center">
                        <Icon size={fontSize} sx={{ pb: "3px", height: "unset" }} />
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize,
                                fontFamily: fonts.nostromoBlack,
                                ...TruncateTextLines(1),
                            }}
                        >
                            {label}
                        </Typography>
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{
                            fontSize,
                            textAlign: "end",
                            fontFamily: fonts.nostromoBold,
                            color: parsedBoosted && parsedBoosted != parsedCurrent ? colors.gold : "#FFFFFF",
                            ...TruncateTextLines(1),
                        }}
                    >
                        {parsedBoosted || parsedCurrent}
                        {unit}
                    </Typography>
                </Stack>
            </NiceTooltip>

            <Box sx={{ height: barHeight || ".7rem", backgroundColor: "#FFFFFF25", position: "relative" }}>
                <Box
                    sx={{
                        width: `${(100 * parsedCurrent) / total}%`,
                        height: "100%",
                        backgroundColor: primaryColor,
                        transition: "all .15s",
                        zIndex: 10,
                        position: "absolute",
                    }}
                />
                {parsedBoosted && (
                    <Box
                        sx={{
                            width: `${(100 * parsedBoosted) / total}%`,
                            height: "100%",
                            backgroundColor: colors.gold,
                            transition: "all .15s",
                            zIndex: 9,
                            position: "absolute",
                        }}
                    />
                )}
            </Box>
        </Box>
    )
}

export const IconStat = ({
    primaryColor,
    fontSize,
    label,
    current,
    boostedTo,
    Icon,
}: {
    primaryColor: string
    fontSize: string
    label: string
    current: number | string
    boostedTo?: number | string
    total: number
    unit?: string
    Icon: React.VoidFunctionComponent<SvgWrapperProps>
}) => {
    return useMemo(() => {
        const parsedCurrent = typeof current === "string" ? parseFloat(current) : current
        const parsedBoosted = typeof boostedTo === "string" ? parseFloat(boostedTo) : boostedTo
        if (!parsedCurrent && !parsedBoosted) return null

        return (
            <NiceTooltip text={`${label}: ${boostedTo || current}`} placement="bottom">
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".2rem"
                    sx={{
                        mr: ".8rem",
                        mb: ".6rem",
                        px: ".6rem",
                        pt: ".2rem",
                        backgroundColor: `${primaryColor}28`,
                        borderRadius: 0.4,
                    }}
                >
                    <Icon size={`calc(${fontSize} + 1rem)`} sx={{ pb: "3px" }} />
                    <Typography sx={{ lineHeight: 1, fontSize }}>{parsedBoosted || parsedCurrent}</Typography>
                </Stack>
            </NiceTooltip>
        )
    }, [Icon, current, fontSize, label, primaryColor, boostedTo])
}
