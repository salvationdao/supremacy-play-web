import { SvgPowerCore } from "../../../assets"
import { PowerCore } from "../../../types"
import { Stat } from "./Stat"

interface PowerCoreStatsProps {
    powerCore: PowerCore
    compareTo?: PowerCore
}

export const PowerCoreStats = ({ powerCore, compareTo }: PowerCoreStatsProps) => {
    return (
        <>
            <Stat
                icon={<SvgPowerCore />}
                label={"Size"}
                stat={{
                    value: powerCore.size,
                }}
                compareStat={{
                    value: compareTo?.size,
                }}
                hideEmptyComparison={!compareTo}
                nonNumeric
            />
            <Stat
                icon={<SvgPowerCore />}
                label={"Capacity"}
                stat={{
                    value: powerCore.capacity,
                }}
                compareStat={{
                    value: compareTo?.capacity,
                }}
                hideEmptyComparison={!compareTo}
            />
            <Stat
                icon={<SvgPowerCore />}
                label={"Recharge Rate"}
                stat={{
                    value: powerCore.recharge_rate,
                }}
                compareStat={{
                    value: compareTo?.recharge_rate,
                }}
                unit="/sec"
                hideEmptyComparison={!compareTo}
            />
            <Stat
                icon={<SvgPowerCore />}
                label={"Weapon Share"}
                stat={{
                    value: powerCore.weapon_share,
                }}
                compareStat={{
                    value: compareTo?.weapon_share,
                }}
                unit="%"
                hideEmptyComparison={!compareTo}
            />
            <Stat
                icon={<SvgPowerCore />}
                label={"Movement Share"}
                stat={{
                    value: powerCore.movement_share,
                }}
                compareStat={{
                    value: compareTo?.movement_share,
                }}
                unit="%"
                hideEmptyComparison={!compareTo}
            />
            <Stat
                icon={<SvgPowerCore />}
                label={"Utility Share"}
                stat={{
                    value: powerCore.utility_share,
                }}
                compareStat={{
                    value: compareTo?.utility_share,
                }}
                unit="%"
                hideEmptyComparison={!compareTo}
            />
        </>
    )
}
