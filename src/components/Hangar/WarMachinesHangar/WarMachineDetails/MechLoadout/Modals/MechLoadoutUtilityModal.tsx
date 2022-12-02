import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { EmptyWarMachinesPNG, SvgClose } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets, getUtilityTypeColor } from "../../../../../../helpers"
import { usePagination, useToggle } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { PlayerAsset, Utility, UtilityType } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { ClipThing } from "../../../../../Common/Deprecated/ClipThing"
import { PageHeader } from "../../../../../Common/Deprecated/PageHeader"
import { ChipFilter } from "../../../../../Common/Deprecated/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../../../../Common/Deprecated/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../../../../Common/Deprecated/TotalAndPageSizeOptions"
import { UtilityItem } from "./Utility/UtilityItem"
import { UtilityPreview } from "./Utility/UtilityPreview"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

export interface GetUtilitiesRequest {
    search: string
    page: number
    page_size: number
    include_market_listed: boolean
    exclude_equipped?: boolean
    exclude_mech_locked?: boolean
    sort_by: string
    sort_dir: string
    exclude_ids: string[]
    utility_types: string[]
    rarities: string[]
    equipped_statuses: string[]
}

export interface GetUtilitiesResponse {
    utilities: PlayerAsset[]
    total: number
}

export type OnConfirmUtilitySelection = (selectedUtility: Utility) => void

interface MechLoadoutUtilityModalProps {
    onClose: () => void
    onConfirm: OnConfirmUtilitySelection
    equipped?: Utility
    utilitiesAlreadyEquippedInOtherSlots: string[]
}

export const MechLoadoutUtilityModal = ({ onClose, onConfirm, equipped, utilitiesAlreadyEquippedInOtherSlots }: MechLoadoutUtilityModalProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    const [utilities, setUtilities] = useState<PlayerAsset[]>([])
    const [selectedUtility, setSelectedUtility] = useState<Utility>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const { page, changePage, totalPages, changePageSize, pageSize, setTotalItems, totalItems } = usePagination({
        pageSize: 4,
        page: 1,
    })

    const [sort, setSort] = useState<string>(SortTypeLabel.Alphabetical)

    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle()
    const filtersContainerEl = useRef<HTMLElement>()
    const [search, setSearch] = useState("")
    const [utilityTypes, setUtilityTypes] = useState<string[]>([])
    const [rarities, setRarities] = useState<string[]>([])
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>([])

    const utilityTypeFilterSection = useRef<ChipFilter>({
        label: "UTILITY TYPE",
        options: [
            { value: UtilityType.Shield, label: UtilityType.Shield, color: getUtilityTypeColor(UtilityType.Shield) },
            { value: UtilityType.AttackDrone, label: UtilityType.AttackDrone, color: getUtilityTypeColor(UtilityType.AttackDrone) },
            { value: UtilityType.RepairDrone, label: UtilityType.RepairDrone, color: getUtilityTypeColor(UtilityType.RepairDrone) },
            { value: UtilityType.AntiMissile, label: UtilityType.AntiMissile, color: getUtilityTypeColor(UtilityType.AntiMissile) },
            { value: UtilityType.Accelerator, label: UtilityType.Accelerator, color: getUtilityTypeColor(UtilityType.Accelerator) },
        ],
        initialSelected: utilityTypes,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setUtilityTypes(value)
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

    const utilityEquippedFilterSection = useRef<ChipFilter>({
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

    const getUtilities = useCallback(async () => {
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

            const resp = await send<GetUtilitiesResponse, GetUtilitiesRequest>(GameServerKeys.GetUtilities, {
                page,
                page_size: pageSize,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,

                exclude_ids: utilitiesAlreadyEquippedInOtherSlots,
                utility_types: utilityTypes,
                rarities,
                equipped_statuses: equippedStatuses,
                search,
            })

            if (!resp) return
            setLoadError(undefined)
            setUtilities(resp.utilities)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get utilities.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [equippedStatuses, page, pageSize, rarities, search, send, setTotalItems, sort, utilityTypes, utilitiesAlreadyEquippedInOtherSlots])

    useEffect(() => {
        getUtilities()
    }, [getUtilities])

    const utilityList = useMemo(() => {
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

        if (!utilities || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (utilities && utilities.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gap: "1rem",
                    }}
                >
                    {utilities.map((p) => (
                        <UtilityItem key={p.id} id={p.id} onSelect={(w) => setSelectedUtility(w)} equipped={equipped} selected={selectedUtility?.id === p.id} />
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
                        There are no utilities found, please try again.
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [equipped, isLoading, loadError, selectedUtility?.id, utilities])

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
                            initialSearch={search}
                            onSetSearch={setSearch}
                            chipFilters={[utilityTypeFilterSection.current, rarityChipFilter.current, utilityEquippedFilterSection.current]}
                            changePage={changePage}
                            isExpanded={isFiltersExpanded}
                            width="25rem"
                            drawer={{
                                container: filtersContainerEl.current,
                                onClose: () => toggleIsFiltersExpanded(false),
                            }}
                        />
                        <Stack flex={1}>
                            <PageHeader title="Equip a utility" description="Select a utility to equip on your mech." />
                            <TotalAndPageSizeOptions
                                countItems={utilities?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                pageSizeOptions={[4, 8]}
                                changePage={changePage}
                                manualRefresh={getUtilities}
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
                                {utilityList}
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
                        <Stack
                            sx={{
                                overflow: "hidden",
                                flexBasis: "300px",
                                borderLeft: `${primaryColor}70 1.5px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <UtilityPreview utility={selectedUtility} equipped={equipped} onConfirm={onConfirm} />
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
