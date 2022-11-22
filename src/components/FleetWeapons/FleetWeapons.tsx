import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgFilter, SvgGridView, SvgListView, SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { getRarityDeets, getWeaponTypeColor, parseString } from "../../helpers"
import { useDebounce, useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { RarityEnum, Weapon, WeaponType } from "../../types"
import { SortTypeLabel } from "../../types/marketplace"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { usePageTabs } from "../Common/NavTabs/usePageTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceButtonGroup } from "../Common/Nice/NiceButtonGroup"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { NiceTextField } from "../Common/Nice/NiceTextField"
import { SortAndFilters } from "../Common/SortAndFilters/SortAndFilters"
import { VirtualizedGrid } from "../Common/VirtualizedGrid"
import { WeaponCard } from "../Common/Weapon/WeaponCard"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    WeaponType = "weaponType",
    Rarities = "rarities",
    EquippedStatus = "equippedStatus",
    AmmoRange = "ammoRange",
    DamageRange = "damageRange",
    DamageFalloffRange = "damageFalloffRange",
    DamageFalloffRateRange = "damageFalloffRateRange",
    RadiusRange = "radiusRange",
    RadiusDamageFalloffRange = "radiusDamageFalloffRange",
    RateOfFireRange = "rateOfFireRange",
    EnergyCostRange = "energyCostRange",
    ProjectileSpeedRange = "projectileSpeedRange",
    SpreadRange = "spreadRange",
}

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

const equippedStatusOptions = [
    { value: "true", render: { label: "Equipped", color: colors.green } },
    { value: "false", render: { label: "Not Equipped", color: colors.yellow } },
]

const weaponTypeOptions = [
    { value: WeaponType.Cannon, render: { label: WeaponType.Cannon, color: getWeaponTypeColor(WeaponType.Cannon) } },
    { value: WeaponType.GrenadeLauncher, render: { label: WeaponType.GrenadeLauncher, color: getWeaponTypeColor(WeaponType.GrenadeLauncher) } },
    { value: WeaponType.MachineGun, render: { label: WeaponType.MachineGun, color: getWeaponTypeColor(WeaponType.MachineGun) } },
    { value: WeaponType.Flak, render: { label: WeaponType.Flak, color: getWeaponTypeColor(WeaponType.Flak) } },
    { value: WeaponType.Sword, render: { label: WeaponType.Sword, color: getWeaponTypeColor(WeaponType.Sword) } },
    { value: WeaponType.Minigun, render: { label: WeaponType.Minigun, color: getWeaponTypeColor(WeaponType.Minigun) } },
    { value: WeaponType.MissileLauncher, render: { label: WeaponType.MissileLauncher, color: getWeaponTypeColor(WeaponType.MissileLauncher) } },
    { value: WeaponType.PlasmaGun, render: { label: WeaponType.PlasmaGun, color: getWeaponTypeColor(WeaponType.PlasmaGun) } },
    { value: WeaponType.SniperRifle, render: { label: WeaponType.SniperRifle, color: getWeaponTypeColor(WeaponType.SniperRifle) } },
    { value: WeaponType.Flamethrower, render: { label: WeaponType.Flamethrower, color: getWeaponTypeColor(WeaponType.Flamethrower) } },
    { value: WeaponType.LaserBeam, render: { label: WeaponType.LaserBeam, color: getWeaponTypeColor(WeaponType.LaserBeam) } },
    { value: WeaponType.LightningGun, render: { label: WeaponType.LightningGun, color: getWeaponTypeColor(WeaponType.LightningGun) } },
    { value: WeaponType.BFG, render: { label: WeaponType.BFG, color: getWeaponTypeColor(WeaponType.BFG) } },
    { value: WeaponType.Rifle, render: { label: WeaponType.Rifle, color: getWeaponTypeColor(WeaponType.Rifle) } },
    { value: WeaponType.RocketPods, render: { label: WeaponType.RocketPods, color: getWeaponTypeColor(WeaponType.RocketPods) } },
]

const rarityOptions = [
    { value: RarityEnum.Mega, render: { ...getRarityDeets("MEGA") } },
    { value: RarityEnum.Colossal, render: { ...getRarityDeets("COLOSSAL") } },
    { value: RarityEnum.Rare, render: { ...getRarityDeets("RARE") } },
    { value: RarityEnum.Legendary, render: { ...getRarityDeets("LEGENDARY") } },
    { value: RarityEnum.EliteLegendary, render: { ...getRarityDeets("ELITE_LEGENDARY") } },
    { value: RarityEnum.UltraRare, render: { ...getRarityDeets("ULTRA_RARE") } },
    { value: RarityEnum.Exotic, render: { ...getRarityDeets("EXOTIC") } },
    { value: RarityEnum.Guardian, render: { ...getRarityDeets("GUARDIAN") } },
    { value: RarityEnum.Mythic, render: { ...getRarityDeets("MYTHIC") } },
    { value: RarityEnum.DeusEx, render: { ...getRarityDeets("DEUS_EX") } },
    { value: RarityEnum.Titan, render: { ...getRarityDeets("TITAN") } },
]

const layoutOptions = [
    { label: "", value: true, svg: <SvgGridView size="1.5rem" /> },
    { label: "", value: false, svg: <SvgListView size="1.5rem" /> },
]

export const FleetWeapons = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search
    const [showFilters, setShowFilters] = useLocalStorage<boolean>("fleetWeaponsFilters", false)
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.Alphabetical)
    const [isGridView, setIsGridView] = useLocalStorage<boolean>("fleetWeaponsGrid", true)
    const [weaponType, setWeaponType] = useState<string[]>((query.get(UrlQueryParams.WeaponType) || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get(UrlQueryParams.Rarities) || undefined)?.split("||") || [])
    const [equippedStatus, setEquippedStatus] = useState<string[]>((query.get(UrlQueryParams.EquippedStatus) || undefined)?.split("||") || [])
    const [ammoRange, setAmmoRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.AmmoRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [damageRange, setDamageRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.DamageRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [damageFalloffRange, setDamageFalloffRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.DamageFalloffRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [damageFalloffRateRange, setDamageFalloffRateRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.DamageFalloffRateRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [radiusRange, setRadiusRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.RadiusRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [radiusDamageFalloffRange, setRadiusDamageFalloffRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.RadiusDamageFalloffRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [rateOfFireRange, setRateOfFireRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.RateOfFireRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [energyCostRange, setEnergyCostRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.EnergyCostRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [projectileSpeedRange, setProjectileSpeedRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.ProjectileSpeedRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )
    const [spreadRange, setSpreadRange] = useState<number[] | undefined>(
        (query.get(UrlQueryParams.SpreadRange) || undefined)?.split("||").map((a) => parseString(a, 0)),
    )

    // Items
    const [displayWeapons, setDisplayWeapons] = useState<Weapon[]>([])
    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useGameServerSubscriptionSecuredUser<Weapon[]>(
        {
            URI: "/owned_weapons",
            key: GameServerKeys.GetPlayerOwnedWeapons,
        },
        (payload) => {
            setIsLoading(false)
            if (!payload) return

            setWeapons((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((weapon) => payload.find((p) => p.id === weapon.id) || weapon)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((weapon) => weapon.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list
            })
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        if (isLoading) return

        let result = [...weapons]

        // Apply search
        if (search) {
            result = result.filter((weapon) => `${weapon.label.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // Apply weapon type filter
        if (weaponType && weaponType.length) {
            result = result.filter((weapon) => weaponType.includes(weapon.weapon_type))
        }

        // Apply rarity filter
        if (rarities && rarities.length) {
            result = result.filter((weapon) => rarities.includes(weapon.tier))
        }

        // Apply equipped status filter
        if (equippedStatus && equippedStatus.length) {
            result = result.filter((weapon) => equippedStatus.includes(weapon.equipped_on ? "true" : "false"))
        }

        // Apply ammo range filter
        if (ammoRange && ammoRange.length) {
            result = result.filter((weapon) => !weapon.max_ammo || (parseFloat(weapon.max_ammo) >= ammoRange[0] && parseFloat(weapon.max_ammo) <= ammoRange[1]))
        }

        // Apply damage range filter
        if (damageRange && damageRange.length) {
            result = result.filter((weapon) => !weapon.damage || (parseFloat(weapon.damage) >= damageRange[0] && parseFloat(weapon.damage) <= damageRange[1]))
        }

        // Apply damage falloff range filter
        if (damageFalloffRange && damageFalloffRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.damage_falloff ||
                    (parseFloat(weapon.damage_falloff) >= damageFalloffRange[0] && parseFloat(weapon.damage_falloff) <= damageFalloffRange[1]),
            )
        }

        // Apply damage falloff rate range filter
        if (damageFalloffRateRange && damageFalloffRateRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.damage_falloff_rate ||
                    (parseFloat(weapon.damage_falloff_rate) >= damageFalloffRateRange[0] &&
                        parseFloat(weapon.damage_falloff_rate) <= damageFalloffRateRange[1]),
            )
        }

        // Apply radius range filter
        if (radiusRange && radiusRange.length) {
            result = result.filter((weapon) => !weapon.radius || (parseFloat(weapon.radius) >= radiusRange[0] && parseFloat(weapon.radius) <= radiusRange[1]))
        }

        // Apply radius damage falloff range filter
        if (radiusDamageFalloffRange && radiusDamageFalloffRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.radius_damage_falloff ||
                    (parseFloat(weapon.radius_damage_falloff) >= radiusDamageFalloffRange[0] &&
                        parseFloat(weapon.radius_damage_falloff) <= radiusDamageFalloffRange[1]),
            )
        }

        // Apply rate of fire range filter
        if (rateOfFireRange && rateOfFireRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.rate_of_fire || (parseFloat(weapon.rate_of_fire) >= rateOfFireRange[0] && parseFloat(weapon.rate_of_fire) <= rateOfFireRange[1]),
            )
        }

        // Apply energy cost range filter
        if (energyCostRange && energyCostRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.energy_cost || (parseFloat(weapon.energy_cost) >= energyCostRange[0] && parseFloat(weapon.energy_cost) <= energyCostRange[1]),
            )
        }

        // Apply projectile speed range filter
        if (projectileSpeedRange && projectileSpeedRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.projectile_speed ||
                    (parseFloat(weapon.projectile_speed) >= projectileSpeedRange[0] && parseFloat(weapon.projectile_speed) <= projectileSpeedRange[1]),
            )
        }

        // Apply spread range filter
        if (spreadRange && spreadRange.length) {
            result = result.filter(
                (weapon) =>
                    !weapon.projectile_speed ||
                    (parseFloat(weapon.projectile_speed) >= spreadRange[0] && parseFloat(weapon.projectile_speed) <= spreadRange[1]),
            )
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.label}`.localeCompare(`${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.label}`.localeCompare(`${a.label}`))
                break
            case SortTypeLabel.RarestAsc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
            [UrlQueryParams.WeaponType]: weaponType.join("||"),
            [UrlQueryParams.Rarities]: rarities.join("||"),
            [UrlQueryParams.EquippedStatus]: equippedStatus.join("||"),
            [UrlQueryParams.AmmoRange]: ammoRange?.join("||"),
            [UrlQueryParams.DamageRange]: damageRange?.join("||"),
            [UrlQueryParams.DamageFalloffRange]: damageFalloffRange?.join("||"),
            [UrlQueryParams.DamageFalloffRateRange]: damageFalloffRateRange?.join("||"),
            [UrlQueryParams.RadiusRange]: radiusRange?.join("||"),
            [UrlQueryParams.RadiusDamageFalloffRange]: radiusDamageFalloffRange?.join("||"),
            [UrlQueryParams.RateOfFireRange]: rateOfFireRange?.join("||"),
            [UrlQueryParams.EnergyCostRange]: energyCostRange?.join("||"),
            [UrlQueryParams.ProjectileSpeedRange]: projectileSpeedRange?.join("||"),
            [UrlQueryParams.SpreadRange]: spreadRange?.join("||"),
        })

        setDisplayWeapons(result)
    }, [
        ammoRange,
        damageFalloffRange,
        damageFalloffRateRange,
        damageRange,
        energyCostRange,
        equippedStatus,
        isLoading,
        projectileSpeedRange,
        radiusDamageFalloffRange,
        radiusRange,
        rarities,
        rateOfFireRange,
        search,
        sort,
        spreadRange,
        updateQuery,
        weapons,
        weaponType,
    ])

    const renderIndex = useCallback(
        (index) => {
            const weapon = displayWeapons[index]
            if (!weapon) {
                return null
            }
            return <WeaponCard key={`weapon-${weapon.id}`} weapon={weapon} isGridView={isGridView} />
        },
        [displayWeapons, isGridView],
    )

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displayWeapons && displayWeapons.length > 0) {
            return (
                <VirtualizedGrid
                    uniqueID="fleetWeaponsGrid"
                    itemWidthConfig={isGridView ? { minWidth: 300 } : { columnCount: 1 }}
                    itemHeight={isGridView ? 262 : 96}
                    totalItems={displayWeapons.length}
                    gap={13}
                    renderIndex={renderIndex}
                />
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" spacing="1.2rem" sx={{ height: "100%", p: "1rem" }}>
                <Box
                    sx={{
                        width: "20rem",
                        height: "20rem",
                        opacity: 0.7,
                        filter: "grayscale(100%)",
                        background: `url(${EmptyWarMachinesPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "contain",
                    }}
                />
                <Typography
                    sx={{
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    No results...
                </Typography>

                <NiceButton route={{ to: `/marketplace/weapons` }} buttonColor={theme.factionTheme.primary}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [displayWeapons, isGridView, isLoading, renderIndex, theme.factionTheme.primary])

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                maxWidth: "190rem",
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

            <Stack direction="row" alignItems="stretch" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <SortAndFilters
                    open={showFilters}
                    chipFilters={[
                        {
                            label: "Equipped Status",
                            options: equippedStatusOptions,
                            initialExpanded: true,
                            selected: equippedStatus,
                            setSelected: setEquippedStatus,
                        },
                        {
                            label: "Weapon Type",
                            options: weaponTypeOptions,
                            initialExpanded: true,
                            selected: weaponType,
                            setSelected: setWeaponType,
                        },
                        {
                            label: "Rarity",
                            options: rarityOptions,
                            initialExpanded: true,
                            selected: rarities,
                            setSelected: setRarities,
                        },
                    ]}
                    rangeFilters={[
                        {
                            label: "Ammo",
                            initialExpanded: true,
                            values: ammoRange,
                            setValues: setAmmoRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.max_ammo || "0")),
                        },
                        {
                            label: "Damage",
                            initialExpanded: true,
                            values: damageRange,
                            setValues: setDamageRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.damage || "0")),
                        },
                        {
                            label: "Damage falloff",
                            initialExpanded: false,
                            values: damageFalloffRange,
                            setValues: setDamageFalloffRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.damage_falloff || "0")),
                        },
                        {
                            label: "Damage falloff rate",
                            initialExpanded: false,
                            values: damageFalloffRateRange,
                            setValues: setDamageFalloffRateRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.damage_falloff_rate || "0")),
                        },
                        {
                            label: "Radius",
                            initialExpanded: false,
                            values: radiusRange,
                            setValues: setRadiusRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.radius || "0")),
                        },
                        {
                            label: "Radius damage falloff",
                            initialExpanded: false,
                            values: radiusDamageFalloffRange,
                            setValues: setRadiusDamageFalloffRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.radius_damage_falloff || "0")),
                        },
                        {
                            label: "Rate of fire",
                            initialExpanded: false,
                            values: rateOfFireRange,
                            setValues: setRateOfFireRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.rate_of_fire || "0")),
                        },
                        {
                            label: "Energy cost",
                            initialExpanded: false,
                            values: energyCostRange,
                            setValues: setEnergyCostRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.energy_cost || "0")),
                        },
                        {
                            label: "Projectile speed",
                            initialExpanded: false,
                            values: projectileSpeedRange,
                            setValues: setProjectileSpeedRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.projectile_speed || "0")),
                        },
                        {
                            label: "Spread",
                            initialExpanded: false,
                            values: spreadRange,
                            setValues: setSpreadRange,
                            numberFreq: weapons.map((weapon) => parseFloat(weapon.projectile_speed || "0")),
                        },
                    ]}
                />

                <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                    {/* Search, sort, grid view, and other top buttons */}
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                        {/* Filter button */}
                        <NiceButton
                            onClick={() => setShowFilters((prev) => !prev)}
                            fill={showFilters}
                            buttonColor={theme.factionTheme.primary}
                            sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold} color={showFilters ? theme.factionTheme.text : "#FFFFFF"}>
                                <SvgFilter inline size="1.5rem" /> FILTER
                            </Typography>
                        </NiceButton>

                        <Box flex={1} />

                        {/* Show total */}
                        <Box sx={{ backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
                            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                {displayWeapons?.length || 0} ITEMS
                            </Typography>
                        </Box>

                        {/* Page layout options */}
                        <NiceButtonGroup
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.text}
                            options={layoutOptions}
                            selected={isGridView}
                            onSelected={(value) => setIsGridView(value)}
                        />

                        {/* Search bar */}
                        <NiceTextField
                            primaryColor={theme.factionTheme.primary}
                            value={searchInstant}
                            onChange={(value) => setSearch(value)}
                            placeholder="Search..."
                            InputProps={{
                                endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                            }}
                        />

                        {/* Sort */}
                        <NiceSelect
                            label="Sort:"
                            options={sortOptions}
                            selected={sort}
                            onSelected={(value) => setSort(`${value}`)}
                            sx={{ minWidth: "26rem" }}
                        />
                    </Stack>

                    <Box sx={{ flex: 1, overflowY: "auto" }}>{content}</Box>
                </Stack>
            </Stack>
        </Stack>
    )
}
