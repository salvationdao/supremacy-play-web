import { Box, CircularProgress, Divider, IconButton, Modal, Pagination, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { FancyButton } from "../../../../.."
import { EmptyWarMachinesPNG, SvgClose, SvgView } from "../../../../../../assets"
import { useAuth } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { GetWeaponMaxStats } from "../../../../../../fetching"
import { getRarityDeets, getWeaponTypeColor } from "../../../../../../helpers"
import { usePagination, useToggle } from "../../../../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { Weapon, WeaponType } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { ClipThing } from "../../../../../Common/ClipThing"
import { PageHeader } from "../../../../../Common/PageHeader"
import { ChipFilter } from "../../../../../Common/SortAndFilters/ChipFilterSection"
import { SliderRangeFilter } from "../../../../../Common/SortAndFilters/SliderRangeFilterSection"
import { SortAndFilters } from "../../../../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../../../../Common/TotalAndPageSizeOptions"
import { GetWeaponsRequest, GetWeaponsResponse } from "../../../../WeaponsHangar/WeaponsHangar"
import { FeatherFade } from "../../MechViewer"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

type OnConfirmWeaponSelection = (selectedWeapon: Weapon, inheritSkin: boolean) => void

interface MechLoadoutWeaponModalProps {
    onClose: () => void
    onConfirm: OnConfirmWeaponSelection
    equipped: Weapon
    weaponsWithSkinInheritance: string[]
    weaponsAlreadyEquippedInOtherSlots: string[]
}

export const MechLoadoutWeaponModal = ({
    onClose,
    onConfirm,
    equipped,
    weaponsWithSkinInheritance,
    weaponsAlreadyEquippedInOtherSlots,
}: MechLoadoutWeaponModalProps) => {
    const { userID } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")

    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const { page, changePage, totalPages, changePageSize, pageSize, setTotalItems, totalItems } = usePagination({
        pageSize: 4,
        page: 1,
    })

    const [sort, setSort] = useState<string>(SortTypeLabel.Alphabetical)
    const [sortFilterReRender, toggleSortFilterReRender] = useToggle()

    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle()
    const filtersContainerEl = useRef<HTMLElement>()
    const [search, setSearch] = useState("")
    const [weaponTypes, setWeaponTypes] = useState<string[]>([])
    const [rarities, setRarities] = useState<string[]>([])
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>(["unequipped"])
    const [ammoRange, setAmmoRange] = useState<number[] | undefined>()
    const [damageRange, setDamageRange] = useState<number[] | undefined>()
    const [damageFalloffRange, setDamageFalloffRange] = useState<number[] | undefined>()
    const [damageFalloffRateRange, setDamageFalloffRateRange] = useState<number[] | undefined>()
    const [radiusRange, setRadiusRange] = useState<number[] | undefined>()
    const [radiusDamageFalloffRange, setRadiusDamageFalloffRange] = useState<number[] | undefined>()
    const [rateOfFireRange, setRateOfFireRange] = useState<number[] | undefined>()
    const [energyCostRange, setEnergyCostRange] = useState<number[] | undefined>()
    const [projectileSpeedRange, setProjectileSpeedRange] = useState<number[] | undefined>()
    const [spreadRange, setSpreadRange] = useState<number[] | undefined>()

    const weaponTypeFilterSection = useRef<ChipFilter>({
        label: "WEAPON TYPE",
        options: [
            { value: WeaponType.Cannon, label: WeaponType.Cannon, color: getWeaponTypeColor(WeaponType.Cannon) },
            { value: WeaponType.GrenadeLauncher, label: WeaponType.GrenadeLauncher, color: getWeaponTypeColor(WeaponType.GrenadeLauncher) },
            { value: WeaponType.MachineGun, label: WeaponType.MachineGun, color: getWeaponTypeColor(WeaponType.MachineGun) },
            { value: WeaponType.Flak, label: WeaponType.Flak, color: getWeaponTypeColor(WeaponType.Flak) },
            { value: WeaponType.Sword, label: WeaponType.Sword, color: getWeaponTypeColor(WeaponType.Sword) },
            { value: WeaponType.Minigun, label: WeaponType.Minigun, color: getWeaponTypeColor(WeaponType.Minigun) },
            { value: WeaponType.MissileLauncher, label: WeaponType.MissileLauncher, color: getWeaponTypeColor(WeaponType.MissileLauncher) },
            { value: WeaponType.PlasmaGun, label: WeaponType.PlasmaGun, color: getWeaponTypeColor(WeaponType.PlasmaGun) },
            { value: WeaponType.SniperRifle, label: WeaponType.SniperRifle, color: getWeaponTypeColor(WeaponType.SniperRifle) },
            { value: WeaponType.Flamethrower, label: WeaponType.Flamethrower, color: getWeaponTypeColor(WeaponType.Flamethrower) },
            { value: WeaponType.LaserBeam, label: WeaponType.LaserBeam, color: getWeaponTypeColor(WeaponType.LaserBeam) },
            { value: WeaponType.LightningGun, label: WeaponType.LightningGun, color: getWeaponTypeColor(WeaponType.LightningGun) },
            { value: WeaponType.BFG, label: WeaponType.BFG, color: getWeaponTypeColor(WeaponType.BFG) },
            { value: WeaponType.Rifle, label: WeaponType.Rifle, color: getWeaponTypeColor(WeaponType.Rifle) },
        ],
        initialSelected: weaponTypes,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setWeaponTypes(value)
            changePage(1)
        },
    })

    const rarityChipFilter = useRef<ChipFilter>({
        label: "RARITY",
        options: [
            { value: "MEGA", ...getRarityDeets("MEGA") },
            { value: "COLOSSAL", ...getRarityDeets("COLOSSAL") },
            { value: "RARE", ...getRarityDeets("RARE") },
            { value: "LEGENDARY", ...getRarityDeets("LEGENDARY") },
            { value: "ELITE_LEGENDARY", ...getRarityDeets("ELITE_LEGENDARY") },
            { value: "ULTRA_RARE", ...getRarityDeets("ULTRA_RARE") },
            { value: "EXOTIC", ...getRarityDeets("EXOTIC") },
            { value: "GUARDIAN", ...getRarityDeets("GUARDIAN") },
            { value: "MYTHIC", ...getRarityDeets("MYTHIC") },
            { value: "DEUS_EX", ...getRarityDeets("DEUS_EX") },
            { value: "TITAN", ...getRarityDeets("TITAN") },
        ],
        initialSelected: rarities,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setRarities(value)
            changePage(1)
        },
    })

    const weaponEquippedFilterSection = useRef<ChipFilter>({
        label: "EQUIPPED STATUS",
        options: [
            { value: "equipped", label: "EQUIPPED", color: colors.green, textColor: "#FFFFFF" },
            { value: "unequipped", label: "UNEQUIPPED", color: colors.yellow, textColor: "#000000" },
        ],
        initialExpanded: true,
        initialSelected: equippedStatuses,
        onSetSelected: (value: string[]) => {
            setEquippedStatuses(value)
            changePage(1)
        },
    })

    const ammoRangeFilter = useRef<SliderRangeFilter>({
        label: "AMMO",
        initialValue: ammoRange,
        minMax: [0, 3000],
        onSetValue: (value: number[] | undefined) => {
            setAmmoRange(value)
            changePage(1)
        },
    })

    const damageRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE",
        initialValue: damageRange,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setDamageRange(value)
            changePage(1)
        },
    })

    const damageFalloffRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE FALLOFF",
        initialValue: damageFalloffRange,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setDamageFalloffRange(value)
            changePage(1)
        },
    })

    const damageFalloffRateRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE FALLOFF RATE",
        initialValue: damageFalloffRateRange,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setDamageFalloffRateRange(value)
            changePage(1)
        },
    })

    const radiusRangeFilter = useRef<SliderRangeFilter>({
        label: "RADIUS",
        initialValue: radiusRange,
        minMax: [0, 2000],
        onSetValue: (value: number[] | undefined) => {
            setRadiusRange(value)
            changePage(1)
        },
    })

    const radiusDamageFalloffRangeFilter = useRef<SliderRangeFilter>({
        label: "RADIUS DAMAGE FALLOFF",
        initialValue: radiusDamageFalloffRange,
        minMax: [0, 2000],
        onSetValue: (value: number[] | undefined) => {
            setRadiusDamageFalloffRange(value)
            changePage(1)
        },
    })

    const rateOfFireRangeFilter = useRef<SliderRangeFilter>({
        label: "RATE OF FIRE",
        initialValue: rateOfFireRange,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setRateOfFireRange(value)
            changePage(1)
        },
    })

    const energyCostRangeFilter = useRef<SliderRangeFilter>({
        label: "ENERGY COST",
        initialValue: energyCostRange,
        minMax: [0, 100],
        onSetValue: (value: number[] | undefined) => {
            setEnergyCostRange(value)
            changePage(1)
        },
    })

    const projectileSpeedRangeFilter = useRef<SliderRangeFilter>({
        label: "PROJECTIVE SPEED",
        initialValue: projectileSpeedRange,
        minMax: [0, 200000],
        onSetValue: (value: number[] | undefined) => {
            setProjectileSpeedRange(value)
            changePage(1)
        },
    })

    const spreadRangeFilter = useRef<SliderRangeFilter>({
        label: "SPREAD",
        initialValue: spreadRange,
        minMax: [0, 100],
        onSetValue: (value: number[] | undefined) => {
            setSpreadRange(value)
            changePage(1)
        },
    })

    const getWeapons = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            let sortBy = ""
            if (sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.RarestDesc) sortDir = "desc"

            switch (sort) {
                case SortTypeLabel.Alphabetical:
                case SortTypeLabel.AlphabeticalReverse:
                    sortBy = "alphabetical"
                    break
                case SortTypeLabel.RarestAsc:
                case SortTypeLabel.RarestDesc:
                    sortBy = "rarity"
            }

            const resp = await send<GetWeaponsResponse, GetWeaponsRequest>(GameServerKeys.GetWeapons, {
                page,
                page_size: pageSize,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,
                exclude_ids: weaponsAlreadyEquippedInOtherSlots,
                weapon_types: weaponTypes,
                rarities,
                equipped_statuses: equippedStatuses,
                search,
                stat_ammo:
                    ammoRange && (ammoRange[0] > 0 || ammoRange[1] > 0)
                        ? {
                              min: ammoRange[0],
                              max: ammoRange[1],
                          }
                        : undefined,
                stat_damage:
                    damageRange && (damageRange[0] > 0 || damageRange[1] > 0)
                        ? {
                              min: damageRange[0],
                              max: damageRange[1],
                          }
                        : undefined,
                stat_damage_falloff:
                    damageFalloffRange && (damageFalloffRange[0] > 0 || damageFalloffRange[1] > 0)
                        ? {
                              min: damageFalloffRange[0],
                              max: damageFalloffRange[1],
                          }
                        : undefined,
                stat_damage_falloff_rate:
                    damageFalloffRateRange && (damageFalloffRateRange[0] > 0 || damageFalloffRateRange[1] > 0)
                        ? {
                              min: damageFalloffRateRange[0],
                              max: damageFalloffRateRange[1],
                          }
                        : undefined,
                stat_radius:
                    radiusRange && (radiusRange[0] > 0 || radiusRange[1] > 0)
                        ? {
                              min: radiusRange[0],
                              max: radiusRange[1],
                          }
                        : undefined,
                stat_radius_damage_falloff:
                    radiusDamageFalloffRange && (radiusDamageFalloffRange[0] > 0 || radiusDamageFalloffRange[1] > 0)
                        ? {
                              min: radiusDamageFalloffRange[0],
                              max: radiusDamageFalloffRange[1],
                          }
                        : undefined,
                stat_rate_of_fire:
                    rateOfFireRange && (rateOfFireRange[0] > 0 || rateOfFireRange[1] > 0)
                        ? {
                              min: rateOfFireRange[0],
                              max: rateOfFireRange[1],
                          }
                        : undefined,
                stat_energy_cost:
                    energyCostRange && (energyCostRange[0] > 0 || energyCostRange[1] > 0)
                        ? {
                              min: energyCostRange[0],
                              max: energyCostRange[1],
                          }
                        : undefined,
                stat_projectile_speed:
                    projectileSpeedRange && (projectileSpeedRange[0] > 0 || projectileSpeedRange[1] > 0)
                        ? {
                              min: projectileSpeedRange[0],
                              max: projectileSpeedRange[1],
                          }
                        : undefined,
                stat_spread:
                    spreadRange && (spreadRange[0] > 0 || spreadRange[1] > 0)
                        ? {
                              min: spreadRange[0],
                              max: spreadRange[1],
                          }
                        : undefined,
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
        ammoRange,
        damageFalloffRange,
        damageFalloffRateRange,
        damageRange,
        energyCostRange,
        equippedStatuses,
        page,
        pageSize,
        projectileSpeedRange,
        radiusDamageFalloffRange,
        radiusRange,
        rarities,
        rateOfFireRange,
        search,
        send,
        setTotalItems,
        sort,
        spreadRange,
        weaponTypes,
        weaponsAlreadyEquippedInOtherSlots,
    ])

    useEffect(() => {
        getWeapons()
    }, [getWeapons])

    // Get the max for each category for better filtering
    const { query: queryGetWeaponMaxStats } = useParameterizedQuery(GetWeaponMaxStats)
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryGetWeaponMaxStats(userID)
                if (resp.error || !resp.payload) return
                ammoRangeFilter.current.minMax[1] = resp.payload.max_ammo || 0
                damageRangeFilter.current.minMax[1] = resp.payload.damage || 0
                damageFalloffRangeFilter.current.minMax[1] = resp.payload.damage_falloff || 0
                damageFalloffRateRangeFilter.current.minMax[1] = resp.payload.damage_falloff_rate || 0
                radiusRangeFilter.current.minMax[1] = resp.payload.radius || 0
                radiusDamageFalloffRangeFilter.current.minMax[1] = resp.payload.radius_damage_falloff || 0
                rateOfFireRangeFilter.current.minMax[1] = resp.payload.rate_of_fire || 0
                energyCostRangeFilter.current.minMax[1] = resp.payload.energy_cost || 0
                projectileSpeedRangeFilter.current.minMax[1] = resp.payload.projectile_speed || 0
                spreadRangeFilter.current.minMax[1] = resp.payload.spread || 0
                toggleSortFilterReRender()
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get the list of streams."
                console.error(message)
            }
        })()
    }, [queryGetWeaponMaxStats, toggleSortFilterReRender, userID])

    const weaponList = useMemo(() => {
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
                <Box
                    sx={{
                        display: "grid",
                        gap: "1rem",
                    }}
                >
                    {weapons.map((p) => (
                        <WeaponItem key={p.id} id={p.id} onSelect={(w) => setSelectedWeapon(w)} equipped={equipped} selected={selectedWeapon?.id === p.id} />
                    ))}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
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
                            textAlign: "center",
                        }}
                    >
                        {"There are no weapons found, please try again."}
                    </Typography>

                    <FancyButton
                        to={`/marketplace/weapons${location.hash}`}
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.primary,
                            border: { isFancy: true, borderColor: theme.factionTheme.primary },
                            sx: { position: "relative", mt: "2rem" },
                        }}
                        sx={{ px: "1.8rem", py: ".8rem", color: theme.factionTheme.secondary }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.secondary,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO MARKETPLACE
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [equipped, isLoading, loadError, selectedWeapon?.id, theme.factionTheme.primary, theme.factionTheme.secondary, weapons])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100rem",
                    maxWidth: "90vw",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    ref={filtersContainerEl}
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{
                        position: "relative",
                        height: "55rem",
                        maxHeight: "90vh",
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            zIndex: 100,
                            position: "absolute",
                            top: ".5rem",
                            right: ".5rem",
                        }}
                    >
                        <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                    <Stack
                        direction="row"
                        sx={{
                            height: "100%",
                        }}
                    >
                        <SortAndFilters
                            key={sortFilterReRender.toString()}
                            initialSearch={search}
                            onSetSearch={setSearch}
                            chipFilters={[weaponTypeFilterSection.current, rarityChipFilter.current, weaponEquippedFilterSection.current]}
                            sliderRangeFilters={[
                                // ammoRangeFilter.current,
                                damageRangeFilter.current,
                                // damageFalloffRangeFilter.current,
                                // damageFalloffRateRangeFilter.current,
                                radiusRangeFilter.current,
                                // radiusDamageFalloffRangeFilter.current,
                                rateOfFireRangeFilter.current,
                                energyCostRangeFilter.current,
                                // projectileSpeedRangeFilter.current,
                                spreadRangeFilter.current,
                            ]}
                            changePage={changePage}
                            isExpanded={isFiltersExpanded}
                            width="25rem"
                            drawer={{
                                container: filtersContainerEl.current,
                                onClose: () => toggleIsFiltersExpanded(false),
                            }}
                        />
                        <Stack flex={1}>
                            <PageHeader title="Equip a weapon" description="Select a weapon to equip on your mech." />
                            <TotalAndPageSizeOptions
                                countItems={weapons?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                pageSizeOptions={[4, 8]}
                                changePage={changePage}
                                manualRefresh={getWeapons}
                                sortOptions={sortOptions}
                                selectedSort={sort}
                                onSetSort={setSort}
                                isFiltersExpanded={isFiltersExpanded}
                                toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                            />
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
                                {weaponList}
                            </Box>
                            {totalPages > 1 && (
                                <Box
                                    sx={{
                                        mt: "auto",
                                        px: "1rem",
                                        py: ".7rem",
                                        borderTop: `${primaryColor}70 1.5px solid`,
                                        borderBottom: `${primaryColor}70 1.5px solid`,
                                        backgroundColor: "#00000070",
                                    }}
                                >
                                    <Pagination
                                        size="small"
                                        count={totalPages}
                                        page={page}
                                        sx={{
                                            ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold, fontSize: "1.2rem" },
                                            ".Mui-selected": {
                                                color: secondaryColor,
                                                backgroundColor: `${primaryColor} !important`,
                                            },
                                        }}
                                        onChange={(e, p) => changePage(p)}
                                    />
                                </Box>
                            )}
                        </Stack>
                        <Stack
                            sx={{
                                overflow: "hidden",
                                flexBasis: "300px",
                                borderLeft: `${primaryColor}70 1.5px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <WeaponPreview
                                weapon={selectedWeapon}
                                equipped={equipped}
                                skinInheritable={selectedWeapon ? !!weaponsWithSkinInheritance.find((s) => s === selectedWeapon?.blueprint_id) : false}
                                onConfirm={onConfirm}
                            />
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}

interface WeaponItemProps {
    id: string
    equipped: Weapon
    selected: boolean
    onSelect: (w: Weapon) => void
}

const WeaponItem = ({ id, equipped, selected, onSelect }: WeaponItemProps) => {
    const theme = useTheme()

    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${id}/details`,
            key: GameServerKeys.GetWeaponDetails,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
        },
    )

    const renderStat = useCallback((label: string, stats: { oldStat?: number; newStat: number; negated?: boolean }) => {
        const positiveColor = stats.negated ? colors.red : colors.green
        const negativeColor = stats.negated ? colors.green : colors.red
        const difference = stats.newStat - (stats.oldStat || 0)
        const color = difference > 0 ? positiveColor : difference === 0 ? "white" : negativeColor
        const symbol = difference > 0 ? "+" : ""

        return (
            <Stack direction="row" spacing="1rem" alignItems="center">
                <Typography
                    variant="caption"
                    sx={{
                        color: colors.lightGrey,
                        fontSize: "1rem",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color,
                    }}
                >
                    {stats.newStat} {difference !== 0 && `(${symbol}${difference})`}
                </Typography>
            </Stack>
        )
    }, [])

    if (!weaponDetails) {
        return (
            <ClipThing
                border={{
                    borderColor: theme.factionTheme.primary,
                }}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Stack>
            </ClipThing>
        )
    }

    return (
        <FancyButton
            clipThingsProps={{
                border: {
                    borderColor: theme.factionTheme.primary,
                },
                backgroundColor: theme.factionTheme.background,
            }}
            sx={{
                position: "relative",
                padding: "1rem",
                backgroundColor: selected ? "#ffffff22" : "transparent",
            }}
            onClick={() => onSelect(weaponDetails)}
        >
            {weaponDetails.equipped_on && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "black",
                        opacity: 0.4,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        IN USE
                    </Typography>
                </Box>
            )}
            {selected && (
                <SvgView
                    size="3rem"
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        right: "2rem",
                        opacity: 0.5,
                    }}
                />
            )}
            <Stack direction="row" alignItems="stretch" padding="1rem">
                <Box sx={{ width: "10rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "9rem",
                            width: "100%",
                        }}
                    >
                        <Box
                            component="img"
                            src={weaponDetails.avatar_url || weaponDetails.image_url || weaponDetails.large_image_url}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {weaponDetails?.label}
                    </Typography>
                </Box>
                <Divider
                    orientation="vertical"
                    sx={{
                        alignSelf: "stretch",
                        height: "auto",
                        mx: "1rem",
                        borderColor: "#494949",
                    }}
                />
                <Stack>
                    {typeof weaponDetails.damage !== "undefined" &&
                        renderStat("DAMAGE", {
                            oldStat: equipped.damage,
                            newStat: weaponDetails.damage,
                        })}
                    {typeof weaponDetails.damage_falloff !== "undefined" &&
                        renderStat("DAMAGE FALLOFF", {
                            oldStat: equipped.damage_falloff,
                            newStat: weaponDetails.damage_falloff,
                        })}
                    {typeof weaponDetails.radius !== "undefined" &&
                        renderStat("RADIUS", {
                            oldStat: equipped.radius,
                            newStat: weaponDetails.radius,
                        })}
                    {typeof weaponDetails.radius_damage_falloff !== "undefined" &&
                        renderStat("RADIAL DAMAGE FALLOFF", {
                            oldStat: equipped.radius_damage_falloff,
                            newStat: weaponDetails.radius_damage_falloff,
                        })}
                    {typeof weaponDetails.spread !== "undefined" &&
                        renderStat("SPREAD", {
                            oldStat: equipped.spread,
                            newStat: weaponDetails.spread,
                            negated: true,
                        })}
                    {typeof weaponDetails.rate_of_fire !== "undefined" &&
                        renderStat("RATE OF FIRE", {
                            oldStat: equipped.rate_of_fire,
                            newStat: weaponDetails.rate_of_fire,
                        })}
                    {typeof weaponDetails.projectile_speed !== "undefined" &&
                        renderStat("PROJECTILE SPEED", {
                            oldStat: equipped.projectile_speed,
                            newStat: weaponDetails.projectile_speed,
                        })}
                    {typeof weaponDetails.energy_cost !== "undefined" &&
                        renderStat("ENERGY COST", {
                            oldStat: equipped.energy_cost,
                            newStat: weaponDetails.energy_cost,
                            negated: true,
                        })}
                    {typeof weaponDetails.max_ammo !== "undefined" &&
                        renderStat("MAX AMMO", {
                            oldStat: equipped.max_ammo,
                            newStat: weaponDetails.max_ammo,
                        })}
                </Stack>
            </Stack>
        </FancyButton>
    )
}

interface WeaponPreviewProps {
    onConfirm: OnConfirmWeaponSelection
    weapon?: Weapon
    equipped: Weapon
    skinInheritable: boolean
}

const WeaponPreview = ({ onConfirm, weapon, equipped, skinInheritable }: WeaponPreviewProps) => {
    const theme = useTheme()
    const [inheritSkin, setInheritSkin] = useState(false)

    const renderStatChange = useCallback((label: string, stats: { oldStat?: number; newStat: number; negated?: boolean }) => {
        const positiveColor = stats.negated ? colors.red : colors.green
        const negativeColor = stats.negated ? colors.green : colors.red
        const difference = stats.newStat - (stats.oldStat || 0)
        const color = difference > 0 ? positiveColor : difference === 0 ? "white" : negativeColor
        const symbol = difference > 0 ? "+" : ""

        if (difference === 0 || !stats.oldStat) return null

        const percentageDifference = Math.round((difference * 100 * 100) / stats.oldStat) / 100
        return (
            <Stack key={label} direction="row" spacing="1rem" alignItems="center">
                <Typography
                    variant="body2"
                    sx={{
                        color,
                    }}
                >
                    {symbol}
                    {percentageDifference}%
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "1rem",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {label}
                </Typography>
            </Stack>
        )
    }, [])

    const statChanges = useMemo(() => {
        if (!weapon) return []

        const stats = [
            typeof weapon.damage !== "undefined" &&
                renderStatChange("DAMAGE", {
                    oldStat: equipped.damage,
                    newStat: weapon.damage,
                }),
            typeof weapon.damage_falloff !== "undefined" &&
                renderStatChange("DAMAGE FALLOFF", {
                    oldStat: equipped.damage_falloff,
                    newStat: weapon.damage_falloff,
                }),
            typeof weapon.radius !== "undefined" &&
                renderStatChange("RADIUS", {
                    oldStat: equipped.radius,
                    newStat: weapon.radius,
                }),
            typeof weapon.radius_damage_falloff !== "undefined" &&
                renderStatChange("RADIAL DAMAGE FALLOFF", {
                    oldStat: equipped.radius_damage_falloff,
                    newStat: weapon.radius_damage_falloff,
                }),
            typeof weapon.spread !== "undefined" &&
                renderStatChange("SPREAD", {
                    oldStat: equipped.spread,
                    newStat: weapon.spread,
                    negated: true,
                }),
            typeof weapon.rate_of_fire !== "undefined" &&
                renderStatChange("RATE OF FIRE", {
                    oldStat: equipped.rate_of_fire,
                    newStat: weapon.rate_of_fire,
                }),
            typeof weapon.projectile_speed !== "undefined" &&
                renderStatChange("PROJECTILE SPEED", {
                    oldStat: equipped.projectile_speed,
                    newStat: weapon.projectile_speed,
                }),
            typeof weapon.energy_cost !== "undefined" &&
                renderStatChange("ENERGY COST", {
                    oldStat: equipped.energy_cost,
                    newStat: weapon.energy_cost,
                    negated: true,
                }),
            typeof weapon.max_ammo !== "undefined" &&
                renderStatChange("MAX AMMO", {
                    oldStat: equipped.max_ammo,
                    newStat: weapon.max_ammo,
                }),
        ]

        return stats.filter((s) => !!s)
    }, [
        equipped.damage,
        equipped.damage_falloff,
        equipped.energy_cost,
        equipped.max_ammo,
        equipped.projectile_speed,
        equipped.radius,
        equipped.radius_damage_falloff,
        equipped.rate_of_fire,
        equipped.spread,
        renderStatChange,
        weapon,
    ])

    if (weapon) {
        const skin = weapon.weapon_skin
        const videoUrls = [skin?.animation_url || weapon?.animation_url, skin?.card_animation_url || weapon?.card_animation_url]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl = skin?.avatar_url || weapon?.avatar_url || skin?.image_url || weapon?.image_url || skin?.large_image_url || weapon?.large_image_url

        return (
            <Stack p="1rem 2rem" height="100%">
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <FeatherFade color={theme.factionTheme.background} />
                    {(!videoUrlsFilters || videoUrlsFilters.length <= 0) && imageUrl ? (
                        <Box
                            component="img"
                            src={imageUrl}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                        />
                    ) : (
                        <Box
                            key={imageUrl}
                            component="video"
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                            disablePictureInPicture
                            disableRemotePlayback
                            loop
                            muted
                            autoPlay
                            controls={false}
                            poster={`${imageUrl}`}
                        >
                            {videoUrlsFilters.map((videoUrl, i) => videoUrl && <source key={videoUrl + i} src={videoUrl} type="video/mp4" />)}
                        </Box>
                    )}
                    <Box
                        sx={{
                            zIndex: 100,
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: getRarityDeets(weapon.tier).color,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {weapon.tier}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {weapon.label}
                        </Typography>
                    </Box>
                </Box>
                <Stack
                    sx={{
                        zIndex: 100,
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",
                        mt: "1rem",

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
                    {weapon.equipped_on && (
                        <Typography
                            sx={{
                                color: colors.red,
                            }}
                        >
                            Currently equipped on another mech.
                        </Typography>
                    )}
                    {statChanges.length > 0 ? (
                        <Stack>
                            <Typography
                                sx={{
                                    color: colors.lightGrey,
                                    textTransform: "uppercase",
                                }}
                            >
                                Stat Changes If Equipped:
                            </Typography>
                            {statChanges}
                        </Stack>
                    ) : (
                        <Typography
                            sx={{
                                color: colors.lightGrey,
                                textTransform: "uppercase",
                            }}
                        >
                            No Stat Changes If Equipped
                        </Typography>
                    )}
                </Stack>
                <Stack
                    direction="row"
                    spacing="1rem"
                    sx={{
                        zIndex: 100,
                        pt: "1rem",
                    }}
                >
                    <Box ml="auto" />
                    {skinInheritable && (
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Switch
                                size="small"
                                checked={inheritSkin}
                                onChange={(e, c) => setInheritSkin(c)}
                                sx={{
                                    transform: "scale(.7)",
                                    ".Mui-checked": { color: theme.factionTheme.primary },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${theme.factionTheme.primary}50` },
                                }}
                            />
                            <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                Inherit Skin
                            </Typography>
                        </Stack>
                    )}
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.green,
                        }}
                        onClick={() => onConfirm(weapon, inheritSkin)}
                    >
                        Equip To Mech
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                height: "100%",
            }}
        >
            <Typography
                sx={{
                    px: "1.28rem",
                    pt: "1.28rem",
                    color: colors.grey,
                    fontFamily: fonts.nostromoBold,
                    textAlign: "center",
                }}
            >
                Select a weapon to view its details.
            </Typography>
        </Stack>
    )
}
