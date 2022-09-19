import { useTheme } from "../../../containers/theme"
import { useBattleLobby } from "../../../containers/battleLobby"
import { Box, Pagination, Stack, Typography } from "@mui/material"
import { BattleLobbyItem } from "./BattleLobbyItem"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "../../Common/PageHeader"
import { colors, fonts } from "../../../theme/theme"
import { ThreeMechsJPG } from "../../../assets"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { SearchBattle } from "../../Replays/BattlesReplays/SearchBattle"
import { ClipThing } from "../../Common/ClipThing"
import { useDebounce, usePagination } from "../../../hooks"
import { SortTypeLabel } from "../../../types/marketplace"
import FlipMove from "react-flip-move"
import { BattleLobby } from "../../../types/battle_queue"
import { FancyButton } from "../../Common/FancyButton"
import { BattleLobbyJoinModal } from "../BattleLobbyJoinModal"

const sortOptionsPending: { label: string; value: string }[] = [
    { label: SortTypeLabel.QueuedAmountHighest, value: SortTypeLabel.QueuedAmountHighest },
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
]

const sortOptionsReady: { label: string; value: string }[] = [
    { label: SortTypeLabel.ReadyTimeOldestFirst, value: SortTypeLabel.ReadyTimeOldestFirst },
    { label: SortTypeLabel.ReadyTimeNewestFirst, value: SortTypeLabel.ReadyTimeNewestFirst },
]

enum filterLobbyStatus {
    Ready = "READY",
    Pending = "PENDING",
}

export const BattleLobbies = () => {
    const theme = useTheme()
    const { battleLobbies } = useBattleLobby()
    const [list, setList] = useState<BattleLobby[]>([])
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const { page, changePage, changePageSize, totalItems, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    // Search, sort, filters
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(SortTypeLabel.QueuedAmountHighest)
    const [sortOptions, setSortOptions] = useState(sortOptionsPending)
    const [lobbyStatus, setLobbyStatus] = useState<filterLobbyStatus>(filterLobbyStatus.Pending)
    const [selectedLobby, setSelectedLobby] = useState<BattleLobby>()

    // Apply filter, sorting and pagination
    useEffect(() => {
        let sorted = [...battleLobbies]

        // filter
        if (searchValue !== "") {
            sorted = sorted.filter((s) => `${s.number}` === searchValue)
        }

        switch (lobbyStatus) {
            case filterLobbyStatus.Ready:
                sorted = sorted.filter((s) => !!s.ready_at)
                break
            case filterLobbyStatus.Pending:
                sorted = sorted.filter((s) => !s.ready_at)
                break
        }

        // set total after filtered
        setTotalItems(sorted.length)

        // sorting
        switch (sort) {
            case SortTypeLabel.CreateTimeNewestFirst:
                sorted = sorted.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                break
            case SortTypeLabel.CreateTimeOldestFirst:
                sorted = sorted.sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
                break
            case SortTypeLabel.QueuedAmountHighest:
                sorted = sorted.sort((a, b) => (a.battle_lobbies_mechs.length > b.battle_lobbies_mechs.length ? -1 : 1))
                break
            case SortTypeLabel.ReadyTimeNewestFirst:
                sorted = sorted.sort((a, b) => (!!a.ready_at && !!b.ready_at && a.ready_at > b.ready_at ? -1 : 1))
                break
            case SortTypeLabel.ReadyTimeOldestFirst:
                sorted = sorted.sort((a, b) => (!!a.ready_at && !!b.ready_at && a.ready_at < b.ready_at ? -1 : 1))
                break
        }

        // pagination
        sorted = sorted.slice((page - 1) * pageSize, page * pageSize)

        setList(sorted)
    }, [sort, setList, battleLobbies, searchValue, lobbyStatus, page, pageSize, setTotalItems])

    const content = useMemo(() => {
        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <FlipMove>
                    {list.map((battleLobby) => {
                        return (
                            <div
                                key={`repair-job-${battleLobby.id}`}
                                style={{ marginBottom: "1.3rem", cursor: battleLobby.ready_at ? "default" : "pointer" }}
                                onClick={() => {
                                    if (battleLobby.ready_at) return
                                    setSelectedLobby(battleLobby)
                                }}
                            >
                                <BattleLobbyItem battleLobby={battleLobby} />
                            </div>
                        )
                    })}
                </FlipMove>
            </Box>
        )
    }, [list])

    return (
        <>
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
                                    BATTLE LOBBIES
                                </Typography>
                            }
                            description={<Typography sx={{ fontSize: "1.85rem" }}>Join lobby to enter battles.</Typography>}
                            imageUrl={ThreeMechsJPG}
                        />

                        <TotalAndPageSizeOptions
                            countItems={list.length}
                            totalItems={totalItems}
                            sortOptions={sortOptions}
                            selectedSort={sort}
                            pageSizeOptions={[10, 20, 40]}
                            onSetSort={setSort}
                            pageSize={pageSize}
                            changePageSize={changePageSize}
                            changePage={changePage}
                        />

                        <Stack
                            spacing="2.6rem"
                            direction="row"
                            alignItems="center"
                            sx={{ p: ".8rem 1.8rem", borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid` }}
                        >
                            {/* Search */}
                            <Stack spacing="1rem" direction="row" alignItems="center">
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    SEARCH:
                                </Typography>
                                <SearchBattle placeholder="Lobby Number" searchValueInstant={searchValueInstant} setSearchValue={setSearchValue} />
                            </Stack>

                            {/* Filter */}
                            <Stack spacing="1rem" direction="row" alignItems="center">
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    FILTER:
                                </Typography>
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "6px",
                                        backgroundColor: lobbyStatus === filterLobbyStatus.Ready ? theme.factionTheme.primary : theme.factionTheme.background,
                                        opacity: 1,
                                        border: { borderColor: theme.factionTheme.primary, borderThickness: "1.5px" },
                                        sx: { position: "relative" },
                                    }}
                                    sx={{ px: "3rem", py: ".4rem", color: theme.factionTheme.secondary, flexWrap: 0, whiteSpace: "nowrap" }}
                                    onClick={() => {
                                        setLobbyStatus(filterLobbyStatus.Ready)
                                        setSortOptions(sortOptionsReady)
                                        setSort(SortTypeLabel.ReadyTimeOldestFirst)
                                    }}
                                >
                                    <Stack justifyContent="center" sx={{ height: "100%" }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: fonts.nostromoBlack,
                                                color: lobbyStatus === filterLobbyStatus.Ready ? theme.factionTheme.secondary : colors.offWhite,
                                            }}
                                        >
                                            READY
                                        </Typography>
                                    </Stack>
                                </FancyButton>
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "6px",
                                        backgroundColor: lobbyStatus === filterLobbyStatus.Pending ? theme.factionTheme.primary : theme.factionTheme.background,
                                        opacity: 1,
                                        border: { borderColor: theme.factionTheme.primary, borderThickness: "1.5px" },
                                        sx: { position: "relative" },
                                    }}
                                    sx={{ px: "3rem", py: ".4rem", color: theme.factionTheme.secondary, flexWrap: 0, whiteSpace: "nowrap" }}
                                    onClick={() => {
                                        setLobbyStatus(filterLobbyStatus.Pending)
                                        setSortOptions(sortOptionsPending)
                                        setSort(SortTypeLabel.QueuedAmountHighest)
                                    }}
                                >
                                    <Stack justifyContent="center" sx={{ height: "100%" }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: fonts.nostromoBlack,
                                                color: lobbyStatus === filterLobbyStatus.Pending ? theme.factionTheme.secondary : colors.offWhite,
                                            }}
                                        >
                                            PENDING
                                        </Typography>
                                    </Stack>
                                </FancyButton>
                            </Stack>

                            <Box sx={{ flex: 1 }} />
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
                                    mt: "auto",
                                    px: "1rem",
                                    py: ".7rem",
                                    borderTop: `${primaryColor}70 1.5px solid`,
                                    borderBottom: `${primaryColor}70 1.5px solid`,
                                    backgroundColor: "#00000070",
                                }}
                            >
                                <Pagination
                                    size="small"
                                    count={totalPages}
                                    page={page}
                                    sx={{
                                        ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold, fontSize: "1.2rem" },
                                        ".Mui-selected": {
                                            color: secondaryColor,
                                            backgroundColor: `${primaryColor} !important`,
                                        },
                                    }}
                                    onChange={(e, p) => changePage(p)}
                                />
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </ClipThing>

            {selectedLobby && !selectedLobby.ready_at && <BattleLobbyJoinModal selectedBattleLobby={selectedLobby} setSelectedBattleLobby={setSelectedLobby} />}
        </>
    )
}
