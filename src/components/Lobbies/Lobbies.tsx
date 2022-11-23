import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgPlus, SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { snakeToTitle } from "../../helpers"
import { useDebounce, useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { BattleLobby } from "../../types/battle_queue"
import { SortTypeLabel } from "../../types/marketplace"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { NiceTextField } from "../Common/Nice/NiceTextField"
import { VirtualizedGrid } from "../Common/VirtualizedGrid"
import { CentralQueue } from "./CentralQueue/CentralQueue"
import { LobbyItem } from "./LobbyItem/LobbyItem"

enum LobbyTabs {
    SystemLobbies = "SYSTEM_LOBBIES",
    ExhibitionLobbies = "EXHIBITION_LOBBIES",
}

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
}

const sortOptions = [
    { label: SortTypeLabel.QueuedAmountHighest, value: SortTypeLabel.QueuedAmountHighest },
    { label: SortTypeLabel.QueuedAmountLowest, value: SortTypeLabel.QueuedAmountLowest },
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
]

export const Lobbies = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()

    // Nav tabs at the top
    const [activeTabID, setActiveTabID] = useState<LobbyTabs | undefined>(LobbyTabs.SystemLobbies)
    const tabs = useMemo(() => Object.values(LobbyTabs).map((t) => ({ id: t, label: snakeToTitle(t) })), [])

    const prevTab = useCallback(
        (_activeTabID: string) => {
            // If main menu modal is open, then ignore key events
            if (document.getElementById("main-menu-modal")) return
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = curIndex - 1 < 0 ? tabs.length - 1 : curIndex - 1
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    const nextTab = useCallback(
        (_activeTabID: string) => {
            // If main menu modal is open, then ignore key events
            if (document.getElementById("main-menu-modal")) return
            const curIndex = tabs.findIndex((routeGroup) => routeGroup.id === _activeTabID)
            const newIndex = (curIndex + 1) % tabs.length
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    // Filter, search
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.QueuedAmountHighest)

    // Items
    const [displayLobbies, setDisplayLobbies] = useState<BattleLobby[]>([])
    const [lobbies, setLobbies] = useState<BattleLobby[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useGameServerSubscriptionFaction<BattleLobby[]>(
        {
            URI: `/battle_lobbies`,
            key: GameServerKeys.SubBattleLobbyListUpdate,
        },
        (payload) => {
            setTimeout(() => setIsLoading(false), 750)

            if (!payload) return

            setLobbies((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((lobby) => payload.find((p) => p.id === lobby.id) || lobby)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((lobby) => lobby.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                // remove any finished lobby
                return list
            })
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        if (isLoading) return

        let filteredLobbies = [...lobbies].filter((lobby) => !lobby.ended_at && !lobby.deleted_at)

        // Filter for the system or exhibition lobbies
        switch (activeTabID) {
            case LobbyTabs.ExhibitionLobbies:
                filteredLobbies = filteredLobbies.filter((lobby) => !lobby.generated_by_system)
                break
            case LobbyTabs.SystemLobbies:
                filteredLobbies = filteredLobbies.filter((lobby) => lobby.generated_by_system)
                break
        }

        let result = [...filteredLobbies]

        // Apply search
        if (search) {
            result = result.filter((lobby) => `${lobby.name.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.QueuedAmountHighest:
                result = result.sort((a, b) => (a.battle_lobbies_mechs.length < b.battle_lobbies_mechs.length ? 1 : -1))
                break
            case SortTypeLabel.QueuedAmountLowest:
                result = result.sort((a, b) => (a.battle_lobbies_mechs.length > b.battle_lobbies_mechs.length ? 1 : -1))
                break
            case SortTypeLabel.CreateTimeNewestFirst:
                result = result.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                break
            case SortTypeLabel.CreateTimeOldestFirst:
                result = result.sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
        })

        setDisplayLobbies(result)
    }, [activeTabID, isLoading, lobbies, search, sort, updateQuery])

    const renderIndex = useCallback(
        (index) => {
            const lobby = displayLobbies[index]
            if (!lobby) {
                return null
            }
            return <LobbyItem key={`lobby-${lobby.id}`} lobby={lobby} />
        },
        [displayLobbies],
    )

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displayLobbies && displayLobbies.length > 0) {
            return (
                <VirtualizedGrid
                    uniqueID="lobbyList"
                    itemWidthConfig={{ columnCount: 1 }}
                    itemHeight={39.5}
                    totalItems={displayLobbies.length}
                    gap={1.6}
                    renderIndex={renderIndex}
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
    }, [displayLobbies, isLoading, renderIndex, theme.factionTheme.primary])

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
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} width="28rem" />

            <Stack direction="row" alignItems="stretch" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                <CentralQueue lobbies={lobbies} />

                <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                    {/* Search, sort, grid view, and other top buttons */}
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                        {/* Create lobby button */}
                        <NiceButton corners buttonColor={colors.green} sx={{ p: ".2rem 1rem", pt: ".4rem" }}>
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                                <SvgPlus inline size="1.2rem" /> CREATE LOBBY
                            </Typography>
                        </NiceButton>

                        {/* Access code button */}
                        <NiceButton corners buttonColor={theme.factionTheme.primary} sx={{ p: ".2rem 1rem", pt: ".4rem" }}>
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                                Access Code
                            </Typography>
                        </NiceButton>

                        <Box flex={1} />

                        {/* Show total */}
                        <Box sx={{ backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", p: ".2rem 1rem" }}>
                            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                {displayLobbies?.length || 0} ITEMS
                            </Typography>
                        </Box>

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

                    <Box sx={{ flex: 1, height: "100%", overflowY: "auto", pr: ".8rem" }}>{content}</Box>
                </Stack>
            </Stack>
        </Stack>
    )
}
