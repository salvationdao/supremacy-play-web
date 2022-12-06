import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { EmptyWarMachinesPNG, SvgClose } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination, useToggle } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { MechDetails, MechSkin, SkinStatus } from "../../../../../../types"
import { SortDir, SortTypeLabel } from "../../../../../../types/marketplace"
import { ClipThing } from "../../../../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../../../../Common/Deprecated/FancyButton"
import { PageHeader } from "../../../../../Common/Deprecated/PageHeader"
import { ChipFilter } from "../../../../../Common/Deprecated/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../../../../Common/Deprecated/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../../../../Common/Deprecated/TotalAndPageSizeOptions"
import { MechSkinItem } from "./MechSkins/MechSkinItem"
import { MechSkinPreview } from "./MechSkins/MechSkinPreview"

export interface GetSkinsRequest {
    search?: string
    sort_by?: string
    sort_dir: string
    page_size: number
    page?: number
    display_xsyn: boolean
    exclude_market_locked?: boolean
    include_market_listed: boolean
    display_genesis_and_limited?: boolean
    display_unique?: boolean
    exclude_ids: string[]
    include_ids: string[]
    model_id?: string
    rarities: string[]
    skin_compatibility: string[]
    equipped_statuses: string[]
}

export interface GetSkinsResponse {
    submodels: MechSkin[]
    total: number
}

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

export type OnConfirmMechSkinSelection = (selectedMechSkin: MechSkin) => void

export interface MechLoadoutMechSkinModalProps {
    onClose: () => void
    onConfirm: OnConfirmMechSkinSelection
    mech: MechDetails
    equipped?: MechSkin
    mechSkinsAlreadyEquippedInOtherSlots: string[]
    compatibleMechSkins: string[]
}

export const MechLoadoutMechSkinModal = ({
    onClose,
    onConfirm,
    mech,
    equipped,
    mechSkinsAlreadyEquippedInOtherSlots,
    compatibleMechSkins,
}: MechLoadoutMechSkinModalProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    const [skins, setSkins] = useState<MechSkin[]>([])
    const [selectedSkins, setSelectedSkins] = useState<MechSkin>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const { page, changePage, totalPages, changePageSize, pageSize, setTotalItems, totalItems } = usePagination({
        pageSize: 8,
        page: 1,
    })

    const [sort, setSort] = useState<string>(SortTypeLabel.Alphabetical)

    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle()
    const filtersContainerEl = useRef<HTMLElement>()
    const [search, setSearch] = useState("")
    const [rarities, setRarities] = useState<string[]>([])
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>([])

    // Filters
    const statusFilterSection = useRef<ChipFilter>({
        label: "EQUIPPED STATUS",
        options: [
            { value: SkinStatus.Equipped, label: "EQUIPPED", color: colors.gold },
            { value: SkinStatus.Unequipped, label: "UNEQUIPPED", color: colors.bronze },
        ],
        initialSelected: equippedStatuses,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setEquippedStatuses(value)
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

    const getSkins = useCallback(async () => {
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

            const resp = await send<GetSkinsResponse, GetSkinsRequest>(GameServerKeys.GetMechSkinsDetailed, {
                search: search,
                sort_by: sortBy,
                sort_dir: sortDir,
                page_size: pageSize,
                page: page,
                display_xsyn: false,
                exclude_market_locked: false,
                include_market_listed: false,
                display_genesis_and_limited: false,
                exclude_ids: mechSkinsAlreadyEquippedInOtherSlots,
                include_ids: compatibleMechSkins,
                model_id: mech.blueprint_id,
                rarities: rarities,
                skin_compatibility: [],
                equipped_statuses: equippedStatuses,
            })

            if (!resp) return
            setLoadError(undefined)
            setSkins(resp.submodels)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get mech skins.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [
        sort,
        send,
        search,
        pageSize,
        page,
        mechSkinsAlreadyEquippedInOtherSlots,
        compatibleMechSkins,
        mech.blueprint_id,
        rarities,
        equippedStatuses,
        setTotalItems,
    ])

    useEffect(() => {
        getSkins()
    }, [getSkins])

    const mechSkinsList = useMemo(() => {
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

        if (!skins || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (skins && skins.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {skins.map((p) => (
                        <MechSkinItem
                            key={p.id}
                            levelDifference={p.level - (mech.chassis_skin?.level || 0)}
                            skinDetails={p}
                            onSelect={(p) => setSelectedSkins(p)}
                            selected={selectedSkins?.id === p.id}
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
                        sx={{ px: "1.8rem", py: ".8rem", color: theme.factionTheme.text }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.text,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO MARKETPLACE
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [loadError, skins, isLoading, theme.factionTheme.primary, theme.factionTheme.text, mech.chassis_skin?.level, selectedSkins?.id])

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
                            chipFilters={[statusFilterSection.current, rarityChipFilter.current]}
                            changePage={changePage}
                            isExpanded={isFiltersExpanded}
                            width="25rem"
                            drawer={{
                                container: filtersContainerEl.current,
                                onClose: () => toggleIsFiltersExpanded(false),
                            }}
                        />
                        <Stack flex={1}>
                            <PageHeader title="Equip a mech skin" description="Select a skin to equip on your mech." />
                            <TotalAndPageSizeOptions
                                countItems={skins?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                pageSizeOptions={[]}
                                changePage={changePage}
                                manualRefresh={getSkins}
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
                                {mechSkinsList}
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
                            <MechSkinPreview mech={mech} skin={selectedSkins} equipped={equipped} onConfirm={onConfirm} isCompatible={true} />
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
