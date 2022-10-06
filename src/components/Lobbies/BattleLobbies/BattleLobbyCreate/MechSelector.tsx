import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { useDebounce, usePagination } from "../../../../hooks"
import { useEffect, useMemo, useState } from "react"
import { LobbyMech } from "../../../../types"
import { colors, fonts } from "../../../../theme/theme"
import { SearchBattle } from "../../../Replays/BattlesReplays/SearchBattle"
import { TotalAndPageSizeOptions } from "../../../Common/TotalAndPageSizeOptions"
import { SortTypeLabel } from "../../../../types/marketplace"
import { useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { getRarityDeets } from "../../../../helpers"
import FlipMove from "react-flip-move"
import { BattleLobbyMechQueueCard } from "../../BattleLobbyMech/BattleLobbyMechQueueCard"
import { EmptyWarMachinesPNG } from "../../../../assets"
import { PlayerQueueStatus } from "../../../../types/battle_queue"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

interface MechSelectorProps {
    selectedMechs: LobbyMech[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<LobbyMech[]>>
}

export const MechSelector = ({ selectedMechs, setSelectedMechs }: MechSelectorProps) => {
    const { factionTheme } = useTheme()
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [list, setList] = useState<LobbyMech[]>([])
    const { page, changePage, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    const [sort, setSort] = useState<string>(SortTypeLabel.RarestDesc)

    const [currentPlayerQueue, setCurrentPlayerQueue] = useState<PlayerQueueStatus>({
        queue_limit: 10,
        total_queued: 0,
    })
    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setCurrentPlayerQueue(payload)
        },
    )

    const [ownedMechs, setOwnedMechs] = useState<LobbyMech[]>([])
    useGameServerSubscriptionSecuredUser<LobbyMech[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerMechsBrief,
        },
        (payload) => {
            if (!payload) return

            setOwnedMechs((mqs) => {
                if (mqs.length === 0) {
                    return payload.filter((p) => p.can_deploy)
                }

                // replace current list
                const list = mqs.map((mq) => payload.find((p) => p.id === mq.id) || mq)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((mq) => mq.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((p) => p.can_deploy)
            })
        },
    )

    useEffect(() => {
        let result = [...ownedMechs].filter((r) => !selectedMechs.some((m) => m.id === r.id))

        // filter
        if (searchValue) {
            result = result.filter((r) => `${r.label.toLowerCase()} ${r.name.toLowerCase()}`.includes(searchValue.toLowerCase()))
        }

        setTotalItems(result.length)

        // sort
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
        }

        // pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)

        setList(result)
    }, [ownedMechs, sort, page, pageSize, setTotalItems, searchValue, selectedMechs])

    const content = useMemo(() => {
        if (list.length > 0) {
            return (
                <>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            my: ".8rem",
                            mr: ".7rem",
                            pr: ".7rem",
                            pl: "1.4rem",
                            direction: "ltr",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".5rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: (theme) => theme.factionTheme.primary,
                            },
                        }}
                    >
                        <Box sx={{ direction: "ltr", maxHeight: 0 }}>
                            <FlipMove>
                                {list.map((mech) => {
                                    return (
                                        <div key={`mech-id-${mech.id}`} style={{ marginBottom: "1.3rem", cursor: "pointer" }}>
                                            <BattleLobbyMechQueueCard
                                                key={mech.id}
                                                isSelected={selectedMechs.some((sm) => sm.id === mech.id)}
                                                mech={mech}
                                                toggleIsSelected={() => setSelectedMechs((prev) => prev.concat(mech))}
                                            />
                                        </div>
                                    )
                                })}
                            </FlipMove>
                        </Box>
                    </Box>
                </>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" flex={1}>
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
                    {"There are no war machines available to deploy."}
                </Typography>
            </Stack>
        )
    }, [list, selectedMechs, setSelectedMechs])

    return (
        <Stack
            flex={1}
            sx={{
                border: `${factionTheme.primary}99 2px solid`,
            }}
        >
            <TotalAndPageSizeOptions
                pageSize={pageSize}
                changePageSize={changePageSize}
                pageSizeOptions={[]}
                changePage={changePage}
                sortOptions={sortOptions}
                selectedSort={sort}
                onSetSort={setSort}
            >
                {/* Search */}
                <Stack direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        SEARCH:
                    </Typography>
                    <SearchBattle searchValueInstant={searchValueInstant} setSearchValue={setSearchValue} />
                </Stack>
            </TotalAndPageSizeOptions>

            {content}

            {totalPages > 1 && (
                <Box
                    sx={{
                        mt: "auto",
                        px: "1rem",
                        py: ".7rem",
                        borderTop: `${factionTheme.primary}70 1.5px solid`,
                        borderBottom: `${factionTheme.primary}70 1.5px solid`,
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
                                color: factionTheme.secondary,
                                backgroundColor: `${factionTheme.primary} !important`,
                            },
                        }}
                        onChange={(e, p) => changePage(p)}
                    />
                </Box>
            )}
        </Stack>
    )
}
