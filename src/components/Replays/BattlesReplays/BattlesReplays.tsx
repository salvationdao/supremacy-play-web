import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
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
    const [selectedGID, setSelectedGID] = useState(parseString(query.get("selectedGID"), -1))
    const { send } = useGameServerCommands("/public/commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [battleReplays, setBattleReplays] = useState<BattleReplay[]>([])

    // Search, sort, filters
    const [selectedArenaType, setSelectedArenaType] = useState<Arena>()
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(SortTypeLabel.DateAddedNewest)

    // Pagination
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: 15,
        page: 1,
    })

    useEffect(() => {
        updateQuery.current({
            selectedGID: selectedGID > 0 ? `${selectedGID}` : "",
        })
    }, [selectedGID, updateQuery])

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

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = SortDir.Asc
            if (sort === SortTypeLabel.DateAddedNewest) sortDir = SortDir.Desc

            const resp = await send<GetReplaysResponse, GetReplaysRequest>(GameServerKeys.GetReplays, {
                sort: { direction: sortDir },
                search: searchValue,
                page,
                page_size: pageSize,
                arena_id: selectedArenaType?.id || "",
            })

            if (!resp) return
            setLoadError(undefined)
            setBattleReplays(resp.battle_replays)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get replays.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [sort, send, searchValue, page, pageSize, selectedArenaType?.id, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

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

        if (!battleReplays || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (battleReplays && battleReplays.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(26rem, 1fr))",
                            gap: "1.3rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {battleReplays.map((battleReplay) => {
                            return <BattleReplayItem key={battleReplay.id} battleReplay={battleReplay} />
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
                            mb: "1rem",
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        There are no replays found.
                    </Typography>

                    <NiceButton
                        route={{
                            to: "/",
                        }}
                        buttonColor={theme.factionTheme.primary}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.text,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO BATTLE ARENA
                        </Typography>
                    </NiceButton>
                </Stack>
            </Stack>
        )
    }, [loadError, battleReplays, isLoading, theme.factionTheme.primary, theme.factionTheme.text])

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
            <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden", width: "100%" }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    Replays
                </Typography>
                <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
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
                    <Stack justifyContent="center" sx={{ height: "4.3rem", backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
                        <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                            {totalItems || 0} ITEMS
                        </Typography>
                    </Stack>
                    <NiceButtonGroup
                        primaryColor={theme.factionTheme.primary}
                        secondaryColor={theme.factionTheme.text}
                        options={[
                            {
                                label: "15",
                                value: 15,
                            },
                            {
                                label: "25",
                                value: 25,
                            },
                            {
                                label: "35",
                                value: 35,
                            },
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
                        value={searchValueInstant}
                        onChange={(value) => setSearchValue(value)}
                        placeholder="Search..."
                        InputProps={{
                            endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                        }}
                    />
                    {/* Sort */}
                    <NiceSelect label="Sort:" options={sortOptions} selected={sort} onSelected={(value) => setSort(`${value}`)} sx={{ minWidth: "26rem" }} />
                </Stack>
                <Box sx={{ flex: 1, overflowY: "auto" }}>{content}</Box>
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
                    <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                </Box>
            )}
        </Stack>
    )
}
