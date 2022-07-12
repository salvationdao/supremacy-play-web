import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getWeaponTypeColor, parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Weapon, WeaponType } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { SliderRangeFilter } from "../../Common/SortAndFilters/SliderRangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { WeaponHangarItem } from "./WeaponHangarItem"

interface GetWeaponsRequest {
    page: number
    page_size: number
    include_market_listed: boolean
    exclude_equipped?: boolean
    weapon_types: string[]
    equipped_statuses: string[]
    search: string
    stat_ammo?: GetWeaponStatFilter
    stat_damage?: GetWeaponStatFilter
    stat_damage_falloff?: GetWeaponStatFilter
    stat_damage_falloff_rate?: GetWeaponStatFilter
    stat_radius?: GetWeaponStatFilter
    stat_radius_damage_falloff?: GetWeaponStatFilter
    stat_rate_of_fire?: GetWeaponStatFilter
    stat_energy_cost?: GetWeaponStatFilter
    stat_projectile_speed?: GetWeaponStatFilter
    stat_spread?: GetWeaponStatFilter
}

interface GetWeaponStatFilter {
    min?: number
    max?: number
}

interface GetWeaponsResponse {
    weapons: Weapon[]
    total: number
}

export const WeaponsHangar = () => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [weapons, setWeapons] = useState<Weapon[]>([])

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Filters and sorts
    const [search, setSearch] = useState("")
    const [weaponTypes, setWeaponTypes] = useState<string[]>((query.get("weapon_types") || undefined)?.split("||") || [])
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>((query.get("equipped_status") || undefined)?.split("||") || [])
    const [ammoRange, setAmmoRange] = useState<number[]>([0, 10000])
    const [damageRange, setDamageRange] = useState<number[]>([0, 10000])
    const [damageFalloffRange, setDamageFalloffRange] = useState<number[]>([0, 10000])
    const [damageFalloffRateRange, setDamageFalloffRateRange] = useState<number[]>([0, 10000])
    const [radiusRange, setRadiusRange] = useState<number[]>([0, 10000])
    const [radiusDamageFalloffRange, setRadiusDamageFalloffRange] = useState<number[]>([0, 10000])
    const [rateOfFireRange, setRateOfFireRange] = useState<number[]>([0, 10000])
    const [energyCostRange, setEnergyCostRange] = useState<number[]>([0, 10000])
    const [projectileSpeedRange, setProjectileSpeedRange] = useState<number[]>([0, 10000])
    const [spreadRange, setSpreadRange] = useState<number[]>([0, 10000])
    const [isGridView, toggleIsGridView] = useToggle(false)

    const weaponTypeFilterSection = useRef<ChipFilter>({
        label: "WEAPON TYPE",
        options: [
            { value: WeaponType.Cannon, label: WeaponType.Cannon, color: getWeaponTypeColor(WeaponType.Cannon) },
            { value: WeaponType.Sword, label: WeaponType.Sword, color: getWeaponTypeColor(WeaponType.Sword) },
            { value: WeaponType.Minigun, label: WeaponType.Minigun, color: getWeaponTypeColor(WeaponType.Minigun) },
            { value: WeaponType.MissileLauncher, label: WeaponType.MissileLauncher, color: getWeaponTypeColor(WeaponType.MissileLauncher) },
            { value: WeaponType.PlasmaGun, label: WeaponType.PlasmaGun, color: getWeaponTypeColor(WeaponType.PlasmaGun) },
            { value: WeaponType.SniperRifle, label: WeaponType.SniperRifle, color: getWeaponTypeColor(WeaponType.SniperRifle) },
        ],
        initialSelected: weaponTypes,
        onSetSelected: (value: string[]) => {
            setWeaponTypes(value)
            changePage(1)
        },
    })

    const weaponEquippedFilterSection = useRef<ChipFilter>({
        label: "EQUIPPED STATUS",
        options: [
            { value: "equipped", label: "EQUIPPED", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
            { value: "unequipped", label: "UNEQUIPPED", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
        ],
        initialSelected: equippedStatuses,
        onSetSelected: (value: string[]) => {
            setEquippedStatuses(value)
            changePage(1)
        },
    })

    const ammoRangeFilter = useRef<SliderRangeFilter>({
        label: "AMMO",
        initialValue: ammoRange,
        onSetValue: (value: number[]) => {
            setAmmoRange(value)
            changePage(1)
        },
    })

    const damageRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE",
        initialValue: damageRange,
        onSetValue: (value: number[]) => {
            setDamageRange(value)
            changePage(1)
        },
    })

    const damageFalloffRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE FALLOFF",
        initialValue: damageFalloffRange,
        onSetValue: (value: number[]) => {
            setDamageFalloffRange(value)
            changePage(1)
        },
    })

    const damageFalloffRateRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE FALLOFF RATE",
        initialValue: damageFalloffRateRange,
        onSetValue: (value: number[]) => {
            setDamageFalloffRateRange(value)
            changePage(1)
        },
    })

    const radiusRangeFilter = useRef<SliderRangeFilter>({
        label: "RADIUS",
        initialValue: radiusRange,
        onSetValue: (value: number[]) => {
            setRadiusRange(value)
            changePage(1)
        },
    })

    const radiusDamageFalloffRangeFilter = useRef<SliderRangeFilter>({
        label: "RADIUS DAMAGE FALLOFF",
        initialValue: radiusDamageFalloffRange,
        onSetValue: (value: number[]) => {
            setRadiusDamageFalloffRange(value)
            changePage(1)
        },
    })

    const rateOfFireRangeFilter = useRef<SliderRangeFilter>({
        label: "RATE OF FIRE",
        initialValue: rateOfFireRange,
        onSetValue: (value: number[]) => {
            setRateOfFireRange(value)
            changePage(1)
        },
    })

    const energyCostRangeFilter = useRef<SliderRangeFilter>({
        label: "ENERGY COST",
        initialValue: energyCostRange,
        onSetValue: (value: number[]) => {
            setEnergyCostRange(value)
            changePage(1)
        },
    })

    const projectileSpeedRangeFilter = useRef<SliderRangeFilter>({
        label: "PROJECTIVE SPEED",
        initialValue: projectileSpeedRange,
        onSetValue: (value: number[]) => {
            setProjectileSpeedRange(value)
            changePage(1)
        },
    })

    const spreadRangeFilter = useRef<SliderRangeFilter>({
        label: "SPREAD",
        initialValue: spreadRange,
        onSetValue: (value: number[]) => {
            setSpreadRange(value)
            changePage(1)
        },
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<GetWeaponsResponse, GetWeaponsRequest>(GameServerKeys.GetWeapons, {
                page,
                page_size: pageSize,
                include_market_listed: true,
                weapon_types: weaponTypes,
                equipped_statuses: equippedStatuses,
                search,
                stat_ammo:
                    ammoRange[0] > 0 || ammoRange[1] > 0
                        ? {
                              min: ammoRange[0],
                              max: ammoRange[1],
                          }
                        : undefined,
                stat_damage:
                    damageRange[0] > 0 || damageRange[1] > 0
                        ? {
                              min: damageRange[0],
                              max: damageRange[1],
                          }
                        : undefined,
                stat_damage_falloff:
                    damageFalloffRange[0] > 0 || damageFalloffRange[1] > 0
                        ? {
                              min: damageFalloffRange[0],
                              max: damageFalloffRange[1],
                          }
                        : undefined,
                stat_damage_falloff_rate:
                    damageFalloffRateRange[0] > 0 || damageFalloffRateRange[1] > 0
                        ? {
                              min: damageFalloffRateRange[0],
                              max: damageFalloffRateRange[1],
                          }
                        : undefined,
                stat_radius:
                    radiusRange[0] > 0 || radiusRange[1] > 0
                        ? {
                              min: radiusRange[0],
                              max: radiusRange[1],
                          }
                        : undefined,
                stat_radius_damage_falloff:
                    radiusDamageFalloffRange[0] > 0 || radiusDamageFalloffRange[1] > 0
                        ? {
                              min: radiusDamageFalloffRange[0],
                              max: radiusDamageFalloffRange[1],
                          }
                        : undefined,
                stat_rate_of_fire:
                    rateOfFireRange[0] > 0 || rateOfFireRange[1] > 0
                        ? {
                              min: rateOfFireRange[0],
                              max: rateOfFireRange[1],
                          }
                        : undefined,
                stat_energy_cost:
                    energyCostRange[0] > 0 || energyCostRange[1] > 0
                        ? {
                              min: energyCostRange[0],
                              max: energyCostRange[1],
                          }
                        : undefined,
                stat_projectile_speed:
                    projectileSpeedRange[0] > 0 || projectileSpeedRange[1] > 0
                        ? {
                              min: projectileSpeedRange[0],
                              max: projectileSpeedRange[1],
                          }
                        : undefined,
                stat_spread:
                    spreadRange[0] > 0 || spreadRange[1] > 0
                        ? {
                              min: spreadRange[0],
                              max: spreadRange[1],
                          }
                        : undefined,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
                weapon_types: weaponTypes.join("||"),
                equipped_statuses: equippedStatuses.join("||"),
                search,
            })

            if (!resp) return
            setLoadError(undefined)
            setWeapons(resp.weapons)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get weapons.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [
        send,
        page,
        pageSize,
        search,
        updateQuery,
        setTotalItems,
        weaponTypes,
        equippedStatuses,
        ammoRange,
        damageRange,
        damageFalloffRange,
        damageFalloffRateRange,
        radiusRange,
        radiusDamageFalloffRange,
        rateOfFireRange,
        energyCostRange,
        projectileSpeedRange,
        spreadRange,
    ])

    useEffect(() => {
        getItems()
    }, [getItems])

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!weapons || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (weapons && weapons.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(29rem, 1fr))" : "100%",
                            gap: "1.3rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {weapons.map((weapon) => (
                            <WeaponHangarItem key={`marketplace-${weapon.id}`} weapon={weapon} isGridView={isGridView} />
                        ))}
                    </Box>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
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
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"There are no weapons found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, weapons, isLoading, isGridView, theme.factionTheme.primary])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <SortAndFilters
                initialSearch={search}
                onSetSearch={setSearch}
                chipFilters={[weaponTypeFilterSection.current, weaponEquippedFilterSection.current]}
                sliderRangeFilters={[
                    ammoRangeFilter.current,
                    damageRangeFilter.current,
                    damageFalloffRangeFilter.current,
                    damageFalloffRateRangeFilter.current,
                    radiusRangeFilter.current,
                    radiusDamageFalloffRangeFilter.current,
                    rateOfFireRangeFilter.current,
                    energyCostRangeFilter.current,
                    projectileSpeedRangeFilter.current,
                    spreadRangeFilter.current,
                ]}
                changePage={changePage}
            />

            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", flex: 1 }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <Stack sx={{ flex: 1 }}>
                        <PageHeader title="weapons" description="Your weapons." imageUrl={WarMachineIconPNG} />

                        <TotalAndPageSizeOptions
                            countItems={weapons?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            changePageSize={changePageSize}
                            pageSizeOptions={[10, 20, 30]}
                            changePage={changePage}
                            manualRefresh={getItems}
                            isGridView={isGridView}
                            toggleIsGridView={toggleIsGridView}
                        />

                        <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                            <Box
                                sx={{
                                    ml: "1.9rem",
                                    mr: ".5rem",
                                    pr: "1.4rem",
                                    my: "1rem",
                                    flex: 1,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    direction: "ltr",

                                    "::-webkit-scrollbar": {
                                        width: ".4rem",
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                {content}
                            </Box>
                        </Stack>
                    </Stack>

                    {totalPages > 1 && (
                        <Box
                            sx={{
                                px: "1rem",
                                py: ".7rem",
                                borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <Pagination
                                size="medium"
                                count={totalPages}
                                page={page}
                                sx={{
                                    ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold },
                                    ".Mui-selected": {
                                        color: (theme) => theme.factionTheme.secondary,
                                        backgroundColor: `${theme.factionTheme.primary} !important`,
                                    },
                                }}
                                onChange={(e, p) => changePage(p)}
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </Stack>
            </ClipThing>
        </Stack>
    )
}
