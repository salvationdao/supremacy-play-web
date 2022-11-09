import { Box, CircularProgress, Divider, Drawer, IconButton, Pagination, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { FancyButton } from "../../../../.."
import { EmptyWarMachinesPNG, SvgArrowRightAltSharpIcon, SvgClose } from "../../../../../../assets"
import { useAuth } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { GetPowerCoreMaxStats } from "../../../../../../fetching"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination, useToggle } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { PlayerAsset, PowerCore } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { PageHeader } from "../../../../../Common/Deprecated/PageHeader"
import { ChipFilter } from "../../../../../Common/SortAndFilters/ChipFilterSection"
import { SliderRangeFilter } from "../../../../../Common/SortAndFilters/SliderRangeFilterSection"
import { SortAndFilters } from "../../../../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../../../../Common/Deprecated/TotalAndPageSizeOptions"
import { PowerCoreItem } from "./PowerCore/PowerCoreItem"
import { PowerCorePreview } from "./PowerCore/PowerCorePreview"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]
interface GetPowerCoresRequest {
    search: string
    sort_by: string
    sort_dir: string
    exclude_ids: string[]
    page_size: number
    page: number
    display_xsyn_locked?: boolean
    exclude_market_locked?: boolean
    include_market_listed?: boolean
    rarities: string[]
    sizes: string[]
    equipped_statuses: string[]
    stat_capacity?: GetPowerCoreStatFilter
    stat_max_draw_rate?: GetPowerCoreStatFilter
    stat_recharge_rate?: GetPowerCoreStatFilter
    stat_armour?: GetPowerCoreStatFilter
    stat_max_hitpoints?: GetPowerCoreStatFilter
}

interface GetPowerCoreStatFilter {
    min?: number
    max?: number
}

interface GetPowerCoresResponse {
    power_cores: PlayerAsset[]
    total: number
}

export type OnConfirmPowerCoreSelection = (selectedPowerCore: PowerCore) => void

interface MechLoadoutPowerCoreModalProps {
    containerRef: React.MutableRefObject<HTMLElement | undefined>
    onClose: () => void
    onConfirm: OnConfirmPowerCoreSelection
    equipped?: PowerCore
    powerCoresAlreadyEquippedInOtherSlots: string[]
    powerCoreSize: string
}

export const MechLoadoutPowerCoreModal = ({
    containerRef,
    onClose,
    onConfirm,
    equipped,
    powerCoresAlreadyEquippedInOtherSlots,
    powerCoreSize,
}: MechLoadoutPowerCoreModalProps) => {
    const { userID } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")

    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    const [powerCores, setPowerCores] = useState<PlayerAsset[]>([])
    const [selectedPowerCore, setSelectedPowerCore] = useState<PowerCore>()
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
    const [rarities, setRarities] = useState<string[]>([])
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>(["unequipped"])
    const [capacity, setCapacity] = useState<number[] | undefined>()
    const [maxDrawRate, setMaxDrawRate] = useState<number[] | undefined>()
    const [rechargeRate, setRechargeRate] = useState<number[] | undefined>()
    const [armour, setArmour] = useState<number[] | undefined>()
    const [maxHitpoints, setMaxHitpoints] = useState<number[] | undefined>()

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

    const powerCoreEquippedFilterSection = useRef<ChipFilter>({
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

    const capacityFilter = useRef<SliderRangeFilter>({
        label: "CAPACITY",
        initialValue: capacity,
        minMax: [0, 3000],
        onSetValue: (value: number[] | undefined) => {
            setCapacity(value)
            changePage(1)
        },
    })

    const maxDrawRateFilter = useRef<SliderRangeFilter>({
        label: "MAX DRAW RATE",
        initialValue: maxDrawRate,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setMaxDrawRate(value)
            changePage(1)
        },
    })

    const rechargeRateFilter = useRef<SliderRangeFilter>({
        label: "RECHARGE RATE",
        initialValue: rechargeRate,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setRechargeRate(value)
            changePage(1)
        },
    })

    const armourFilter = useRef<SliderRangeFilter>({
        label: "ARMOUR",
        initialValue: armour,
        minMax: [0, 1000],
        onSetValue: (value: number[] | undefined) => {
            setArmour(value)
            changePage(1)
        },
    })

    const maxHitpointsFilter = useRef<SliderRangeFilter>({
        label: "MAX HITPOINTS",
        initialValue: maxHitpoints,
        minMax: [0, 2000],
        onSetValue: (value: number[] | undefined) => {
            setMaxHitpoints(value)
            changePage(1)
        },
    })

    const getPowerCores = useCallback(async () => {
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
                    break
            }

            const resp = await send<GetPowerCoresResponse, GetPowerCoresRequest>(GameServerKeys.GetPowerCores, {
                search,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,
                exclude_ids: powerCoresAlreadyEquippedInOtherSlots,
                page,
                page_size: pageSize,
                equipped_statuses: equippedStatuses,
                rarities: rarities,
                sizes: [powerCoreSize],
                stat_capacity:
                    capacity && (capacity[0] > 0 || capacity[1] > 0)
                        ? {
                              min: capacity[0],
                              max: capacity[1],
                          }
                        : undefined,
                stat_max_draw_rate:
                    maxDrawRate && (maxDrawRate[0] > 0 || maxDrawRate[1] > 0)
                        ? {
                              min: maxDrawRate[0],
                              max: maxDrawRate[1],
                          }
                        : undefined,
                stat_recharge_rate:
                    rechargeRate && (rechargeRate[0] > 0 || rechargeRate[1] > 0)
                        ? {
                              min: rechargeRate[0],
                              max: rechargeRate[1],
                          }
                        : undefined,
                stat_armour:
                    armour && (armour[0] > 0 || armour[1] > 0)
                        ? {
                              min: armour[0],
                              max: armour[1],
                          }
                        : undefined,
                stat_max_hitpoints:
                    maxHitpoints && (maxHitpoints[0] > 0 || maxHitpoints[1] > 0)
                        ? {
                              min: maxHitpoints[0],
                              max: maxHitpoints[1],
                          }
                        : undefined,
            })
            setLoadError(undefined)
            setPowerCores(resp.power_cores)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get utilities.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [
        armour,
        capacity,
        equippedStatuses,
        maxDrawRate,
        maxHitpoints,
        page,
        pageSize,
        powerCoreSize,
        powerCoresAlreadyEquippedInOtherSlots,
        rarities,
        rechargeRate,
        search,
        send,
        setTotalItems,
        sort,
    ])

    useEffect(() => {
        getPowerCores()
    }, [getPowerCores])

    // Get the max for each category for better filtering
    const { query: queryPowerCoreMaxStats } = useParameterizedQuery(GetPowerCoreMaxStats)
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryPowerCoreMaxStats(userID)
                if (resp.error || !resp.payload) return
                capacityFilter.current.minMax[1] = resp.payload.capacity || 0
                maxDrawRateFilter.current.minMax[1] = resp.payload.max_draw_rate || 0
                rechargeRateFilter.current.minMax[1] = resp.payload.recharge_rate || 0
                armourFilter.current.minMax[1] = resp.payload.armour || 0
                maxHitpointsFilter.current.minMax[1] = resp.payload.max_hitpoints || 0
                toggleSortFilterReRender()
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get power core filter stats."
                console.error(message)
            }
        })()
    }, [queryPowerCoreMaxStats, toggleSortFilterReRender, userID])

    const powerCoreList = useMemo(() => {
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

        if (!powerCores || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (powerCores && powerCores.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gap: "1rem",
                    }}
                >
                    {powerCores.map((p) => (
                        <PowerCoreItem
                            key={p.id}
                            id={p.id}
                            onSelect={(p) => setSelectedPowerCore(p)}
                            equipped={equipped}
                            selected={selectedPowerCore?.id === p.id}
                        />
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
                        {"There are no power cores found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [equipped, isLoading, loadError, powerCores, selectedPowerCore?.id])

    return (
        <>
            <Drawer
                container={containerRef.current}
                open
                onClose={onClose}
                closeAfterTransition
                ModalProps={{
                    sx: {
                        position: "absolute",
                        m: 0,
                        "& > *": {
                            position: "absolute !important",
                            height: "100%",
                        },
                    },
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
                    ref={filtersContainerEl}
                    direction="column"
                    sx={{
                        height: "100%",
                    }}
                >
                    <PageHeader title="Equip a power core" description="Select a power core to equip on your mech." />
                    <Box
                        sx={{
                            borderBottom: `${primaryColor}70 1.5px solid`,
                            backgroundColor: "#00000070",
                            padding: "1rem 2rem",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing="1rem"
                            sx={{
                                minHeight: "300px",
                            }}
                        >
                            <Box flex={1}>
                                {/* Before */}
                                <PowerCorePreview powerCore={equipped} disableCompare />
                            </Box>
                            <Stack
                                sx={{
                                    position: "relative",
                                    alignSelf: "stretch",
                                    alignItems: "center",
                                }}
                            >
                                <Divider
                                    orientation="vertical"
                                    color="#00000070"
                                    sx={{
                                        flex: 1,
                                        height: "auto",
                                    }}
                                />
                                <SvgArrowRightAltSharpIcon size="3rem" />
                                <Divider
                                    orientation="vertical"
                                    color="#00000070"
                                    sx={{
                                        flex: 1,
                                        height: "auto",
                                    }}
                                />
                            </Stack>
                            <Stack flex={1} overflow="hidden">
                                <PowerCorePreview powerCore={selectedPowerCore} compareTo={equipped} />
                                {selectedPowerCore && (
                                    <Slide direction="up" in mountOnEnter>
                                        <Stack mt="auto" direction="row" spacing="1rem">
                                            <Box ml="auto" />
                                            <FancyButton
                                                clipThingsProps={{
                                                    backgroundColor: colors.green,
                                                }}
                                                onClick={() => onConfirm(selectedPowerCore)}
                                            >
                                                Equip To Mech
                                            </FancyButton>
                                        </Stack>
                                    </Slide>
                                )}
                            </Stack>
                        </Stack>
                    </Box>

                    <SortAndFilters
                        key={sortFilterReRender.toString()}
                        initialSearch={search}
                        onSetSearch={setSearch}
                        chipFilters={[rarityChipFilter.current, powerCoreEquippedFilterSection.current]}
                        sliderRangeFilters={[
                            capacityFilter.current,
                            maxDrawRateFilter.current,
                            rechargeRateFilter.current,
                            armourFilter.current,
                            maxHitpointsFilter.current,
                        ]}
                        changePage={changePage}
                        isExpanded={isFiltersExpanded}
                        width="25rem"
                        drawer={{
                            container: filtersContainerEl.current,
                            onClose: () => toggleIsFiltersExpanded(false),
                        }}
                    />
                    <Stack flex={1} minHeight={0}>
                        <PageHeader title="Equip a power core" description="Select a power core to equip on your mech." />
                        <TotalAndPageSizeOptions
                            countItems={powerCores?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            changePageSize={changePageSize}
                            pageSizeOptions={[4, 8]}
                            changePage={changePage}
                            manualRefresh={getPowerCores}
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
                            }}
                        >
                            {powerCoreList}
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
                                <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </Drawer>
        </>
    )
}
