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
                hideEmptyComparison
            />
            <Stat
                icon={<SvgLoadoutUtility />}
                label="Utility Slots"
                stat={{
                    value: mech.utility_slots,
                }}
                hideEmptyComparison
            />
            <Stat
                icon={<SvgLoadoutSpeed />}
                label="Walk Speed"
                stat={{
                    value: (mech.speed / (parseFloat(mech.walk_speed_modifier) * 100)).toFixed(2),
                }}
                unit="m/sec"
                hideEmptyComparison
            />
            {mech.walk_speed_modifier !== "0" && (
                <Stat
                    icon={<SvgLoadoutSpeed />}
                    label="Top Speed"
                    stat={{
                        value: (mech.speed / 100).toFixed(2),
                    }}
                    unit="m/sec"
                    hideEmptyComparison
                />
            )}
            <Stat
                icon={<SvgHealth />}
                label="Hull Hitpoints (HP)"
                stat={{
                    value: mech.max_hitpoints,
                }}
                hideEmptyComparison
            />
            <Stat
                icon={<SvgPowerCoreCapacity />}
                label="Power Core Size"
                stat={{
                    value: mech.power_core_size,
                }}
                hideEmptyComparison
            />
            <Stat
                icon={<SvgLoadoutShield />}
                label="Sheild Hitpoints"
                stat={{
                    value: mech.shield,
                }}
                hideEmptyComparison
            />
            <Stat
                icon={<SvgLoadoutShield />}
                label="Shield Recharge"
                stat={{
                    value: mech.shield_recharge_rate,
                }}
                unit="/sec"
                hideEmptyComparison
            />
            <Stat
                icon={<SvgLoadoutShieldPowerCost />}
                label="Shield Power Cost"
                stat={{
                    value: mech.shield_recharge_power_cost,
                }}
                unit="/sec"
                invertComparison
                hideEmptyComparison
            />
            <Stat
                icon={<SvgEnergy />}
                label="Idle Power Drain"
                stat={{
                    value: mech.idle_drain,
                }}
                unit="/sec"
                invertComparison
                hideEmptyComparison
            />
            <Stat
                icon={<SvgEnergy />}
                label="Walk Power Drain"
                stat={{
                    value: mech.walk_drain,
                }}
                unit="/sec"
                invertComparison
                hideEmptyComparison
            />
            <Stat
                icon={<SvgEnergy />}
                label="Sprint Power Drain"
                stat={{
                    value: mech.run_drain,
                }}
                unit="/sec"
                invertComparison
                hideEmptyComparison
            />
            <Stat
                icon={<SvgTarget />}
                label="Sprint Accuracy Penalty"
                stat={{
                    value: ((parseFloat(mech.sprint_spread_modifier) - 1) * 10).toFixed(1),
                }}
                unit="%"
                invertComparison
                hideEmptyComparison
            />
            {(mech.chassis_skin?.level || 0) > 0 && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boost"
                    stat={{
                        value: mech.boosted_stat.split("_").join(" "),
                    }}
                    hideEmptyComparison
                />
            )}
            {/* Boosted stats */}
            {mech.boosted_max_hitpoints !== mech.max_hitpoints && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boosted Hull Hitpoints"
                    stat={{
                        value: mech.boosted_max_hitpoints,
                    }}
                    compareStat={{
                        value: mech.max_hitpoints,
                    }}
                    hideEmptyComparison
                />
            )}
            {mech.boosted_speed !== mech.speed && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boosted Speed"
                    stat={{
                        value: mech.boosted_speed,
                    }}
                    compareStat={{
                        value: mech.speed,
                    }}
                    hideEmptyComparison
                />
            )}
            {mech.boosted_shield !== mech.shield && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boosted Max Shield"
                    stat={{
                        value: mech.boosted_shield,
                    }}
                    compareStat={{
                        value: mech.shield,
                    }}
                    hideEmptyComparison
                />
            )}
            {mech.boosted_shield_recharge_rate !== mech.shield_recharge_rate && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boosted Shield Recharge Rate"
                    stat={{
                        value: mech.boosted_shield_recharge_rate,
                    }}
                    compareStat={{
                        value: mech.shield_recharge_rate,
                    }}
                    hideEmptyComparison
                />
            )}
            {mech.boosted_sprint_spread_modifier !== mech.sprint_spread_modifier && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boosted Sprint Spread Modifier"
                    stat={{
                        value: mech.boosted_sprint_spread_modifier,
                    }}
                    compareStat={{
                        value: mech.sprint_spread_modifier,
                    }}
                    invertComparison
                    hideEmptyComparison
                />
            )}
            {mech.boosted_walk_speed_modifier !== mech.walk_speed_modifier && (
                <Stat
                    icon={<SvgDoubleChevronUp />}
                    label="Boosted Walk Speed"
                    stat={{
                        value: mech.boosted_walk_speed_modifier,
                    }}
                    compareStat={{
                        value: mech.walk_speed_modifier,
                    }}
                    hideEmptyComparison
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
