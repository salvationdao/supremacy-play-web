import { SvgAmmo, SvgDamageIcon, SvgEnergy, SvgHistoryClock, SvgLine, SvgLoadoutWeapon, SvgRateOfFire, SvgTarget } from "../../../assets"
import { Weapon } from "../../../types"
import { Stat } from "./Stat"

interface WeaponStatsProps {
    weapon: Weapon
    compareTo?: Weapon
}

export const WeaponStats = ({ weapon, compareTo }: WeaponStatsProps) => {
    return (
        <>
            <Stat
                icon={<SvgDamageIcon />}
                label="Damage"
                stat={{
                    value: weapon.damage,
                    displayMultiplier: weapon.projectile_amount && weapon.projectile_amount > 1 ? weapon.projectile_amount : undefined,
                }}
                compareStat={{
                    value: compareTo?.damage,
                    displayMultiplier: compareTo?.projectile_amount && compareTo?.projectile_amount > 1 ? compareTo?.projectile_amount : undefined,
                }}
                hideEmptyComparison={!compareTo}
            />
            {((weapon.dot_tick_damage && weapon.dot_tick_damage !== "0") || (compareTo?.dot_tick_damage && compareTo.dot_tick_damage !== "0")) && (
                <Stat
                    icon={<SvgDamageIcon />}
                    label="Damage Over Time (DOT)"
                    stat={{
                        value: weapon.dot_tick_damage,
                    }}
                    compareStat={{
                        value: compareTo?.dot_tick_damage,
                    }}
                    unit="/tick"
                    hideEmptyComparison={!compareTo}
                />
            )}
            <Stat
                icon={<SvgLoadoutWeapon />}
                label="Damage Type"
                stat={{
                    value: weapon.default_damage_type,
                }}
                compareStat={{
                    value: compareTo?.default_damage_type,
                }}
                hideEmptyComparison={!compareTo}
            />
            <Stat
                icon={<SvgLine />}
                label="Max Optimal Range"
                stat={{
                    value: weapon.damage_falloff ? (parseFloat(weapon.damage_falloff) / 100).toFixed(1) : undefined,
                }}
                compareStat={{
                    value: compareTo?.damage_falloff ? (parseFloat(compareTo.damage_falloff) / 100).toFixed(1) : undefined,
                }}
                unit="m"
                hideEmptyComparison={!compareTo}
            />
            <Stat
                icon={<SvgLine />}
                label="Max Range"
                stat={{
                    value:
                        weapon.damage_falloff != null && weapon.damage_falloff_rate != null
                            ? (parseFloat(weapon.damage_falloff) / 100 + parseFloat(weapon.damage) / (parseFloat(weapon.damage_falloff_rate) / 1000)).toFixed(1)
                            : undefined,
                }}
                compareStat={{
                    value:
                        compareTo?.damage_falloff != null && compareTo?.damage_falloff_rate != null
                            ? (
                                  parseFloat(compareTo.damage_falloff) / 100 +
                                  parseFloat(compareTo.damage) / (parseFloat(compareTo.damage_falloff_rate) / 1000)
                              ).toFixed(1)
                            : undefined,
                }}
                unit="m"
                hideEmptyComparison={!compareTo}
            />
            {((weapon.radius && weapon.radius !== "0") || (compareTo?.radius && compareTo.radius !== "0")) && (
                <Stat
                    icon={<SvgTarget />}
                    label="Blast Radius"
                    stat={{
                        value: weapon.radius ? parseFloat(weapon.radius) / 100 : undefined,
                    }}
                    compareStat={{
                        value: compareTo?.radius ? parseFloat(compareTo.radius) / 100 : undefined,
                    }}
                    unit="m"
                    hideEmptyComparison={!compareTo}
                />
            )}
            {
                <Stat
                    icon={<SvgRateOfFire />}
                    label="Rate of Fire"
                    stat={{
                        value: weapon.rate_of_fire,
                    }}
                    compareStat={{
                        value: compareTo?.rate_of_fire,
                    }}
                    unit="shots/min"
                    hideEmptyComparison={!compareTo}
                />
            }
            {((weapon.max_ammo && weapon.max_ammo !== "0") || (compareTo?.max_ammo && compareTo.max_ammo !== "0")) && (
                <Stat
                    icon={<SvgAmmo />}
                    label="Max Ammo"
                    stat={{
                        value: weapon.max_ammo,
                    }}
                    compareStat={{
                        value: compareTo?.max_ammo,
                    }}
                    hideEmptyComparison={!compareTo}
                />
            )}
            {!weapon.power_instant_drain ? (
                <Stat
                    icon={<SvgEnergy />}
                    label="Power Cost"
                    stat={{
                        value:
                            weapon.rate_of_fire && weapon.power_cost
                                ? (parseFloat(weapon.rate_of_fire) / (parseFloat(weapon.power_cost) * 60)).toFixed(1)
                                : undefined,
                    }}
                    compareStat={{
                        value:
                            compareTo?.rate_of_fire && compareTo?.power_cost
                                ? (parseFloat(compareTo.rate_of_fire) / (parseFloat(compareTo.power_cost) * 60)).toFixed(1)
                                : undefined,
                    }}
                    unit="/sec"
                    invertComparison
                    hideEmptyComparison={!compareTo}
                />
            ) : (
                <Stat
                    icon={<SvgEnergy />}
                    label="Power Cost"
                    stat={{
                        value: weapon.power_cost,
                    }}
                    compareStat={{
                        value: compareTo?.power_cost,
                    }}
                    invertComparison
                    hideEmptyComparison={!compareTo}
                />
            )}
            <Stat
                icon={<SvgEnergy />}
                label="Idle Power Cost"
                stat={{
                    value: weapon.idle_power_cost,
                }}
                compareStat={{
                    value: compareTo?.idle_power_cost,
                }}
                invertComparison
                hideEmptyComparison={!compareTo}
            />
            {((weapon.charge_time_seconds && weapon.charge_time_seconds !== "0") ||
                (compareTo?.charge_time_seconds && compareTo.charge_time_seconds !== "0")) && (
                <Stat
                    icon={<SvgHistoryClock />}
                    label="Charge Time"
                    stat={{
                        value: weapon.charge_time_seconds,
                    }}
                    compareStat={{
                        value: compareTo?.charge_time_seconds,
                    }}
                    unit="secs"
                    invertComparison
                    hideEmptyComparison={!compareTo}
                />
            )}
            {/* {<Stat icon={<SvgSpread />} label="Melee Damage" stat={weapon.melee_damage} compareStat={compareTo?.melee_damage} />} */}
        </>
    )
}
