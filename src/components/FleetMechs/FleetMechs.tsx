import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgFilter, SvgGridView, SvgListView, SvgRepair, SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { getRarityDeets, parseString } from "../../helpers"
import { useDebounce, useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MechStatusEnum, NewMechStruct, RarityEnum } from "../../types"
import { PlayerQueueStatus } from "../../types/battle_queue"
import { SortTypeLabel } from "../../types/marketplace"
import { MechBulkActions } from "../Common/Mech/MechBulkActions"
import { MechCard } from "../Common/Mech/MechCard"
import { MechQueueLimit } from "../Common/Mech/MechQueueLimit"
import { RepairBlocks } from "../Common/Mech/MechRepairBlocks"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { usePageTabs } from "../Common/NavTabs/usePageTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceButtonGroup } from "../Common/Nice/NiceButtonGroup"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { NiceTextField } from "../Common/Nice/NiceTextField"
import { SortAndFilters } from "../Common/SortAndFilters/SortAndFilters"
import { VirtualizedGrid } from "../Common/VirtualizedGrid"
import { RepairBay } from "./RepairBay/RepairBay"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    Statuses = "statuses",
    Rarities = "rarities",
    Kills = "kills",
    Deaths = "deaths",
    Wins = "wins",
    Losses = "losses",
    RepairBlocks = "repairBlocks",
}

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

const layoutOptions = [
    { label: "", value: true, svg: <SvgGridView size="1.5rem" /> },
    { label: "", value: false, svg: <SvgListView size="1.5rem" /> },
]

const mechStatusOptions = [
    { value: MechStatusEnum.Idle, render: { label: "IDLE", color: colors.green } },
    { value: MechStatusEnum.Queue, render: { label: "IN QUEUE", color: colors.yellow } },
    { value: MechStatusEnum.Battle, render: { label: "IN BATTLE", color: colors.orange } },
    { value: MechStatusEnum.Market, render: { label: "MARKETPLACE", color: colors.bronze } },
    { value: MechStatusEnum.Damaged, render: { label: "DAMAGED", color: colors.red } },
]

const repairProgressOptions = [
    { value: "0", renderNode: <RepairBlocks defaultBlocks={5} remainDamagedBlocks={0} size={7} /> },
    { value: "1", renderNode: <RepairBlocks defaultBlocks={5} remainDamagedBlocks={1} size={7} /> },
    { value: "2", renderNode: <RepairBlocks defaultBlocks={5} remainDamagedBlocks={2} size={7} /> },
    { value: "3", renderNode: <RepairBlocks defaultBlocks={5} remainDamagedBlocks={3} size={7} /> },
    { value: "4", renderNode: <RepairBlocks defaultBlocks={5} remainDamagedBlocks={4} size={7} /> },
    { value: "5", renderNode: <RepairBlocks defaultBlocks={5} remainDamagedBlocks={5} size={7} /> },
]

const rarityOptions = [
    { value: RarityEnum.Mega, render: { ...getRarityDeets("MEGA") } },
    { value: RarityEnum.Colossal, render: { ...getRarityDeets("COLOSSAL") } },
    { value: RarityEnum.Rare, render: { ...getRarityDeets("RARE") } },
    { value: RarityEnum.Legendary, render: { ...getRarityDeets("LEGENDARY") } },
    { value: RarityEnum.EliteLegendary, render: { ...getRarityDeets("ELITE_LEGENDARY") } },
    { value: RarityEnum.UltraRare, render: { ...getRarityDeets("ULTRA_RARE") } },
    { value: RarityEnum.Exotic, render: { ...getRarityDeets("EXOTIC") } },
    { value: RarityEnum.Guardian, render: { ...getRarityDeets("GUARDIAN") } },
    { value: RarityEnum.Mythic, render: { ...getRarityDeets("MYTHIC") } },
    { value: RarityEnum.DeusEx, render: { ...getRarityDeets("DEUS_EX") } },
    { value: RarityEnum.Titan, render: { ...getRarityDeets("TITAN") } },
]

export const FleetMechs = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Player queue status
    const [playerQueueStatus, setPlayerQueueStatus] = useState<PlayerQueueStatus>({
        queue_limit: 10,
        total_queued: 0,
    })

    // Filter, search
    const [showFilters, setShowFilters] = useLocalStorage<boolean>("fleetMechsFilters", false)
    const [showRepairBay, setShowRepairBay] = useLocalStorage<boolean>("fleetMechsRepairBay", true)
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.MechQueueAsc)
    const [isGridView, setIsGridView] = useLocalStorage<boolean>("fleetMechsGrid", true)
    const [status, setStatus] = useState<string[]>((query.get(UrlQueryParams.Statuses) || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get(UrlQueryParams.Rarities) || undefined)?.split("||") || [])
    const [repairBlocks, setRepairBlocks] = useState<string[]>((query.get(UrlQueryParams.RepairBlocks) || undefined)?.split("||") || [])
    const [kills, setKills] = useState<number[] | undefined>((query.get(UrlQueryParams.Kills) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const [deaths, setDeaths] = useState<number[] | undefined>((query.get(UrlQueryParams.Deaths) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const [wins, setWins] = useState<number[] | undefined>((query.get(UrlQueryParams.Wins) || undefined)?.split("||").map((a) => parseString(a, 0)))
    const [losses, setLosses] = useState<number[] | undefined>((query.get(UrlQueryParams.Losses) || undefined)?.split("||").map((a) => parseString(a, 0)))

    // Items
    const [displayMechs, setDisplayMechs] = useState<NewMechStruct[]>([])
    const [mechs, setMechs] = useState<NewMechStruct[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // For bulk selecting mechs
    const [selectedMechs, setSelectedMechs] = useState<NewMechStruct[]>([])
    const toggleSelected = useCallback((mech: NewMechStruct) => {
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

    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setPlayerQueueStatus(payload)
        },
    )

    useGameServerSubscriptionSecuredUser<NewMechStruct[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerQueueableMechs,
        },
        (payload) => {
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

            setIsLoading(false)
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

        // Apply repair blocks filter
        if (repairBlocks && repairBlocks.length) {
            result = result.filter((mech) => repairBlocks.includes(`${mech.damaged_blocks}`))
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
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
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
            [UrlQueryParams.RepairBlocks]: repairBlocks?.join("||"),
        })

        setDisplayMechs(result)
    }, [deaths, isLoading, kills, losses, mechs, rarities, repairBlocks, search, sort, status, updateQuery, wins])

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
                <VirtualizedGrid
                    uniqueID="fleetMechsGrid"
                    itemWidthConfig={isGridView ? { minWidth: 300 } : { columnCount: 1 }}
                    itemHeight={isGridView ? 290 : 100}
                    totalItems={displayMechs.length}
                    gap={13}
                    renderIndex={(index) => {
                        const mech = displayMechs[index]
                        if (!mech) {
                            return null
                        }
                        const isSelected = !!selectedMechs.find((m) => m.id === mech.id)
                        return (
                            <MechCard
                                key={`mech-${mech.id}`}
                                mech={mech}
                                isGridView={isGridView}
                                isSelected={isSelected}
                                toggleSelected={toggleSelected}
                                hide={{ ownerName: true }}
                            />
                        )
                    }}
                />
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
                    No results...
                </Typography>

                <NiceButton route={{ to: `/marketplace/mechs` }} buttonColor={theme.factionTheme.primary}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [displayMechs, isGridView, isLoading, selectedMechs, theme.factionTheme.primary, toggleSelected])

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
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

            <Stack direction="row" alignItems="stretch" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <SortAndFilters
                    open={showFilters}
                    chipFilters={[
                        {
                            label: "Status",
                            options: mechStatusOptions,
                            initialExpanded: true,
                            selected: status,
                            setSelected: setStatus,
                        },
                        {
                            label: "Rarity",
                            options: rarityOptions,
                            initialExpanded: true,
                            selected: rarities,
                            setSelected: setRarities,
                        },
                        {
                            label: "Repair Progress",
                            options: repairProgressOptions,
                            initialExpanded: true,
                            selected: repairBlocks,
                            setSelected: setRepairBlocks,
                        },
                    ]}
                    rangeFilters={[
                        {
                            label: "Kills",
                            initialExpanded: true,
                            values: kills,
                            setValues: setKills,
                            numberFreq: mechs.map((mech) => mech.stats.total_kills),
                        },
                        {
                            label: "Deaths",
                            initialExpanded: true,
                            values: deaths,
                            setValues: setDeaths,
                            numberFreq: mechs.map((mech) => mech.stats.total_deaths),
                        },
                        {
                            label: "Wins",
                            initialExpanded: true,
                            values: wins,
                            setValues: setWins,
                            numberFreq: mechs.map((mech) => mech.stats.total_wins),
                        },
                        {
                            label: "Losses",
                            initialExpanded: true,
                            values: losses,
                            setValues: setLosses,
                            numberFreq: mechs.map((mech) => mech.stats.total_losses),
                        },
                    ]}
                />

                <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                    {/* Search, sort, grid view, and other top buttons */}
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                        {/* Filter button */}
                        <NiceButton
                            onClick={() => setShowFilters((prev) => !prev)}
                            fill={showFilters}
                            buttonColor={theme.factionTheme.primary}
                            sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold} color={showFilters ? theme.factionTheme.text : "#FFFFFF"}>
                                <SvgFilter inline size="1.5rem" /> FILTER
                            </Typography>
                        </NiceButton>

                        {/* Repair bay button */}
                        <NiceButton
                            onClick={() => setShowRepairBay((prev) => !prev)}
                            fill={showRepairBay}
                            buttonColor={colors.repair}
                            disableAutoColor
                            sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                                <SvgRepair inline size="1.5rem" /> REPAIR BAY
                            </Typography>
                        </NiceButton>

                        <MechQueueLimit playerQueueStatus={playerQueueStatus} />

                        <Box flex={1} />

                        {/* Bulk actions */}
                        <MechBulkActions selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} />

                        {/* Show total */}
                        <Box sx={{ backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
                            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                {displayMechs?.length || 0} ITEMS
                            </Typography>
                        </Box>

                        {/* Page layout options */}
                        <NiceButtonGroup
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.text}
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
                            options={sortOptions}
                            selected={sort}
                            onSelected={(value) => setSort(`${value}`)}
                            sx={{ minWidth: "26rem" }}
                        />
                    </Stack>

                    <Box sx={{ flex: 1, overflowY: "auto" }}>{content}</Box>
                </Stack>

                <RepairBay open={showRepairBay} />
            </Stack>
        </Stack>
    )
}
