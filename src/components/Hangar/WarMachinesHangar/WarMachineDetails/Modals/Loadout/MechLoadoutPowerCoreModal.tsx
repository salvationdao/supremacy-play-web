import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { FancyButton } from "../../../../.."
import { EmptyWarMachinesPNG, SvgClose } from "../../../../../../assets"
import { useAuth } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { GetPowerCoreMaxStats } from "../../../../../../fetching"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination, useToggle } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { PlayerAsset, PowerCore } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { ClipThing } from "../../../../../Common/ClipThing"
import { PageHeader } from "../../../../../Common/PageHeader"
import { ChipFilter } from "../../../../../Common/SortAndFilters/ChipFilterSection"
import { SliderRangeFilter } from "../../../../../Common/SortAndFilters/SliderRangeFilterSection"
import { SortAndFilters } from "../../../../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../../../../Common/TotalAndPageSizeOptions"
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
    onClose: () => void
    onConfirm: OnConfirmPowerCoreSelection
    equipped?: PowerCore
    powerCoresAlreadyEquippedInOtherSlots: string[]
    powerCoreSize: string
}

export const MechLoadoutPowerCoreModal = ({
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
    const secondaryColor = theme.factionTheme.secondary

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
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>([])
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
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
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
    }, [equipped, isLoading, loadError, powerCores, selectedPowerCore?.id, theme.factionTheme.primary, theme.factionTheme.secondary])

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
                        <Stack flex={1}>
                            <PageHeader title="Equip a weapon" description="Select a weapon to equip on your mech." />
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
                            <PowerCorePreview powerCore={selectedPowerCore} equipped={equipped} onConfirm={onConfirm} />
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
