import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getWeaponTypeColor, parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { WeaponType } from "../../../types"
import { MarketplaceBuyAuctionItem, MarketSaleType, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { RangeFilter } from "../../Common/SortAndFilters/RangeFilterSection"
import { SliderRangeFilter } from "../../Common/SortAndFilters/SliderRangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { WeaponsMarketItem } from "./WeaponsMarketItem"

const sortOptions = [
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.EndTimeEndingSoon, value: SortTypeLabel.EndTimeEndingSoon },
    { label: SortTypeLabel.EndTimeEndingLast, value: SortTypeLabel.EndTimeEndingLast },
    { label: SortTypeLabel.PriceLowest, value: SortTypeLabel.PriceLowest },
    { label: SortTypeLabel.PriceHighest, value: SortTypeLabel.PriceHighest },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
]

export const WeaponsMarket = () => {
    const location = useLocation()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechItems, setMechItems] = useState<MarketplaceBuyAuctionItem[]>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })
    const [isGridView, toggleIsGridView] = useToggle(false)

    // Filters and sorts
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.CreateTimeNewestFirst)
    const [status, setStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [ownedBy, setOwnedBy] = useState<string[]>((query.get("ownedBy") || undefined)?.split("||") || [])
    const [listingTypes, setListingTypes] = useState<string[]>((query.get("listingTypes") || undefined)?.split("||") || [])
    const [weaponTypes, setWeaponTypes] = useState<string[]>((query.get("weaponTypes") || undefined)?.split("||") || [])
    const [price, setPrice] = useState<(number | undefined)[]>(
        (query.get("priceRanges") || undefined)?.split("||").map((p) => (p ? parseInt(p) : undefined)) || [undefined, undefined],
    )
    const [ammoRange, setAmmoRange] = useState<number[]>(
        (query.get("ammo") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 3000)) || [0, 3000],
    )
    const [damageRange, setDamageRange] = useState<number[]>(
        (query.get("damage") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 1000)) || [0, 1000],
    )
    const [damageFalloffRange, setDamageFalloffRange] = useState<number[]>(
        (query.get("damageFalloff") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 1000)) || [0, 1000],
    )
    const [damageFalloffRateRange, setDamageFalloffRateRange] = useState<number[]>(
        (query.get("damageFalloffRate") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 1000)) || [0, 1000],
    )
    const [radiusRange, setRadiusRange] = useState<number[]>(
        (query.get("radius") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 2000)) || [0, 2000],
    )
    const [radiusDamageFalloffRange, setRadiusDamageFalloffRange] = useState<number[]>(
        (query.get("radiusDamageFalloff") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 2000)) || [0, 2000],
    )
    const [rateOfFireRange, setRateOfFireRange] = useState<number[]>(
        (query.get("rateOfFire") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 1000)) || [0, 1000],
    )
    const [energyCostRange, setEnergyCostRange] = useState<number[]>(
        (query.get("energyCost") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 100)) || [0, 100],
    )
    const [projectileSpeedRange, setProjectileSpeedRange] = useState<number[]>(
        (query.get("projectileSpeed") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 200000)) || [0, 200000],
    )
    const [spreadRange, setSpreadRange] = useState<number[]>(
        (query.get("spread") || undefined)?.split("||").map((p, i) => (p ? parseInt(p) : i === 0 ? 0 : 100)) || [0, 100],
    )

    // Filters
    const statusFilterSection = useRef<ChipFilter>({
        label: "STATUS",
        options: [{ value: "true", label: "SOLD", color: colors.marketSold }],
        initialSelected: status,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setStatus(value)
            changePage(1)
        },
    })

    const ownedByFilterSection = useRef<ChipFilter>({
        label: "OWNED BY",
        options: [
            { value: "self", label: "YOU", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
            { value: "others", label: "OTHERS", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
        ],
        initialSelected: ownedBy,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setOwnedBy(value)
            changePage(1)
        },
    })

    const listingTypeFilterSection = useRef<ChipFilter>({
        label: "LISTING TYPE",
        options: [
            { value: MarketSaleType.Buyout, label: "BUY NOW", color: colors.buyout },
            { value: MarketSaleType.DutchAuction, label: "DUTCH AUCTION", color: colors.dutchAuction },
            { value: MarketSaleType.Auction, label: "AUCTION", color: colors.auction },
        ],
        initialSelected: listingTypes,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setListingTypes(value)
            changePage(1)
        },
    })

    const weaponTypeChipFilter = useRef<ChipFilter>({
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
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setWeaponTypes(value)
            changePage(1)
        },
    })

    const priceRangeFilter = useRef<RangeFilter>({
        label: "PRICE RANGE",
        initialValue: price,
        initialExpanded: true,
        onSetValue: (value: (number | undefined)[]) => {
            setPrice(value)
            changePage(1)
        },
    })

    const ammoRangeFilter = useRef<SliderRangeFilter>({
        label: "AMMO",
        initialValue: ammoRange,
        minMax: [0, 3000],
        onSetValue: (value: number[]) => {
            setAmmoRange(value)
            changePage(1)
        },
    })

    const damageRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE",
        initialValue: damageRange,
        minMax: [0, 1000],
        onSetValue: (value: number[]) => {
            setDamageRange(value)
            changePage(1)
        },
    })

    const damageFalloffRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE FALLOFF",
        initialValue: damageFalloffRange,
        minMax: [0, 1000],
        onSetValue: (value: number[]) => {
            setDamageFalloffRange(value)
            changePage(1)
        },
    })

    const damageFalloffRateRangeFilter = useRef<SliderRangeFilter>({
        label: "DAMAGE FALLOFF RATE",
        initialValue: damageFalloffRateRange,
        minMax: [0, 1000],
        onSetValue: (value: number[]) => {
            setDamageFalloffRateRange(value)
            changePage(1)
        },
    })

    const radiusRangeFilter = useRef<SliderRangeFilter>({
        label: "RADIUS",
        initialValue: radiusRange,
        minMax: [0, 2000],
        onSetValue: (value: number[]) => {
            setRadiusRange(value)
            changePage(1)
        },
    })

    const radiusDamageFalloffRangeFilter = useRef<SliderRangeFilter>({
        label: "RADIUS DAMAGE FALLOFF",
        initialValue: radiusDamageFalloffRange,
        minMax: [0, 2000],
        onSetValue: (value: number[]) => {
            setRadiusDamageFalloffRange(value)
            changePage(1)
        },
    })

    const rateOfFireRangeFilter = useRef<SliderRangeFilter>({
        label: "RATE OF FIRE",
        initialValue: rateOfFireRange,
        minMax: [0, 1000],
        onSetValue: (value: number[]) => {
            setRateOfFireRange(value)
            changePage(1)
        },
    })

    const energyCostRangeFilter = useRef<SliderRangeFilter>({
        label: "ENERGY COST",
        initialValue: energyCostRange,
        minMax: [0, 100],
        onSetValue: (value: number[]) => {
            setEnergyCostRange(value)
            changePage(1)
        },
    })

    const projectileSpeedRangeFilter = useRef<SliderRangeFilter>({
        label: "PROJECTIVE SPEED",
        initialValue: projectileSpeedRange,
        minMax: [0, 200000],
        onSetValue: (value: number[]) => {
            setProjectileSpeedRange(value)
            changePage(1)
        },
    })

    const spreadRangeFilter = useRef<SliderRangeFilter>({
        label: "SPREAD",
        initialValue: spreadRange,
        minMax: [0, 100],
        onSetValue: (value: number[]) => {
            setSpreadRange(value)
            changePage(1)
        },
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            let sortBy = "alphabetical"
            if (
                sort === SortTypeLabel.AlphabeticalReverse ||
                sort === SortTypeLabel.CreateTimeNewestFirst ||
                sort === SortTypeLabel.EndTimeEndingLast ||
                sort === SortTypeLabel.PriceHighest
            )
                sortDir = "desc"
            if (sort === SortTypeLabel.CreateTimeOldestFirst || sort === SortTypeLabel.CreateTimeNewestFirst) sortBy = "created_at"
            if (sort === SortTypeLabel.EndTimeEndingSoon || sort === SortTypeLabel.EndTimeEndingLast) sortBy = "time"
            if (sort === SortTypeLabel.PriceLowest || sort === SortTypeLabel.PriceHighest) sortBy = "price"

            const [min_price, max_price] = price

            const resp = await send<{ total: number; records: MarketplaceBuyAuctionItem[] }>(GameServerKeys.MarketplaceSalesList, {
                page: page - 1,
                page_size: pageSize,
                search,
                listing_types: listingTypes,
                weapon_types: weaponTypes,
                item_type: "weapon",
                min_price,
                max_price,
                sort_dir: sortDir,
                sort_by: sortBy,
                owned_by: ownedBy,
                sold: status.length > 0,
                weapon_stats: {
                    ammo:
                        ammoRange[0] > 0 || ammoRange[1] > 0
                            ? {
                                  min: ammoRange[0],
                                  max: ammoRange[1],
                              }
                            : undefined,
                    damage:
                        damageRange[0] > 0 || damageRange[1] > 0
                            ? {
                                  min: damageRange[0],
                                  max: damageRange[1],
                              }
                            : undefined,
                    damage_falloff:
                        damageFalloffRange[0] > 0 || damageFalloffRange[1] > 0
                            ? {
                                  min: damageFalloffRange[0],
                                  max: damageFalloffRange[1],
                              }
                            : undefined,
                    damage_falloff_rate:
                        damageFalloffRateRange[0] > 0 || damageFalloffRateRange[1] > 0
                            ? {
                                  min: damageFalloffRateRange[0],
                                  max: damageFalloffRateRange[1],
                              }
                            : undefined,
                    radius:
                        radiusRange[0] > 0 || radiusRange[1] > 0
                            ? {
                                  min: radiusRange[0],
                                  max: radiusRange[1],
                              }
                            : undefined,
                    radius_damage_falloff:
                        radiusDamageFalloffRange[0] > 0 || radiusDamageFalloffRange[1] > 0
                            ? {
                                  min: radiusDamageFalloffRange[0],
                                  max: radiusDamageFalloffRange[1],
                              }
                            : undefined,
                    rate_of_fire:
                        rateOfFireRange[0] > 0 || rateOfFireRange[1] > 0
                            ? {
                                  min: rateOfFireRange[0],
                                  max: rateOfFireRange[1],
                              }
                            : undefined,
                    energy_cost:
                        energyCostRange[0] > 0 || energyCostRange[1] > 0
                            ? {
                                  min: energyCostRange[0],
                                  max: energyCostRange[1],
                              }
                            : undefined,
                    projectile_speed:
                        projectileSpeedRange[0] > 0 || projectileSpeedRange[1] > 0
                            ? {
                                  min: projectileSpeedRange[0],
                                  max: projectileSpeedRange[1],
                              }
                            : undefined,
                    spread:
                        spreadRange[0] > 0 || spreadRange[1] > 0
                            ? {
                                  min: spreadRange[0],
                                  max: spreadRange[1],
                              }
                            : undefined,
                },
            })

            updateQuery({
                sort,
                page: page.toString(),
                pageSize: pageSize.toString(),
                statuses: status.join("||"),
                ownedBy: ownedBy.join("||"),
                listingTypes: listingTypes.join("||"),
                priceRanges: price.join("||"),
                ammo: ammoRange.join("||"),
                damage: damageRange.join("||"),
                damageFalloff: damageFalloffRange.join("||"),
                damageFalloffRate: damageFalloffRateRange.join("||"),
                radius: radiusRange.join("||"),
                radiusDamageFalloff: radiusDamageFalloffRange.join("||"),
                rateOfFire: rateOfFireRange.join("||"),
                energyCost: energyCostRange.join("||"),
                projectileSpeed: projectileSpeedRange.join("||"),
                spread: spreadRange.join("||"),
            })

            if (!resp) return
            setTotalItems(resp.total)
            setMechItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get mech listings."
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [
        sort,
        price,
        updateQuery,
        page,
        pageSize,
        status,
        ownedBy,
        listingTypes,
        weaponTypes,
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
        send,
        search,
        setTotalItems,
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

        if (!mechItems || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (mechItems && mechItems.length > 0) {
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
                        {mechItems.map((item) => (
                            <WeaponsMarketItem key={`marketplace-${item.id}`} item={item} isGridView={isGridView} />
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
    }, [loadError, mechItems, isLoading, theme.factionTheme.primary, isGridView])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <SortAndFilters
                initialSearch={search}
                onSetSearch={setSearch}
                chipFilters={[statusFilterSection.current, ownedByFilterSection.current, listingTypeFilterSection.current, weaponTypeChipFilter.current]}
                rangeFilters={[priceRangeFilter.current]}
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
                        <PageHeader title="WEAPONS" description="Explore what other citizens have to offer." imageUrl={WarMachineIconPNG}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.red,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.red, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: ".4rem", color: "#FFFFFF" }}
                                to={`/marketplace/sell${location.hash}`}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#FFFFFF",
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    SELL ITEM
                                </Typography>
                            </FancyButton>
                        </PageHeader>

                        <TotalAndPageSizeOptions
                            countItems={mechItems?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            changePageSize={changePageSize}
                            pageSizeOptions={[10, 20, 40]}
                            changePage={changePage}
                            isGridView={isGridView}
                            toggleIsGridView={toggleIsGridView}
                            manualRefresh={getItems}
                            sortOptions={sortOptions}
                            selectedSort={sort}
                            onSetSort={setSort}
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
