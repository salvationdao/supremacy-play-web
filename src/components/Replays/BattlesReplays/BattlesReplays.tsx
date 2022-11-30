import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgSearch } from "../../../assets"
import { useArena } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { useDebounce, usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Arena, BattleReplay } from "../../../types"
import { SortDir, SortTypeLabel } from "../../../types/marketplace"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { BattleReplayItem } from "./BattleReplayItem"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    Page = "page",
    PageSize = "pageSize",
    SelectedGID = "selectedGID",
}

export interface GetReplaysRequest {
    sort?: {
        table?: string
        column?: string
        direction: SortDir
    }
    search?: string
    page: number
    page_size: number
    arena_id: string
}

export interface GetReplaysResponse {
    battle_replays: BattleReplay[]
    total: number
}

const sortOptions = [
    { label: SortTypeLabel.DateAddedNewest, value: SortTypeLabel.DateAddedNewest },
    { label: SortTypeLabel.DateAddedOldest, value: SortTypeLabel.DateAddedOldest },
    { label: SortTypeLabel.MostViewed, value: SortTypeLabel.MostViewed },
]

export const BattlesReplays = () => {
    const theme = useTheme()
    const { arenaList } = useArena()
    const [query, updateQuery] = useUrlQuery()
    const [selectedGID, setSelectedGID] = useState(parseString(query.get(UrlQueryParams.SelectedGID), -1))
    const { send } = useGameServerCommands("/public/commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [battleReplays, setBattleReplays] = useState<BattleReplay[]>([])

    // Search, sort, filters
    const [selectedArenaType, setSelectedArenaType] = useState<Arena>()
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.DateAddedNewest)

    // Pagination
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get(UrlQueryParams.PageSize), 15),
        page: parseString(query.get(UrlQueryParams.Page), 1),
    })

    useEffect(() => {
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
            [UrlQueryParams.Page]: page.toString(),
            [UrlQueryParams.PageSize]: pageSize.toString(),
            selectedGID: selectedGID > 0 ? `${selectedGID}` : "",
        })
    }, [page, pageSize, search, selectedGID, sort, updateQuery])

    useEffect(() => {
        setSelectedGID((prev) => {
            let gid = -1
            if (prev > 0) {
                const defaultArena = arenaList.find((arena) => arena.gid === prev)
                gid = defaultArena?.gid || gid
                setSelectedArenaType(defaultArena)
            }
            return gid
        })
    }, [arenaList, setSelectedGID])

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                let sortDir = SortDir.Asc
                if (sort === SortTypeLabel.DateAddedNewest) sortDir = SortDir.Desc

                const resp = await send<GetReplaysResponse, GetReplaysRequest>(GameServerKeys.GetReplays, {
                    sort: { direction: sortDir },
                    search: search,
                    page,
                    page_size: pageSize,
                    arena_id: selectedArenaType?.id || "",
                })

                if (!resp) return
                setLoadError(undefined)
                setBattleReplays(resp.battle_replays)
                setTotalItems(resp.total)

                updateQuery.current({
                    [UrlQueryParams.Sort]: sort,
                    [UrlQueryParams.Search]: search,
                    [UrlQueryParams.Page]: page.toString(),
                    [UrlQueryParams.PageSize]: pageSize.toString(),
                })
            } catch (e) {
                setLoadError(typeof e === "string" ? e : "Failed to get replays.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [sort, send, search, page, pageSize, selectedArenaType?.id, setTotalItems, updateQuery])

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
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
            )
        }

        if (!battleReplays || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (battleReplays && battleReplays.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(26rem, 1fr))",
                        gap: "1.3rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {battleReplays.map((battleReplay) => {
                        return <BattleReplayItem key={battleReplay.id} battleReplay={battleReplay} />
                    })}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" spacing="1.2rem" sx={{ height: "100%", p: "1rem" }}>
                <Box
                    sx={{
                        width: "20rem",
                        height: "20rem",
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
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    No results...
                </Typography>

                <NiceButton route={{ to: `/` }} buttonColor={theme.factionTheme.primary}>
                    GO TO BATTLE ARENA
                </NiceButton>
            </Stack>
        )
    }, [loadError, battleReplays, isLoading, theme.factionTheme.primary])

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                maxWidth: "190rem",
            }}
        >
            <Typography variant="h2" sx={{ fontFamily: fonts.nostromoBlack, alignSelf: "flex-start" }}>
                Replays
            </Typography>

            <Stack direction="row" alignItems="stretch" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                    {/* Search, sort, grid view, and other top buttons */}
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                        {/* Arena list */}
                        {arenaList.length > 0 && (
                            <NiceSelect
                                label="Battle Mode:"
                                options={arenaList.map((a) => ({
                                    value: a.id,
                                    label: a.name,
                                }))}
                                selected={selectedArenaType?.name || arenaList[0].name}
                                onSelected={(value) => setSelectedArenaType(arenaList.find((a) => a.id === value))}
                                sx={{
                                    minWidth: "26rem",
                                }}
                            />
                        )}

                        <Box flex={1} />

                        {/* Show total */}
                        <Stack justifyContent="center" sx={{ height: "4.3rem", backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
                            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                {totalItems || 0} ITEMS
                            </Typography>
                        </Stack>

                        {/* Page layout options */}
                        <NiceButtonGroup
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.text}
                            options={[
                                { label: "15", value: 15 },
                                { label: "25", value: 25 },
                                { label: "35", value: 35 },
                            ]}
                            selected={pageSize}
                            onSelected={(value) => {
                                changePageSize(parseString(value, 1))
                                changePage(1)
                            }}
                        />

                        {/* Search bar */}
                        <NiceTextField
                            primaryColor={theme.factionTheme.primary}
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
                            options={sortOptions}
                            selected={sort}
                            onSelected={(value) => setSort(`${value}`)}
                            sx={{ minWidth: "26rem" }}
                        />
                    </Stack>

                    <Box sx={{ flex: 1, overflowY: "auto" }}>{content}</Box>

                    <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                </Stack>
            </Stack>
        </Stack>
    )
}
