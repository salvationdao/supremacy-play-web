import { Box, Checkbox, Stack, SxProps, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import {
    SvgDoubleChevronUp,
    SvgLoadoutArmour,
    SvgLoadoutPowerCoreCapacity,
    SvgLoadoutPowerCoreRegen,
    SvgLoadoutShield,
    SvgLoadoutShieldPowerCost,
    SvgLoadoutShieldRegen,
    SvgLoadoutSpeed,
    SvgUserDiamond,
    SvgWrapperProps,
} from "../../../assets"
import { useSupremacy } from "../../../containers"
import { truncateTextLines } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, NewMechStruct } from "../../../types"
import { MechWeaponSlot } from "../../../types/battle_queue"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceTooltip } from "../Nice/NiceTooltip"

export const MechCardWeaponAndStats = React.memo(function MechCardWeaponAndStats({
    mech,
    isSelected,
    toggleSelected,
}: {
    mech: NewMechStruct
    isSelected?: boolean
    toggleSelected?: (mech: NewMechStruct) => void
}) {
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    return (
        <NiceBoxThing
            border={{
                color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF20",
                thickness: isSelected ? "lean" : "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem" }}
        >
            <Stack spacing="1.2rem">
                <Stack direction="row" spacing="1.2rem">
                    {/* Mech image */}
                    <NiceBoxThing
                        border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                        background={{ colors: [ownerFaction.palette.background] }}
                        sx={{ boxShadow: 0.4 }}
                    >
                        <Box
                            component="img"
                            src={mech.avatar_url}
                            sx={{
                                height: "7rem",
                                width: "7rem",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </NiceBoxThing>

                    <Stack flex={1} spacing=".4rem" sx={{ py: ".2rem" }}>
                        {/* Mech name and checkbox */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1rem">
                            {/* Mech name */}
                            <Link to={`/mech/${mech.id}`}>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, ...truncateTextLines(1) }}>{mech.name || mech.label}</Typography>
                            </Link>

                            {toggleSelected && (
                                <Checkbox
                                    checked={isSelected}
                                    onClick={() => toggleSelected(mech)}
                                    sx={{
                                        "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.neonBlue} !important` },
                                        ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50 !important` },
                                    }}
                                />
                            )}
                        </Stack>

                        {/* Owner name */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: ownerFaction.palette.primary,
                                fontWeight: "bold",
                                ...truncateTextLines(1),
                            }}
                        >
                            <SvgUserDiamond size="2.5rem" inline fill={ownerFaction.palette.primary} /> {mech.owner.username}#{mech.owner.gid}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing="1.5rem">
                    {/* Mech stats */}
                    <MechStats mech={mech} sx={{ flex: 1 }} />

                    {/* Weapon slots */}
                    <Stack alignItems="center" spacing=".8rem">
                        {mech.weapon_slots && mech.weapon_slots.map((ws) => <WeaponSlot key={`weapon-${ws.slot_number}`} weaponSlot={ws} />)}
                    </Stack>
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})

const WeaponSlot = React.memo(function WeaponSlot({ weaponSlot }: { weaponSlot: MechWeaponSlot }) {
    if (!weaponSlot.weapon) {
        return null
    }

    return (
        <NiceBoxThing
            border={{
                color: "#FFFFFF20",
                thickness: "very-lean",
            }}
            background={{ colors: [colors.darkerNavy], opacity: 0.5 }}
        >
            <Box
                component="img"
                src={weaponSlot.weapon.avatar_url || weaponSlot.weapon.image_url}
                sx={{
                    height: "4rem",
                    width: "4rem",
                    objectFit: "cover",
                    objectPosition: "center",
                }}
            />
        </NiceBoxThing>
    )
})

const MechStats = React.memo(function MechStats({ mech, sx }: { mech: MechBasic; sx?: SxProps }) {
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
            <SingleStat label="HEALTH" current={health} Icon={SvgLoadoutArmour} boostedTo={boostedHealth} />
            <SingleStat label="SHIELD" current={totalShield} Icon={SvgLoadoutShield} />
            <SingleStat label="SHIELD REGEN" current={totalShieldRechargeRate} Icon={SvgLoadoutShieldRegen} boostedTo={boostedTotalShieldRechargeRate} />
            <SingleStat label="SHIELD REGEN POWER COST" current={totalShieldRechargePowerCost} unit="/S" Icon={SvgLoadoutShieldPowerCost} />
            <SingleStat label="SPEED" current={speed} unit="CM/S" Icon={SvgLoadoutSpeed} boostedTo={boostedSpeed} />
            <SingleStat label="Power Core CAPACITY" current={powerCoreCapacity} Icon={SvgLoadoutPowerCoreCapacity} />
            <SingleStat label="Power Core REGEN" current={powerCoreRechargeRate} unit="/S" Icon={SvgLoadoutPowerCoreRegen} />
        </Stack>
    )
})

const SingleStat = ({
    label,
    current: _current,
    boostedTo: _boostedTo,
    unit,
    Icon,
}: {
    label: string
    current: number | string
    boostedTo?: number | string
    unit?: string
    Icon: React.VoidFunctionComponent<SvgWrapperProps>
}) => {
    const current = typeof _current === "string" ? parseFloat(_current) : _current
    const boostedTo = typeof _boostedTo === "string" ? parseFloat(_boostedTo) : _boostedTo || current
    const boostedBy = boostedTo == current ? 0 : boostedTo - current

    return (
        <Stack direction="row" alignItems="center" spacing=".3rem">
            <Icon inline size="1.7rem" />

            <Typography variant="body2">{label}</Typography>

            <Box flex={1} />

            <NiceTooltip text={boostedBy > 0 ? `Boosted from ${current} to ${current + boostedBy}` : ""} placement="top-end">
                <Typography variant="body2" color={boostedBy > 0 ? colors.neonBlue : "#FFFFFF"}>
                    {current + boostedBy}
                    {unit}
                    {boostedBy > 0 && <SvgDoubleChevronUp inline size="1.2rem" fill={colors.neonBlue} />}
                </Typography>
            </NiceTooltip>
        </Stack>
    )
}
