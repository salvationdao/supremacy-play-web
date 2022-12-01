import { Box, Stack, SxProps } from "@mui/material"
import React from "react"
import {
    SvgDoubleChevronUp,
    SvgLoadoutArmour,
    SvgLoadoutPowerCoreCapacity,
    SvgLoadoutPowerCoreRegen,
    SvgLoadoutShield,
    SvgLoadoutShieldPowerCost,
    SvgLoadoutShieldRegen,
    SvgLoadoutSpeed,
    SvgWrapperProps,
} from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { MechBasic } from "../../../../types"
import { NiceTooltip } from "../../Nice/NiceTooltip"
import { ProgressBar } from "../../ProgressBar"
import { TypographyTruncated } from "../../TypographyTruncated"

export const MechStats = React.memo(function MechStats({ mech, sx }: { mech: MechBasic; sx?: SxProps }) {
    const health = mech.max_hitpoints
    const boostedHealth = mech.boosted_max_hitpoints
    const speed = mech.speed
    const boostedSpeed = mech.boosted_speed
    const totalShield = mech.shield
    const totalShieldRechargeRate = mech.shield_recharge_rate
    const boostedTotalShieldRechargeRate = mech.shield_recharge_rate
    const totalShieldRechargePowerCost = mech.shield_recharge_power_cost
    const powerCoreCapacity = mech.power_core_capacity || 0
    const powerCoreRechargeRate = mech.power_core_recharge_rate || 0

    return (
        <Stack sx={sx}>
            <SingleStat label="HEALTH" current={health} Icon={SvgLoadoutArmour} boostedTo={boostedHealth} total={30000} />
            <SingleStat label="SHIELD" current={totalShield} Icon={SvgLoadoutShield} total={3000} />
            <SingleStat
                label="SHIELD REGEN"
                current={totalShieldRechargeRate}
                Icon={SvgLoadoutShieldRegen}
                boostedTo={boostedTotalShieldRechargeRate}
                total={1000}
            />
            <SingleStat label="SHIELD REGEN POWER COST" current={totalShieldRechargePowerCost} unit="/S" Icon={SvgLoadoutShieldPowerCost} total={100} />
            <SingleStat label="SPEED" current={speed} unit="CM/S" Icon={SvgLoadoutSpeed} boostedTo={boostedSpeed} total={5000} />
            <SingleStat label="Power Core CAPACITY" current={powerCoreCapacity} Icon={SvgLoadoutPowerCoreCapacity} total={3000} />
            <SingleStat label="Power Core REGEN" current={powerCoreRechargeRate} unit="/S" Icon={SvgLoadoutPowerCoreRegen} total={500} />
        </Stack>
    )
})

const SingleStat = ({
    label,
    current: _current,
    boostedTo: _boostedTo,
    total,
    unit,
    Icon,
}: {
    label: string
    current: number | string
    boostedTo?: number | string
    total: number
    unit?: string
    Icon: React.VoidFunctionComponent<SvgWrapperProps>
}) => {
    const current = typeof _current === "string" ? parseFloat(_current) : _current
    const boostedTo = typeof _boostedTo === "string" ? parseFloat(_boostedTo) : _boostedTo || current
    const boostedBy = boostedTo == current ? 0 : boostedTo - current

    return (
        <Stack direction="row" alignItems="center" spacing=".8rem">
            <Icon />

            <Box sx={{ width: "11rem" }}>
                <TypographyTruncated fontWeight="bold">{label}</TypographyTruncated>
            </Box>

            <Box flex={1}>
                <ProgressBar percent={(100 * current) / total} boostedPercent={(100 * boostedTo) / total} orientation="horizontal" color={colors.red} />
            </Box>

            <NiceTooltip text={boostedBy > 0 ? `Boosted from ${current} to ${current + boostedBy}` : ""} placement="top-end">
                <Box sx={{ width: "8rem" }}>
                    <TypographyTruncated
                        color={boostedBy > 0 ? colors.gold : "#FFFFFF"}
                        sx={{ textAlign: "end", fontWeight: boostedBy > 0 ? "bold" : "unset" }}
                    >
                        {current + boostedBy}
                        {unit}
                        {boostedBy > 0 && <SvgDoubleChevronUp inline size="1.2rem" fill={colors.gold} />}
                    </TypographyTruncated>
                </Box>
            </NiceTooltip>
        </Stack>
    )
}
