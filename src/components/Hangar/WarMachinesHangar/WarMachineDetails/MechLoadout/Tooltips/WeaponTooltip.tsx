import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgAmmo, SvgDamage1, SvgDamageFalloff, SvgLoadoutWeapon, SvgRadius, SvgRadiusDamageFalloffRate } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts } from "../../../../../../theme/theme"
import { Weapon } from "../../../../../../types"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"
import { Stat } from "./Stat"

export interface WeaponTooltipProps {
    id: string
    compareTo?: Weapon
}

export const WeaponTooltip = ({ id, compareTo }: WeaponTooltipProps) => {
    const theme = useTheme()
    const [weapon, setWeapon] = useState<Weapon>()

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${id}/details`,
            key: GameServerKeys.GetWeaponDetails,
        },
        (payload) => {
            if (!payload) return
            setWeapon(payload)
        },
    )

    const content = useMemo(() => {
        if (!weapon) {
            return (
                <Stack
                    sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size="2rem" />
                </Stack>
            )
        }

        const rarity = getRarityDeets(weapon.tier)
        return (
            <>
                <Stack
                    sx={{
                        p: "2rem",
                        background: `linear-gradient(to right, ${theme.factionTheme.background}, ${rarity.color}22)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBold,
                            fontSize: "1.6rem",
                        }}
                    >
                        {weapon.label}
                    </Typography>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{weapon.label}</Typography>
                        <Typography
                            sx={{
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Stack>
                </Stack>
                <Box
                    component="img"
                    src={weapon.image_url || weapon.avatar_url}
                    sx={{
                        width: "100%",
                        height: "100%",
                        maxHeight: 140,
                        p: "2rem",
                        objectFit: "contain",
                        borderBottom: `1px solid ${rarity.color}`,
                    }}
                />
                <Box p="2rem">
                    <WeaponStats weapon={weapon} compareTo={compareTo} />
                </Box>
            </>
        )
    }, [compareTo, theme.factionTheme.background, weapon])

    return (
        <NiceBoxThing
            border={{
                color: weapon ? getRarityDeets(weapon.tier).color : theme.factionTheme.primary,
                thickness: "lean",
            }}
            background={{
                colors: [theme.factionTheme.background],
            }}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 250,
                width: 280,
            }}
        >
            {content}
        </NiceBoxThing>
    )
}

interface WeaponStatsProps {
    weapon: Weapon
    compareTo?: Weapon
}

const WeaponStats = ({ weapon, compareTo }: WeaponStatsProps) => {
    console.log(weapon)
    return (
        <>
            {/* multiplied by projectile_amount */}
            <Stat
                icon={<SvgDamage1 />}
                label="Damage"
                stat={{
                    value: weapon.damage,
                    displayMultiplier: weapon.projectile_amount && weapon.projectile_amount > 1 ? weapon.projectile_amount : undefined,
                }}
                compareStat={{
                    value: compareTo?.damage,
                    displayMultiplier: compareTo?.projectile_amount && compareTo?.projectile_amount > 1 ? compareTo?.projectile_amount : undefined,
                }}
            />
            <Stat
                icon={<SvgLoadoutWeapon />}
                label="Damage Type"
                stat={{
                    value: weapon.default_damage_type,
                }}
                compareStat={{
                    value: compareTo?.default_damage_type,
                }}
            />
            <Stat
                icon={<SvgDamageFalloff />}
                label="Max Optimal Range"
                stat={{
                    value: weapon.damage_falloff ? parseFloat(weapon.damage_falloff) / 100 : undefined,
                }}
                compareStat={{
                    value: compareTo?.damage_falloff ? parseFloat(compareTo.damage_falloff) / 100 : undefined,
                }}
                unit="m"
            />{" "}
            <Stat
                icon={<SvgDamageFalloff />}
                label="Max Range"
                stat={{
                    value:
                        weapon.damage_falloff != null && weapon.damage_falloff_rate != null
                            ? parseFloat(weapon.damage_falloff) / 100 + parseFloat(weapon.damage) / (parseFloat(weapon.damage_falloff_rate) / 1000)
                            : undefined,
                }}
                compareStat={{
                    value:
                        compareTo?.damage_falloff != null && compareTo?.damage_falloff_rate != null
                            ? parseFloat(compareTo.damage_falloff) / 100 + parseFloat(compareTo.damage) / (parseFloat(compareTo.damage_falloff_rate) / 1000)
                            : undefined,
                }}
                unit="m"
            />
            {/* divide by 100 */}
            {
                <Stat
                    icon={<SvgRadius />}
                    label="Blast Radius"
                    stat={{
                        value: weapon.radius ? parseFloat(weapon.radius) / 100 : undefined,
                    }}
                    compareStat={{
                        value: compareTo?.radius ? parseFloat(compareTo.radius) / 100 : undefined,
                    }}
                    unit="m"
                />
            }
            {
                <Stat
                    icon={<SvgRadiusDamageFalloffRate />}
                    label="Rate of Fire"
                    stat={{
                        value: weapon.rate_of_fire,
                    }}
                    compareStat={{
                        value: compareTo?.rate_of_fire,
                    }}
                    unit="/min"
                />
            }
            {
                <Stat
                    icon={<SvgAmmo />}
                    label="Max Ammo"
                    stat={{
                        value: weapon.max_ammo,
                    }}
                    compareStat={{
                        value: compareTo?.max_ammo,
                    }}
                />
            }
            {/* derived from default_damage_type, if laser beam, lightning gun or flamethrower => power cost per second  blah look here https://kb.supremacy.game/doc/war-machine-weapon-visible-stats-mJ8ft20Anu */}
            {/* {<Stat icon={<SvgEnergy />} label="Power Cost" stat={weapon.power_cost} compareStat={compareTo?.power_cost} />} */}
            {/* {<Stat icon={<SvgEnergy />} label="Idle Power Cost" stat={weapon.idle_power_cost} compareStat={compareTo?.idle_power_cost}  />} */}
            {/* {<Stat icon={<SvgDamageFalloffRate />} label="Damage Over Time (DOT)" stat={weapon.dot_tick_damage} compareStat={compareTo?.dot_tick_damage}/>} */}
            {/* {<Stat icon={<SvgDamageFalloffRate />} label="DOT Duration" stat={weapon.dot_max_ticks} compareStat={compareTo?.dot_max_ticks} unit="secs" />} */}
            {/* {<Stat icon={<SvgSpread />} label="Charge Time" stat={weapon.charge_time_seconds} compareStat={compareTo?.charge_time_seconds} unit="secs" />} */}
            {/* {<Stat icon={<SvgSpread />} label="Melee Damage" stat={weapon.melee_damage} compareStat={compareTo?.melee_damage} />} */}
        </>
    )
}
