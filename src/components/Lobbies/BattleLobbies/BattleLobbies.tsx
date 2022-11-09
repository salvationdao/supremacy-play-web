import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { ThreeMechsJPG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useDebounce, usePagination } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { SortTypeLabel } from "../../../types/marketplace"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../Common/Deprecated/FancyButton"
import { PageHeader } from "../../Common/Deprecated/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/Deprecated/TotalAndPageSizeOptions"
import { SearchBattle } from "../../Replays/BattlesReplays/SearchBattle"
import { BattleLobbyAccessCodeModal } from "./BattleLobbyAccessCodeModal"
import { BattleLobbyCreateModal } from "./BattleLobbyCreate/BattleLobbyCreateModal"
import { BattleLobbyItem } from "./BattleLobbyItem"
import { BattleLobbySingleModal } from "./BattleLobbySingleModal"

const sortOptionsPending: { label: string; value: string }[] = [
    { label: SortTypeLabel.QueuedAmountHighest, value: SortTypeLabel.QueuedAmountHighest },
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
]

const sortOptionsReady: { label: string; value: string }[] = [
    { label: SortTypeLabel.ReadyTimeOldestFirst, value: SortTypeLabel.ReadyTimeOldestFirst },
    { label: SortTypeLabel.ReadyTimeNewestFirst, value: SortTypeLabel.ReadyTimeNewestFirst },
]

export enum LobbyStatusEnum {
    Ready = "READY",
    Pending = "PENDING",
}

export enum LobbyType {
    System = "SYSTEM",
    Exhibition = "EXHIBITION",
}

interface BattleLobbiesProps {
    lobbyStatus: LobbyStatusEnum
    battleLobbies: BattleLobby[]
}

export const BattleLobbies = ({ lobbyStatus, battleLobbies }: BattleLobbiesProps) => {
    const theme = useTheme()

    const [list, setList] = useState<BattleLobby[]>([])
    const primaryColor = theme.factionTheme.primary

    const [openNewLobbyModal, setOpenNewLobbyModal] = useState(false)
    const [openPrivateRoom, setOpenPrivateRoom] = useState(false)
    const [accessCode, setAccessCode] = useState("")

    const [selectedLobbyType, setSelectedLobbyType] = useState(LobbyType.System)

    const { page, changePage, changePageSize, totalItems, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    // Search, sort, filters
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(
        (() => {
            switch (lobbyStatus) {
                case LobbyStatusEnum.Pending:
                    return SortTypeLabel.QueuedAmountHighest
                case LobbyStatusEnum.Ready:
                    return SortTypeLabel.ReadyTimeOldestFirst
                default:
                    return SortTypeLabel.QueuedAmountHighest
            }
        })(),
    )
    const sortOptions = useMemo(() => {
        switch (lobbyStatus) {
            case LobbyStatusEnum.Pending:
                return sortOptionsPending
            case LobbyStatusEnum.Ready:
                return sortOptionsReady
            default:
                return sortOptionsPending
        }
    }, [lobbyStatus])

    // Apply filter, sorting and pagination
    useEffect(() => {
        let sorted = [...battleLobbies]

        // filter
        if (searchValue !== "") {
            sorted = sorted.filter((s) => `${s.name}`.toLowerCase().includes(searchValue.toLowerCase()))
        }

        switch (lobbyStatus) {
            case LobbyStatusEnum.Ready:
                sorted = sorted.filter((s) => !!s.ready_at)
                break
            case LobbyStatusEnum.Pending:
                sorted = sorted.filter((s) => !s.ready_at)
                break
        }

        switch (selectedLobbyType) {
            case LobbyType.System:
                sorted = sorted.filter((s) => s.generated_by_system)
                break
            case LobbyType.Exhibition:
                sorted = sorted.filter((s) => !s.generated_by_system)
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

        if (lobbyStatus === LobbyStatusEnum.Ready) {
            sorted = sorted.sort((a, b) => (a.assigned_to_arena_id && !b.assigned_to_arena_id ? -1 : 1))
        }

        // pagination
        sorted = sorted.slice((page - 1) * pageSize, page * pageSize)

        setList(sorted)
    }, [sort, setList, battleLobbies, searchValue, lobbyStatus, page, pageSize, setTotalItems, selectedLobbyType])

    const content = useMemo(() => {
        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <FlipMove>
                    {list.map((battleLobby) => {
                        return (
                            <Box
                                key={`battle-lobby-${battleLobby.id}`}
                                sx={{
                                    "&:not(:last-child)": {
                                        mb: "1.5rem",
                                    },
                                }}
                            >
                                <BattleLobbyItem battleLobby={battleLobby} />
                            </Box>
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
                    topLeft: true,
                    bottomRight: true,
                    bottomLeft: true,
                }}
                opacity={0.9}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <Stack sx={{ flex: 1 }}>
                        <PageHeader title={null} description={null} imageUrl={ThreeMechsJPG}>
                            <Stack spacing={1} flex={1} direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: "1rem" }}>
                                <Stack
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                        setSelectedLobbyType((prev) => {
                                            switch (prev) {
                                                case LobbyType.System:
                                                    return LobbyType.Exhibition
                                                case LobbyType.Exhibition:
                                                    return LobbyType.System
                                            }
                                        })
                                    }
                                >
                                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        {selectedLobbyType === LobbyType.System ? "SYSTEM" : "EXHIBITION"} LOBBIES
                                    </Typography>
                                    <Typography sx={{ fontSize: "1.85rem" }}>Click to switch between system and exhibition lobbies.</Typography>
                                </Stack>

                                <Stack spacing={1} direction="row" alignItems="center">
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "6px",
                                            clipSlantSize: "0px",
                                            backgroundColor: colors.bronze,
                                            border: { borderColor: colors.bronze, borderThickness: "1.5px" },
                                            sx: { position: "relative", minWidth: "10rem" },
                                        }}
                                        sx={{ px: ".6rem", py: ".5rem", color: "#FFFFFF" }}
                                        onClick={() => setOpenNewLobbyModal(true)}
                                    >
                                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                            NEW LOBBY
                                        </Typography>
                                    </FancyButton>

                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "6px",
                                            clipSlantSize: "0px",
                                            backgroundColor: colors.bronze,
                                            border: { borderColor: colors.bronze, borderThickness: "1.5px" },
                                            sx: { position: "relative", minWidth: "10rem" },
                                        }}
                                        sx={{ px: ".6rem", py: ".5rem", color: "#FFFFFF" }}
                                        onClick={() => setOpenPrivateRoom(true)}
                                    >
                                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                            ACCESS CODE
                                        </Typography>
                                    </FancyButton>
                                </Stack>
                            </Stack>
                        </PageHeader>

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
                            justifyContent="space-between"
                            sx={{ p: ".8rem 1.8rem", borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid` }}
                        >
                            {/* Search */}
                            <Stack spacing={1} direction="row" alignItems="center">
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    SEARCH:
                                </Typography>
                                <SearchBattle placeholder="Lobby Name" searchValueInstant={searchValueInstant} setSearchValue={setSearchValue} />
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
                                <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </ClipThing>
            {openNewLobbyModal && <BattleLobbyCreateModal setOpen={setOpenNewLobbyModal} />}
            {!accessCode && openPrivateRoom && <BattleLobbyAccessCodeModal setOpen={setOpenPrivateRoom} setAccessCode={setAccessCode} />}
            {accessCode && <BattleLobbySingleModal setAccessCode={setAccessCode} accessCode={accessCode} />}
        </>
    )
}
