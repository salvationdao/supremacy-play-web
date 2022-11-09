import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgFilter, SvgGridView, SvgListView, SvgSearch } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { parseString } from "../../../helpers"
import { useDebounce, usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { MechBasicWithQueueStatus } from "../../../types"
import { SortDir, SortTypeLabel } from "../../../types/marketplace"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
import { NiceTextField } from "../../Common/Nice/NiceTextField"

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "40", value: 40 },
]

const layoutOptions = [
    { label: "", value: true, svg: <SvgGridView size="1.5rem" /> },
    { label: "", value: false, svg: <SvgListView size="1.5rem" /> },
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

export const FactionPassMechPool = () => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const [query, updateQuery] = useUrlQuery()
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search, pagination
    const [showFilters, setShowFilters] = useLocalStorage("factionPassMechPoolFilters", false)
    const [search, setSearch, searchInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.MechQueueAsc)
    const [isGridView, setIsGridView] = useLocalStorage("factionPassMechPoolGrid", true)
    const [status, setStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get("rarities") || undefined)?.split("||") || [])
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechs, setMechs] = useState<MechBasicWithQueueStatus[]>([])

    console.log({ isLoading, loadError, setStatus, setRarities })

    const faction = useMemo(() => {
        return getFaction(factionID)
    }, [factionID, getFaction])

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
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get war machines.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [page, pageSize, rarities, search, send, setTotalItems, sort, status, updateQuery])

    useEffect(() => {
        getItems()
    }, [getItems])

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                backgroundColor: faction.background_color,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                maxWidth: "190rem",
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

            <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                {/* Filter button */}
                <NiceButton
                    onClick={() => setShowFilters((prev) => !prev)}
                    border={{ color: faction.primary_color }}
                    sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                    background={showFilters}
                >
                    <Typography variant="subtitle1" fontFamily={fonts.nostromoBold} color={showFilters ? faction.secondary_color : "#FFFFFF"}>
                        <SvgFilter inline size="1.5rem" /> FILTER
                    </Typography>
                </NiceButton>

                <Box flex={1} />

                <Stack direction="row" alignItems="center">
                    {/* Show Total */}
                    <Box sx={{ height: "100%", backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem", borderRight: "none" }}>
                        <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                            {mechs?.length || 0} of {totalItems}
                        </Typography>
                    </Box>

                    {/* Page size options */}
                    <NiceButtonGroup
                        primaryColor={faction.primary_color}
                        secondaryColor={faction.secondary_color}
                        options={pageSizeOptions}
                        selected={pageSize}
                        onSelected={(value) => changePageSize(parseString(value, 1))}
                    />
                </Stack>

                {/* Page layout options */}
                <NiceButtonGroup
                    primaryColor={faction.primary_color}
                    secondaryColor={faction.secondary_color}
                    options={layoutOptions}
                    selected={isGridView}
                    onSelected={(value) => setIsGridView(value)}
                />

                {/* Search bar */}
                <NiceTextField
                    primaryColor={faction.primary_color}
                    value={searchInstant}
                    onChange={(value) => setSearch(value)}
                    placeholder="Search..."
                    InputProps={{
                        endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                    }}
                />

                {/* Sort */}
                <NiceSelect
                    label="Sort:"
                    primaryColor={faction.primary_color}
                    secondaryColor={faction.secondary_color}
                    options={sortOptions}
                    selected={sort}
                    onSelected={(value) => setSort(`${value}`)}
                    sx={{ minWidth: "26rem" }}
                />
            </Stack>

            <Box sx={{ flex: 1, width: "100%" }}></Box>

            <Pagination sx={{ mt: "auto" }} count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
        </Stack>
    )
}
