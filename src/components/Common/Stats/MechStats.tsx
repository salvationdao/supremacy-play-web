import {
    SvgDoubleChevronUp,
    SvgEnergy,
    SvgHealth,
    SvgLoadoutShield,
    SvgLoadoutShieldPowerCost,
    SvgLoadoutSpeed,
    SvgLoadoutUtility,
    SvgLoadoutWeapon,
    SvgPowerCoreCapacity,
    SvgTarget,
} from "../../../assets"
import { MechDetails } from "../../../types"
import { Stat } from "./Stat"

export interface MechStatsProps {
    mech: MechDetails
}

export const MechStats = ({ mech }: MechStatsProps) => {
    return (
        <>
            <Stat
                icon={<SvgLoadoutWeapon />}
                label="Weapon Hardpoints"
                stat={{
                    value: mech.weapon_hardpoints,
                }}
            />
            <Stat
                icon={<SvgLoadoutUtility />}
                label="Utility Slots"
                stat={{
                    value: mech.utility_slots,
                }}
            />
            <Stat
                icon={<SvgLoadoutSpeed />}
                label="Walk Speed"
                stat={{
                    value: (mech.speed / (parseFloat(mech.walk_speed_modifier) * 100)).toFixed(0),
                }}
            />
            {mech.walk_speed_modifier !== "0" && (
                <Stat
                    icon={<SvgLoadoutSpeed />}
                    label="Top Speed"
                    stat={{
                        value: mech.speed / 100,
                    }}
                />
            )}
            <Stat
                icon={<SvgHealth />}
                label="Hull Hitpoints (HP)"
                stat={{
                    value: mech.max_hitpoints,
                }}
            />
            <Stat
                icon={<SvgPowerCoreCapacity />}
                label="Power Core Size"
                stat={{
                    value: mech.power_core_size,
                }}
            />
            <Stat
                icon={<SvgLoadoutShield />}
                label="Sheild Hitpoints"
                stat={{
                    value: mech.shield,
                }}
            />
            <Stat
                icon={<SvgLoadoutShield />}
                label="Shield Recharge"
                stat={{
                    value: mech.shield_recharge_rate,
                }}
                unit="/sec"
            />
            <Stat
                icon={<SvgLoadoutShieldPowerCost />}
                label="Shield Power Cost"
                stat={{
                    value: mech.shield_recharge_power_cost,
                }}
                unit="/sec"
                invertComparison
            />
            <Stat
                icon={<SvgEnergy />}
                label="Idle Power Drain"
                stat={{
                    value: mech.idle_drain,
                }}
                unit="/sec"
                invertComparison
            />
            <Stat
                icon={<SvgEnergy />}
                label="Walk Power Drain"
                stat={{
                    value: mech.walk_drain,
                }}
                unit="/sec"
                invertComparison
            />
            <Stat
                icon={<SvgEnergy />}
                label="Sprint Power Drain"
                stat={{
                    value: mech.run_drain,
                }}
                unit="/sec"
                invertComparison
            />
            <Stat
                icon={<SvgTarget />}
                label="Sprint Accuracy Penalty"
                stat={{
                    value: ((parseFloat(mech.sprint_spread_modifier) - 1) * 10).toFixed(1),
                }}
                unit="%"
                invertComparison
            />
            <Stat
                icon={<SvgDoubleChevronUp />}
                label="Boost"
                stat={{
                    value: mech.boosted_stat.split("_").join(" "),
                }}
            />
            {mech.boosted_shield_recharge_rate !== mech.shield_recharge_rate && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Sprint Spread Modifier"
                    stat={{
                        value: mech.boosted_shield_recharge_rate,
                    }}
                    compareStat={{
                        value: mech.shield_recharge_rate,
                    }}
                />
            )}
            {mech.boosted_sprint_spread_modifier !== mech.sprint_spread_modifier && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Sprint Spread Modifier"
                    stat={{
                        value: mech.boosted_sprint_spread_modifier,
                    }}
                    compareStat={{
                        value: mech.sprint_spread_modifier,
                    }}
                    invertComparison
                />
            )}
            {mech.boosted_walk_speed_modifier !== mech.walk_speed_modifier && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Sprint Spread Modifier"
                    stat={{
                        value: mech.boosted_walk_speed_modifier,
                    }}
                    compareStat={{
                        value: mech.walk_speed_modifier,
                    }}
                />
            )}
            {/* <Stat
                icon={<SvgDamageIcon />}
                label="Melee Force"
                stat={{
                    value: mech.melee_force,
                }}
            /> */}
        </>
    )
}
