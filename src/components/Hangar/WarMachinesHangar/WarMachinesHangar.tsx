import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { HANGAR_PAGE } from "../../../constants"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechBasicWithQueueStatus, MechStatus, MechStatusEnum } from "../../../types"
import { RepairOffer, RepairStatus } from "../../../types/jobs"
import { SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { QueueDetails } from "../../LeftDrawer/QuickDeploy/QueueDetails"
import { BulkRepairConfirmModal } from "./Common/BulkRepairConfirmModal"
import { RepairBay } from "./RepairBay/RepairBay"
import { WarMachineHangarItem } from "./WarMachineHangarItem"
import { useBattleLobby } from "../../../containers/battleLobby"

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

export const WarMachinesHangar = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()

    // Items
    const { mechsWithQueueStatus, playerQueueStatus } = useBattleLobby()
    const [list, setList] = useState<MechBasicWithQueueStatus[]>([])

    // Bulk action
    const [selectedMechs, setSelectedMechs] = useState<MechBasic[]>([])
    // const [bulkDeployConfirmModalOpen, setBulkDeployConfirmModalOpen] = useState(false)
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
        setSelectedMechs(list)
    }, [list])

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

    useEffect(() => {
        let result = [...mechsWithQueueStatus]

        updateQuery({
            sort,
            search,
            rarities: rarities.join("||"),
            statuses: status.join("||"),
            page: page.toString(),
            pageSize: pageSize.toString(),
        })

        setTotalItems(mechsWithQueueStatus.length)

        // filter
        if (rarities.length > 0) {
            result = result.filter((r) => rarities.includes(r.tier))
        }
        if (status.length > 0) {
            result = result.filter((r) => status.includes(r.status))
        }
        if (search) {
            result = result.filter((r) => `${r.label.toLowerCase()} ${r.name.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // sort
        switch (sort) {
            case SortTypeLabel.MechQueueAsc:
                result = result.sort((a, b) => (a.lobby_locked_at && b.lobby_locked_at && a.lobby_locked_at > a.lobby_locked_at ? 1 : -1))
                break
            case SortTypeLabel.MechQueueDesc:
                result = result.sort((a, b) => (a.lobby_locked_at && b.lobby_locked_at && a.lobby_locked_at < a.lobby_locked_at ? 1 : -1))
                break
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.name}${a.label}`.localeCompare(`${b.name}${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.name}${b.label}`.localeCompare(`${a.name}${a.label}`))
                break
            case SortTypeLabel.RarestAsc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
        }

        // pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)

        setList(result)
        console.log(result)
    }, [mechsWithQueueStatus, search, rarities, status, updateQuery, sort, page, pageSize, setTotalItems])

    const content = useMemo(() => {
        if (list.length > 0) {
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
                        {list.map((mech) => {
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
                        to={`/marketplace/war-machines`}
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
    }, [list, theme.factionTheme.primary, theme.factionTheme.secondary, isGridView, selectedMechs, toggleSelected])

    return useMemo(
        () => (
            <>
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

                                        <FancyButton
                                            clipThingsProps={{
                                                clipSize: "9px",
                                                backgroundColor: colors.gold,
                                                opacity: 1,
                                                border: { borderColor: colors.gold, borderThickness: "2px" },
                                                sx: { position: "relative" },
                                            }}
                                            sx={{ px: "1.6rem", py: ".6rem", color: "#000000" }}
                                            href={HANGAR_PAGE}
                                            target="_blank"
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#000000",
                                                    fontFamily: fonts.nostromoBlack,
                                                }}
                                            >
                                                WALKABLE HANGAR
                                            </Typography>
                                        </FancyButton>
                                    </Stack>
                                </PageHeader>

                                <TotalAndPageSizeOptions
                                    countItems={list?.length}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                    changePageSize={changePageSize}
                                    pageSizeOptions={[10, 20, 30]}
                                    changePage={changePage}
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

                                            "::-webkit-scrollbar": {
                                                width: "1rem",
                                            },
                                            "::-webkit-scrollbar-track": {
                                                background: "#FFFFFF15",
                                            },
                                            "::-webkit-scrollbar-thumb": {
                                                background: theme.factionTheme.primary,
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

                    <RepairBay selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} />
                </Stack>

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
            // bulkDeployConfirmModalOpen,
            bulkRepairConfirmModalOpen,
            changePage,
            changePageSize,
            content,
            isFiltersExpanded,
            isGridView,
            list,
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
