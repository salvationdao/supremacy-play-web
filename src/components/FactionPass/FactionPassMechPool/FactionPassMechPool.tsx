import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgFilter, SvgGridView, SvgListView, SvgSearch } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, parseString } from "../../../helpers"
import { useDebounce, usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { useLocalStorage } from "../../../hooks/useLocalStorage"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LobbyMech, MechStatusEnum } from "../../../types"
import { SortTypeLabel } from "../../../types/marketplace"
import { MechCard } from "../../Common/Mech/MechCard"
import { NavTabs } from "../../Common/NavTabs/NavTabs"
import { usePageTabs } from "../../Common/NavTabs/usePageTabs"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { FreqGraphProps } from "../../Common/SortAndFilters/RangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    Statuses = "statuses",
    Rarities = "rarities",
    Kills = "kills",
    Deaths = "deaths",
    Wins = "wins",
    Losses = "losses",
    PageSize = "pageSize",
    Page = "page",
}

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

export const FactionPassMechPool = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search, pagination
    const [showFilters, setShowFilters] = useLocalStorage<boolean>("factionPassMechPoolFilters", false)
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.MechQueueAsc)
    const [isGridView, setIsGridView] = useLocalStorage<boolean>("factionPassMechPoolGrid", true)
    const [status, setStatus] = useState<string[]>((query.get(UrlQueryParams.Statuses) || undefined)?.split("||") || [])
    const [rarities] = useState<string[]>((query.get(UrlQueryParams.Rarities) || undefined)?.split("||") || [])
    const [kills, setKills] = useState<number[] | undefined>((query.get(UrlQueryParams.Kills) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const [deaths, setDeaths] = useState<number[] | undefined>((query.get(UrlQueryParams.Deaths) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const [wins, setWins] = useState<number[] | undefined>((query.get(UrlQueryParams.Wins) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const [losses, setLosses] = useState<number[] | undefined>((query.get(UrlQueryParams.Losses) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get(UrlQueryParams.PageSize), 10),
        page: parseString(query.get(UrlQueryParams.Page), 1),
    })

    // Items
    const [displayMechs, setDisplayMechs] = useState<LobbyMech[]>([])
    const [mechs, setMechs] = useState<LobbyMech[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useGameServerSubscriptionFaction<LobbyMech[]>(
        {
            URI: "/staked_mechs",
            key: GameServerKeys.SubFactionStakedMechs,
        },
        (payload) => {
            setIsLoading(false)
            if (!payload) return

            setMechs((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((mech) => payload.find((p) => p.id === mech.id) || mech)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((mech) => mech.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list
            })
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        if (isLoading) return

        let result = [...mechs]

        // Apply search
        if (search) {
            result = result.filter((mech) => `${mech.label.toLowerCase()} ${mech.name.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // Apply status filter
        if (status && status.length) {
            result = result.filter((mech) => status.includes(mech.status))
        }

        // Apply rarity filter
        if (rarities && rarities.length) {
            result = result.filter((mech) => rarities.includes(mech.tier))
        }

        // Apply kills filter
        if (kills && kills.length) {
            result = result.filter((mech) => mech.stats.total_kills >= kills[0] && mech.stats.total_kills <= kills[1])
        }

        // Apply deaths filter
        if (deaths && deaths.length) {
            result = result.filter((mech) => mech.stats.total_deaths >= deaths[0] && mech.stats.total_deaths <= deaths[1])
        }

        // Apply wins filter
        if (wins && wins.length) {
            result = result.filter((mech) => mech.stats.total_wins >= wins[0] && mech.stats.total_wins <= wins[1])
        }

        // Apply losses filter
        if (losses && losses.length) {
            result = result.filter((mech) => mech.stats.total_losses >= losses[0] && mech.stats.total_losses <= losses[1])
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.name}${a.label}`.localeCompare(`${b.name}${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.name}${b.label}`.localeCompare(`${a.name}${a.label}`))
                break
            case SortTypeLabel.RarestAsc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.MechQueueAsc:
                result = result.sort((a, b) => (a.queue_position && b.queue_position && a.queue_position > b.queue_position ? 1 : -1))
                break
            case SortTypeLabel.MechQueueDesc:
                result = result.sort((a, b) => (a.queue_position && b.queue_position && a.queue_position < b.queue_position ? 1 : -1))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
            [UrlQueryParams.Rarities]: rarities.join("||"),
            [UrlQueryParams.Statuses]: status.join("||"),
            [UrlQueryParams.Kills]: kills?.join("||"),
            [UrlQueryParams.Deaths]: deaths?.join("||"),
            [UrlQueryParams.Wins]: wins?.join("||"),
            [UrlQueryParams.Losses]: losses?.join("||"),
            [UrlQueryParams.Page]: page.toString(),
            [UrlQueryParams.PageSize]: pageSize.toString(),
        })

        // Pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)
        changePage(1)
        setTotalItems(result.length)

        setDisplayMechs(result)
    }, [changePage, deaths, isLoading, kills, losses, mechs, page, pageSize, rarities, search, setTotalItems, sort, status, updateQuery, wins])

    // For graphing the bar graphs in the range filter
    const killsGraph: FreqGraphProps = useMemo(() => {
        let min = 0
        let max = 0
        const freq: { [value: number]: number } = {}
        mechs.forEach((mech) => {
            const totalKills = mech.stats.total_kills
            if (totalKills < min) min = totalKills
            if (totalKills > max) max = totalKills
            freq[totalKills] = (freq[totalKills] || 0) + 1
        })
        const maxFreq = Object.values(freq).reduce((acc, f) => (f > acc ? f : acc), 0)

        return { min, max, freq, maxFreq }
    }, [mechs])

    const deathsGraph: FreqGraphProps = useMemo(() => {
        let min = 0
        let max = 0
        const freq: { [value: number]: number } = {}
        mechs.forEach((mech) => {
            const totalDeaths = mech.stats.total_deaths
            if (totalDeaths < min) min = totalDeaths
            if (totalDeaths > max) max = totalDeaths
            freq[totalDeaths] = (freq[totalDeaths] || 0) + 1
        })
        const maxFreq = Object.values(freq).reduce((acc, f) => (f > acc ? f : acc), 0)

        return { min, max, freq, maxFreq }
    }, [mechs])

    const winsGraph: FreqGraphProps = useMemo(() => {
        let min = 0
        let max = 0
        const freq: { [value: number]: number } = {}
        mechs.forEach((mech) => {
            const totalWins = mech.stats.total_wins
            if (totalWins < min) min = totalWins
            if (totalWins > max) max = totalWins
            freq[totalWins] = (freq[totalWins] || 0) + 1
        })
        const maxFreq = Object.values(freq).reduce((acc, f) => (f > acc ? f : acc), 0)

        return { min, max, freq, maxFreq }
    }, [mechs])

    const lossesGraph: FreqGraphProps = useMemo(() => {
        let min = 0
        let max = 0
        const freq: { [value: number]: number } = {}
        mechs.forEach((mech) => {
            const totalLosses = mech.stats.total_losses
            if (totalLosses < min) min = totalLosses
            if (totalLosses > max) max = totalLosses
            freq[totalLosses] = (freq[totalLosses] || 0) + 1
        })
        const maxFreq = Object.values(freq).reduce((acc, f) => (f > acc ? f : acc), 0)

        return { min, max, freq, maxFreq }
    }, [mechs])

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displayMechs && displayMechs.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(30rem, 1fr))" : "100%",
                        gap: "1.5rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {displayMechs.map((mech) => {
                        return <MechCard key={`mech-${mech.id}`} mech={mech} isGridView={isGridView} />
                    })}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
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
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: "1.5rem",
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    {"No results..."}
                </Typography>

                <NiceButton route={{ to: `/marketplace/mechs` }} border={{ color: theme.factionTheme.primary }}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [displayMechs, isGridView, isLoading, theme.factionTheme.primary])

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                backgroundColor: theme.factionTheme.background,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                maxWidth: "190rem",
            }}
        >
            <NavTabs
                activeTabID={activeTabID}
                setActiveTabID={setActiveTabID}
                tabs={tabs}
                prevTab={prevTab}
                nextTab={nextTab}
                sx={{
                    ".MuiTab-root": { minWidth: "21rem" },
                }}
            />

            <Stack direction="row" alignItems="stretch" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <SortAndFilters
                    open={showFilters}
                    chipFilters={[
                        {
                            label: "STATUS",
                            options: [
                                { value: MechStatusEnum.Idle, render: { label: "IDLE", color: colors.green } },
                                { value: MechStatusEnum.Queue, render: { label: "IN QUEUE", color: colors.yellow } },
                                { value: MechStatusEnum.Battle, render: { label: "IN BATTLE", color: colors.orange } },
                                { value: MechStatusEnum.Market, render: { label: "MARKETPLACE", color: colors.bronze } },
                                { value: MechStatusEnum.Damaged, render: { label: "DAMAGED", color: colors.red } },
                            ],
                            initialExpanded: true,
                            selected: status,
                            setSelected: setStatus,
                        },
                    ]}
                    rangeFilters={[
                        {
                            label: "Kills",
                            initialExpanded: true,
                            minMax: [killsGraph.min, killsGraph.max],
                            values: kills,
                            setValues: setKills,
                            freqGraph: killsGraph,
                        },
                        {
                            label: "Deaths",
                            initialExpanded: true,
                            minMax: [deathsGraph.min, deathsGraph.max],
                            values: deaths,
                            setValues: setDeaths,
                            freqGraph: deathsGraph,
                        },
                        {
                            label: "Wins",
                            initialExpanded: true,
                            minMax: [winsGraph.min, winsGraph.max],
                            values: wins,
                            setValues: setWins,
                            freqGraph: winsGraph,
                        },
                        {
                            label: "Losses",
                            initialExpanded: true,
                            minMax: [lossesGraph.min, lossesGraph.max],
                            values: losses,
                            setValues: setLosses,
                            freqGraph: lossesGraph,
                        },
                    ]}
                />

                {/* Search, sort, grid view, and other top buttons */}
                <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                        {/* Filter button */}
                        <NiceButton
                            onClick={() => setShowFilters((prev) => !prev)}
                            border={{ color: theme.factionTheme.primary }}
                            sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                            background={showFilters}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold} color={showFilters ? theme.factionTheme.secondary : "#FFFFFF"}>
                                <SvgFilter inline size="1.5rem" /> FILTER
                            </Typography>
                        </NiceButton>

                        <Box flex={1} />

                        <Stack direction="row" alignItems="center">
                            {/* Show Total */}
                            <Box sx={{ height: "100%", backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem", borderRight: "none" }}>
                                <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                    {displayMechs?.length || 0} of {totalItems}
                                </Typography>
                            </Box>

                            {/* Page size options */}
                            <NiceButtonGroup
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.secondary}
                                options={pageSizeOptions}
                                selected={pageSize}
                                onSelected={(value) => changePageSize(parseString(value, 1))}
                            />
                        </Stack>

                        {/* Page layout options */}
                        <NiceButtonGroup
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                            options={layoutOptions}
                            selected={isGridView}
                            onSelected={(value) => setIsGridView(value)}
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
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                            options={sortOptions}
                            selected={sort}
                            onSelected={(value) => setSort(`${value}`)}
                            sx={{ minWidth: "26rem" }}
                        />
                    </Stack>

                    <Box sx={{ flex: 1, height: "100%", overflowY: "auto", pr: ".8rem" }}>{content}</Box>

                    <Pagination sx={{ mt: "auto" }} count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                </Stack>
            </Stack>
        </Stack>
    )
}
