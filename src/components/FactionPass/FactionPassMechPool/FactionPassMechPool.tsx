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
import { LobbyMech } from "../../../types"
import { SortTypeLabel } from "../../../types/marketplace"
import { MechCard } from "../../Common/MechCard"
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

export const FactionPassMechPool = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search, pagination
    const [showFilters, setShowFilters] = useLocalStorage<boolean>("factionPassMechPoolFilters", false)
    const [search, setSearch, searchInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.MechQueueAsc)
    const [isGridView, setIsGridView] = useLocalStorage<boolean>("factionPassMechPoolGrid", true)
    const [status, setStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get("rarities") || undefined)?.split("||") || [])
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
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
        console.log({ mechs, search, sort, status, rarities })
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
            sort,
            search,
            rarities: rarities.join("||"),
            statuses: status.join("||"),
            page: page.toString(),
            pageSize: pageSize.toString(),
        })

        // Pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)
        setTotalItems(result.length)

        setDisplayMechs(result)
    }, [mechs, page, pageSize, rarities, search, setTotalItems, sort, status, updateQuery])

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
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

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

            <Box sx={{ flex: 1, width: "100%", overflowY: "auto" }}>{content}</Box>

            <Pagination sx={{ mt: "auto" }} count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
        </Stack>
    )
}
