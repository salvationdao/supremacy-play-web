import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, ThreeMechsJPG } from "../../../assets"
import { useArena } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { useDebounce, usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Arena, BattleReplay } from "../../../types"
import { SortDir, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { ArenaTypeSelect } from "./ArenaTypeSelect"
import { BattleReplayDetails } from "./BattleReplayDetails/BattleReplayDetails"
import { BattleReplayItem } from "./BattleReplayItem"
import { SearchBattle } from "./SearchBattle"

interface GetReplaysRequest {
    sort?: {
        table?: string
        column?: string
        direction: SortDir
    }
    search: string
    page: number
    page_size: number
    arena_id: string
}

interface GetReplaysResponse {
    battle_replays: BattleReplay[]
    total: number
}

const sortOptions = [
    { label: SortTypeLabel.DateAddedNewest, value: SortTypeLabel.DateAddedNewest },
    { label: SortTypeLabel.DateAddedOldest, value: SortTypeLabel.DateAddedOldest },
    { label: SortTypeLabel.MostViewed, value: SortTypeLabel.MostViewed },
]

export const BattlesReplays = () => {
    const [query, updateQuery] = useUrlQuery()
    const [gid, setGID] = useState(parseString(query.get("gid"), -1))
    const [battleNumber, setBattleNumber] = useState(parseString(query.get("battleNumber"), -1))

    useEffect(() => {
        updateQuery({
            gid: gid ? `${gid}` : "",
            battleNumber: battleNumber ? `${battleNumber}` : "",
        })
    }, [gid, battleNumber, updateQuery])

    if (gid > 0 && battleNumber > 0) return <BattleReplayDetails gid={gid} battleNumber={battleNumber} setBattleNumber={setBattleNumber} />

    return <BattlesReplaysInner gid={gid} setGID={setGID} setBattleNumber={setBattleNumber} />
}

const BattlesReplaysInner = ({
    gid,
    setGID,
    setBattleNumber,
}: {
    gid: number
    setGID: React.Dispatch<React.SetStateAction<number>>
    setBattleNumber: React.Dispatch<React.SetStateAction<number>>
}) => {
    const theme = useTheme()
    const { arenaList } = useArena()
    const { send } = useGameServerCommands("/public/commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [replays, setReplays] = useState<BattleReplay[]>([])

    // Search, sort, filters
    const [selectedArenaType, setSelectedArenaType] = useState<Arena>()
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(SortTypeLabel.DateAddedNewest)

    // Pagination
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    useEffect(() => {
        const defaultArena = arenaList.find((arena) => arena.gid === gid)
        setGID(defaultArena?.gid || -1)
        setSelectedArenaType(defaultArena)
    }, [arenaList, gid, setGID])

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
            setReplays(resp.battle_replays)
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

    const onChangeArenaType = useCallback(
        (arena: Arena | undefined) => {
            if (arena) setGID(arena.gid)
            setSelectedArenaType(arena)
        },
        [setGID],
    )

    const onItemClick = useCallback(
        (gid: number, battleNumber: number) => {
            setGID(gid)
            setBattleNumber(battleNumber)
        },
        [setBattleNumber, setGID],
    )

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

        if (!replays || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (replays && replays.length > 0) {
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
                        {replays.map((replay) => {
                            return <BattleReplayItem key={replay.id} battleReplay={replay} onItemClick={onItemClick} />
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
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        {"There are no replays found."}
                    </Typography>

                    <FancyButton
                        to={`/`}
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
                            GO TO BATTLE ARENA
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [loadError, replays, isLoading, theme.factionTheme.primary, theme.factionTheme.secondary, onItemClick])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.9}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <PageHeader
                        title={
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                BATTLE REPLAYS
                            </Typography>
                        }
                        description={<Typography sx={{ fontSize: "1.85rem" }}>Share epic moments and learn strategies behind the battles.</Typography>}
                        imageUrl={ThreeMechsJPG}
                    ></PageHeader>

                    <TotalAndPageSizeOptions
                        countItems={replays?.length}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        pageSizeOptions={[10, 20, 30]}
                        changePage={changePage}
                        manualRefresh={getItems}
                        sortOptions={sortOptions}
                        selectedSort={sort}
                        onSetSort={setSort}
                    />

                    <Stack
                        spacing="2.6rem"
                        direction="row"
                        alignItems="center"
                        sx={{ p: ".8rem 1.8rem", borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid` }}
                    >
                        <Stack spacing="1rem" direction="row" alignItems="center">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                SEARCH:
                            </Typography>
                            <SearchBattle searchValueInstant={searchValueInstant} setSearchValue={setSearchValue} />
                        </Stack>

                        <Box sx={{ flex: 1 }} />

                        <Stack spacing="1rem" direction="row" alignItems="center">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                BATTLE MODE:
                            </Typography>
                            <ArenaTypeSelect arenaTypeOptions={arenaList} selectedArenaType={selectedArenaType} onChangeArenaType={onChangeArenaType} />
                        </Stack>
                    </Stack>

                    <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
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

                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {content}
                        </Box>
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
            </Stack>
        </ClipThing>
    )
}
