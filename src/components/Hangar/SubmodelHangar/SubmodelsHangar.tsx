import { Box, CircularProgress, Pagination, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { HANGAR_PAGE } from "../../../constants"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BlueprintMech, BlueprintWeapon, MechSkin, SubmodelStatus } from "../../../types"
import { SortDir, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { SubmodelItem } from "./SubmodelItem"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

enum SubmodelType {
    weapon = "WEAPON",
    warMachine = "WAR MACHINE",
}

export interface GetSubmodelsRequest {
    search?: string
    sort_by?: string
    sort_dir: string
    page_size: number
    page?: number
    display_xsyn: boolean
    exclude_market_locked?: boolean
    include_market_listed: boolean
    display_genesis_and_limited?: boolean
    exclude_ids: string[]
    rarities: string[]
    skin_compatibility: string[]
    equipped_statuses: string[]
}

export interface GetSubmodelsResponse {
    submodels: MechSkin[]
    total: number
}

export const SubmodelsHangar = () => {
    return <SubmodelsHangarInner />
}

const SubmodelsHangarInner = () => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [submodels, setSubmodels] = useState<MechSkin[]>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Filters and sorts
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle(localStorage.getItem("isSubmodelHangarFiltersExpanded") === "true")
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.Alphabetical)
    const [equippedStatus, setEquippedStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get("rarities") || undefined)?.split("||") || [])
    const [modelFilter, setModelFilter] = useState<string[]>((query.get("models") || undefined)?.split("||") || [])

    const [sortFilterReRender, toggleSortFilterReRender] = useToggle()

    // The tabs
    const [submodelType, setSubmodelType] = useState<SubmodelType>(SubmodelType.warMachine)
    const previousSubmodelType = useRef<SubmodelType>(SubmodelType.warMachine)

    useEffect(() => {
        localStorage.setItem("isSubmodelHangarFiltersExpanded", isFiltersExpanded.toString())
    }, [isFiltersExpanded])

    // Filters
    const statusFilterSection = useRef<ChipFilter>({
        label: "EQUIPPED STATUS",
        options: [
            { value: SubmodelStatus.Equipped, label: "EQUIPPED", color: colors.gold },
            { value: SubmodelStatus.Unequipped, label: "UNEQUIPPED", color: colors.bronze },
        ],
        initialSelected: equippedStatus,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setEquippedStatus(value)
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

    const modelFilterSection = useRef<ChipFilter>({
        label: "MODEL COMPATIBILITY",
        options: [],
        initialSelected: modelFilter,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setModelFilter(value)
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

            const key = submodelType === SubmodelType.warMachine ? GameServerKeys.GetMechSubmodels : GameServerKeys.GetWeaponSubmodels
            const resp = await send<GetSubmodelsResponse, GetSubmodelsRequest>(key, {
                search: search,
                sort_by: sortBy,
                sort_dir: sortDir,
                page_size: pageSize,
                page: page,
                display_xsyn: false,
                exclude_market_locked: false,
                include_market_listed: false,
                display_genesis_and_limited: false,
                exclude_ids: [],
                rarities: rarities,
                skin_compatibility: modelFilter,
                equipped_statuses: equippedStatus,
            })

            updateQuery({
                sort,
                search,
                rarities: rarities.join("||"),
                statuses: equippedStatus.join("||"),
                page: page.toString(),
                pageSize: pageSize.toString(),
                models: modelFilter.join("||"),
            })

            if (!resp) return
            setLoadError(undefined)
            setSubmodels(resp.submodels)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : `Failed to get ${submodelType} submodel.`)
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, search, rarities, equippedStatus, updateQuery, sort, setTotalItems, modelFilter, submodelType])

    useEffect(() => {
        getItems()
    }, [getItems])

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
                const resp =
                    submodelType === SubmodelType.warMachine
                        ? await send<BlueprintMech[]>(GameServerKeys.GetMechBlueprints)
                        : await send<BlueprintWeapon[]>(GameServerKeys.GetWeaponBlueprints)

                if (!resp) return

                modelFilterSection.current.options = resp.map((r) => {
                    return { value: r.id, label: r.label, color: colors.blue2 }
                })

                //on submodel change, set the initial selected to reflect current selections
                modelFilterSection.current.initialSelected = []
                statusFilterSection.current.initialSelected = equippedStatus
                rarityChipFilter.current.initialSelected = rarities

                setModelFilter([])
                toggleSortFilterReRender()
            } catch (e) {
                setLoadError(typeof e === "string" ? e : `Failed to get ${submodelType} submodels.`)
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send, submodelType, equippedStatus, rarities, toggleSortFilterReRender])

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

        if (!submodels || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (submodels && submodels.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(25rem, 1fr))",
                            gap: "1.5rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {submodels.map((submodel) => (
                            <SubmodelItem key={`submodels-${submodel.id}`} submodel={submodel} />
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
                            textAlign: "center",
                        }}
                    >
                        {`There are no ${submodelType} submodels found, please check your filters and try again.`}
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
    }, [loadError, submodels, isLoading, theme.factionTheme.primary, theme.factionTheme.secondary, submodelType])

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <SortAndFilters
                key={sortFilterReRender.toString()}
                initialSearch={search}
                onSetSearch={setSearch}
                chipFilters={[statusFilterSection.current, rarityChipFilter.current, modelFilterSection.current]}
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
                        <PageHeader title="SUBMODELS" description="Your submodels for war machines and weapons." imageUrl={WarMachineIconPNG}>
                            <Box sx={{ ml: "auto !important", pr: "2rem" }}>
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
                            </Box>
                        </PageHeader>

                        <TotalAndPageSizeOptions
                            countItems={submodels?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            changePageSize={changePageSize}
                            pageSizeOptions={[10, 20, 30]}
                            changePage={changePage}
                            manualRefresh={getItems}
                            sortOptions={sortOptions}
                            selectedSort={sort}
                            onSetSort={setSort}
                            isFiltersExpanded={isFiltersExpanded}
                            toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                        />

                        <Stack direction={"row"} sx={{ borderBottom: `${theme.factionTheme.primary}70 1.5px solid` }}>
                            <Tabs
                                value={submodelType}
                                onChange={(e, v) => {
                                    previousSubmodelType.current = submodelType
                                    setSubmodelType(v)
                                }}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    flexShrink: 0,
                                    color: theme.factionTheme.primary,
                                    minHeight: 0,
                                    ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "5rem", width: "20rem" },
                                    ".Mui-selected": {
                                        color: `${theme.factionTheme.secondary} !important`,
                                        background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}BB)`,
                                    },
                                    ".MuiTabs-indicator": { display: "none" },
                                    ".MuiTabScrollButton-root": { display: "none" },
                                }}
                            >
                                <Tab label="WAR MACHINES" value={SubmodelType.warMachine} />
                                <Tab label="WEAPONS" value={SubmodelType.weapon} />
                            </Tabs>
                        </Stack>

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
        </Stack>
    )
}
