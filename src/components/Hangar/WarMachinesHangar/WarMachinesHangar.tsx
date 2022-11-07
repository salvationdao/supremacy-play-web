import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, HangarBg, WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MechBasic, MechBasicWithQueueStatus, MechStatus, MechStatusEnum } from "../../../types"
import { PlayerQueueStatus } from "../../../types/battle_queue"
import { RepairOffer, RepairStatus } from "../../../types/jobs"
import { SortDir, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { QueueDetails } from "../../Lobbies/BattleLobbyMech/QueueDetails"
import { BulkRepairConfirmModal } from "./Common/BulkRepairConfirmModal"
import { RepairBay } from "./RepairBay/RepairBay"
import { WarMachineHangarItem } from "./WarMachineHangarItem"

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

interface GetMechsRequest {
    queue_sort?: string
    sort_by?: string
    sort_dir?: string
    search: string
    page: number
    page_size: number
    rarities: string[]
    statuses: string[]
    include_market_listed: boolean
}

interface GetMechsResponse {
    mechs: MechBasicWithQueueStatus[]
    total: number
}

export const WarMachinesHangar = () => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()

    // Player Queue Status
    const [playerQueueStatus, setPlayerQueueStatus] = useState<PlayerQueueStatus>({
        queue_limit: 10,
        total_queued: 0,
    })
    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setPlayerQueueStatus(payload)
        },
    )

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechs, setMechs] = useState<MechBasicWithQueueStatus[]>([])

    // Bulk action
    const [selectedMechs, setSelectedMechs] = useState<MechBasic[]>([])
    const [bulkRepairConfirmModalOpen, setBulkRepairConfirmModalOpen] = useState(false)
    const childrenMechStatus = useRef<{ [mechID: string]: MechStatus }>({})
    const childrenRepairStatus = useRef<{ [mechID: string]: RepairStatus }>({})
    const childrenRepairOffer = useRef<{ [mechID: string]: RepairOffer }>({})

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Filters and sorts
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle(localStorage.getItem("isWarMachinesHangarFiltersExpanded") === "true")
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.MechQueueAsc)
    const [status, setStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get("rarities") || undefined)?.split("||") || [])
    const [isGridView, toggleIsGridView] = useToggle((localStorage.getItem("fleetMechGrid") || "true") === "true")

    useEffect(() => {
        localStorage.setItem("fleetMechGrid", isGridView.toString())
    }, [isGridView])

    useEffect(() => {
        localStorage.setItem("isWarMachinesHangarFiltersExpanded", isFiltersExpanded.toString())
    }, [isFiltersExpanded])

    const toggleSelected = useCallback((mech: MechBasic) => {
        setSelectedMechs((prev) => {
            const newArray = [...prev]
            const isAlreadySelected = prev.findIndex((s) => s.id === mech.id)
            if (isAlreadySelected >= 0) {
                newArray.splice(isAlreadySelected, 1)
            } else {
                newArray.push(mech)
            }

            return newArray
        })
    }, [])

    const onSelectAll = useCallback(() => {
        setSelectedMechs(mechs)
    }, [mechs])

    const onUnSelectAll = useCallback(() => {
        setSelectedMechs([])
    }, [])

    // Filters
    const statusFilterSection = useRef<ChipFilter>({
        label: "STATUS",
        options: [
            { value: MechStatusEnum.Idle, label: "IDLE", color: colors.green },
            { value: MechStatusEnum.Queue, label: "IN QUEUE", color: colors.yellow },
            { value: MechStatusEnum.Battle, label: "IN BATTLE", color: colors.orange },
            { value: MechStatusEnum.Market, label: "MARKETPLACE", color: colors.red },
        ],
        initialSelected: status,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setStatus(value)
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

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = SortDir.Asc
            let sortBy = ""
            if (sort === SortTypeLabel.MechQueueDesc || sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.RarestDesc) sortDir = SortDir.Desc

            switch (sort) {
                case SortTypeLabel.Alphabetical:
                case SortTypeLabel.AlphabeticalReverse:
                    sortBy = "alphabetical"
                    break
                case SortTypeLabel.RarestAsc:
                case SortTypeLabel.RarestDesc:
                    sortBy = "rarity"
            }

            const isQueueSort = sort === SortTypeLabel.MechQueueAsc || sort === SortTypeLabel.MechQueueDesc

            const resp = await send<GetMechsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                queue_sort: isQueueSort ? sortDir : undefined,
                sort_by: isQueueSort ? undefined : sortBy,
                sort_dir: isQueueSort ? undefined : sortDir,
                search,
                rarities,
                statuses: status,
                page,
                page_size: pageSize,
                include_market_listed: true,
            })

            updateQuery.current({
                sort,
                search,
                rarities: rarities.join("||"),
                statuses: status.join("||"),
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setMechs(resp.mechs)
            setTotalItems(resp.total)
            setSelectedMechs([])
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get war machines.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, search, rarities, status, sort, setTotalItems, updateQuery])

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

        if (!mechs || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (mechs && mechs.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(30rem, 1fr))" : "100%",
                            gap: "1.5rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {mechs.map((mech) => {
                            const isSelected = selectedMechs.findIndex((s) => s.id === mech.id) >= 0
                            return (
                                <WarMachineHangarItem
                                    key={`marketplace-${mech.id}`}
                                    isSelected={isSelected}
                                    toggleIsSelected={() => {
                                        toggleSelected(mech)
                                    }}
                                    childrenMechStatus={childrenMechStatus}
                                    childrenRepairStatus={childrenRepairStatus}
                                    childrenRepairOffer={childrenRepairOffer}
                                    mech={mech}
                                    isGridView={isGridView}
                                />
                            )
                        })}
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
                            textAlign: "center",
                        }}
                    >
                        {"There are no war machines found, please check your filters and try again."}
                    </Typography>

                    <FancyButton
                        to={`/marketplace/mechs`}
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
    }, [loadError, mechs, isLoading, theme.factionTheme.primary, theme.factionTheme.secondary, isGridView, selectedMechs, toggleSelected])

    return useMemo(
        () => (
            <>
                <Box
                    alignItems="center"
                    sx={{
                        height: "100%",
                        p: "1rem",
                        zIndex: siteZIndex.RoutePage,
                        backgroundImage: `url(${HangarBg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                >
                    <Stack direction="row" sx={{ height: "100%" }}>
                        <SortAndFilters
                            initialSearch={search}
                            onSetSearch={setSearch}
                            chipFilters={[statusFilterSection.current, rarityChipFilter.current]}
                            changePage={changePage}
                            isExpanded={isFiltersExpanded}
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
                                    <PageHeader title="WAR MACHINES" description="Your war machines." imageUrl={WarMachineIconPNG}>
                                        <Stack spacing="1rem" direction="row" alignItems="center" sx={{ ml: "auto !important", pr: "2rem" }}>
                                            <FancyButton
                                                disabled={selectedMechs.length <= 0}
                                                clipThingsProps={{
                                                    clipSize: "9px",
                                                    backgroundColor: colors.blue2,
                                                    opacity: 1,
                                                    border: { borderColor: colors.blue2, borderThickness: "2px" },
                                                    sx: { position: "relative" },
                                                }}
                                                sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                                                onClick={() => setBulkRepairConfirmModalOpen(true)}
                                            >
                                                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                                    REPAIR SELECTED
                                                </Typography>
                                            </FancyButton>
                                        </Stack>
                                    </PageHeader>

                                    <TotalAndPageSizeOptions
                                        countItems={mechs?.length}
                                        totalItems={totalItems}
                                        pageSize={pageSize}
                                        changePageSize={changePageSize}
                                        pageSizeOptions={[10, 20, 30]}
                                        changePage={changePage}
                                        manualRefresh={getItems}
                                        sortOptions={sortOptions}
                                        selectedSort={sort}
                                        onSetSort={setSort}
                                        isGridView={isGridView}
                                        toggleIsGridView={toggleIsGridView}
                                        isFiltersExpanded={isFiltersExpanded}
                                        toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                                        selectedCount={selectedMechs.length}
                                        onSelectAll={onSelectAll}
                                        onUnselectedAll={onUnSelectAll}
                                    >
                                        <QueueDetails playerQueueStatus={playerQueueStatus} />
                                    </TotalAndPageSizeOptions>

                                    <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                                        <Box
                                            sx={{
                                                ml: "1.9rem",
                                                pr: "1.9rem",
                                                my: "1rem",
                                                flex: 1,
                                                overflowY: "auto",
                                                overflowX: "hidden",
                                                direction: "ltr",
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
                                        <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                                    </Box>
                                )}
                            </Stack>
                        </ClipThing>

                        <RepairBay selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} />
                    </Stack>
                </Box>

                {bulkRepairConfirmModalOpen && (
                    <BulkRepairConfirmModal
                        setBulkRepairConfirmModalOpen={setBulkRepairConfirmModalOpen}
                        selectedMechs={selectedMechs}
                        setSelectedMechs={setSelectedMechs}
                        childrenMechStatus={childrenMechStatus}
                        childrenRepairStatus={childrenRepairStatus}
                        childrenRepairOffer={childrenRepairOffer}
                    />
                )}
            </>
        ),
        [
            bulkRepairConfirmModalOpen,
            changePage,
            changePageSize,
            content,
            getItems,
            isFiltersExpanded,
            isGridView,
            mechs?.length,
            onSelectAll,
            onUnSelectAll,
            page,
            pageSize,
            playerQueueStatus,
            search,
            selectedMechs,
            sort,
            theme.factionTheme.background,
            theme.factionTheme.primary,
            toggleIsFiltersExpanded,
            toggleIsGridView,
            totalItems,
            totalPages,
        ],
    )
}
