import { BattleLobby } from "../../types/battle_queue"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ConfirmModal } from "../Common/ConfirmModal"
import { Box, Pagination, Stack, Typography } from "@mui/material"
import { QuickDeployItem } from "../LeftDrawer/QuickDeploy/QuickDeployItem"
import { GameServerKeys } from "../../keys"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { QueueDetails } from "../LeftDrawer/QuickDeploy/QueueDetails"
import { MechBasicWithQueueStatus } from "../../types"
import { usePagination } from "../../hooks"
import { getRarityDeets } from "../../helpers"
import { SortTypeLabel } from "../../types/marketplace"
import { TotalAndPageSizeOptions } from "../Common/TotalAndPageSizeOptions"
import { colors, fonts } from "../../theme/theme"
import { useTheme } from "../../containers/theme"
import FlipMove from "react-flip-move"
import { SearchBattle } from "../Replays/BattlesReplays/SearchBattle"
import { PlayerQueueStatus } from "../LeftDrawer/QuickDeploy/QuickDeploy"
import { EmptyWarMachinesPNG } from "../../assets"
import { FancyButton } from "../Common/FancyButton"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

interface BattleLobbyJoinModalProps {
    selectedBattleLobby?: BattleLobby
    setSelectedBattleLobby: (value: BattleLobby | undefined) => void
}

export const BattleLobbyJoinModal = ({ selectedBattleLobby, setSelectedBattleLobby }: BattleLobbyJoinModalProps) => {
    const { factionTheme } = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [error, setError] = useState("")
    const [selectedMechIDs, setSelectedMechIDs] = useState<string[]>([])
    useEffect(() => {
        if (!selectedBattleLobby) setSelectedMechIDs([])
    }, [setSelectedMechIDs, selectedBattleLobby])

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

    const [mechsWithQueueStatus, setMechsWithQueueStatus] = useState<MechBasicWithQueueStatus[]>([])
    useGameServerSubscriptionSecuredUser<MechBasicWithQueueStatus[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerMechsBrief,
        },
        (payload) => {
            if (!payload) return

            setMechsWithQueueStatus((mqs) => {
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

    console.log(mechsWithQueueStatus)

    const [list, setList] = useState<MechBasicWithQueueStatus[]>([])
    const { page, changePage, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    const selectLimit = useMemo(() => {
        let queueLimit = 0
        if (selectedBattleLobby) queueLimit = selectedBattleLobby.each_faction_mech_amount - selectedBattleLobby.battle_lobbies_mechs.length
        const playerQueueRemain = currentPlayerQueue.queue_limit - currentPlayerQueue.total_queued

        let limit = queueLimit
        if (queueLimit > playerQueueRemain) {
            limit = playerQueueRemain
        }
        return limit
    }, [currentPlayerQueue, selectedBattleLobby])

    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(SortTypeLabel.RarestDesc)

    useEffect(() => {
        let result = [...mechsWithQueueStatus]
        let selectedMechs = result.filter((r) => selectedMechIDs.includes(r.id))

        // filter
        if (search) {
            result = result.filter((r) => `${r.label.toLowerCase()} ${r.name.toLowerCase()}`.includes(search.toLowerCase()))
        }

        setTotalItems(result.length)

        // sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.name}${a.label}`.localeCompare(`${b.name}${b.label}`))
                selectedMechs = selectedMechs.sort((a, b) => `${a.name}${a.label}`.localeCompare(`${b.name}${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.name}${b.label}`.localeCompare(`${a.name}${a.label}`))
                selectedMechs = selectedMechs.sort((a, b) => `${b.name}${b.label}`.localeCompare(`${a.name}${a.label}`))
                break
            case SortTypeLabel.RarestAsc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                selectedMechs = selectedMechs.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                selectedMechs = selectedMechs.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
        }

        // pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)

        // shift selected mech to the top
        result = selectedMechs.concat(...result.filter((r) => !selectedMechIDs.includes(r.id))).slice(0, pageSize)

        setList(result)
    }, [mechsWithQueueStatus, search, sort, page, pageSize, setTotalItems, selectedMechIDs])

    const joinBattleLobby = useCallback(
        async (battleLobbyID: string, mechIDs: string[], password?: string) => {
            try {
                await send(GameServerKeys.JoinBattleLobby, {
                    battle_lobby_id: battleLobbyID,
                    mech_ids: mechIDs,
                    password,
                })
                setSelectedBattleLobby(undefined)
            } catch (err) {
                setError(typeof err === "string" ? err : "Failed to the join battle lobby.")
            }
        },
        [send, setSelectedBattleLobby],
    )

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
                                width: "1rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: (theme) => theme.factionTheme.primary,
                            },
                        }}
                    >
                        <Box sx={{ direction: "ltr", height: "60vh" }}>
                            <FlipMove>
                                {list.map((mech) => {
                                    return (
                                        <div key={`mech-id-${mech.id}`} style={{ marginBottom: "1.3rem", cursor: "pointer" }}>
                                            <QuickDeployItem
                                                key={mech.id}
                                                isSelected={selectedMechIDs.includes(mech.id)}
                                                toggleIsSelected={() => {
                                                    setSelectedMechIDs((prev) => {
                                                        // remove, if exists
                                                        if (prev.includes(mech.id)) {
                                                            setCurrentPlayerQueue((cpq) => ({ ...cpq, total_queued: cpq.total_queued - 1 }))
                                                            return prev.filter((id) => id !== mech.id)
                                                        }

                                                        // return prev stat, if already reach queue limit
                                                        if (selectLimit <= prev.length) {
                                                            return prev
                                                        }

                                                        setCurrentPlayerQueue((cpq) => ({ ...cpq, total_queued: cpq.total_queued + 1 }))

                                                        // otherwise, append
                                                        return prev.concat(mech.id)
                                                    })
                                                }}
                                                mech={mech}
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
            <Stack alignItems="center" justifyContent="center" sx={{ height: "60vh", width: "100%" }}>
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
    }, [list, selectLimit, selectedMechIDs])

    if (!selectedBattleLobby || !!selectedBattleLobby?.ready_at) {
        return null
    }

    // filter
    return (
        <ConfirmModal
            title={`JOIN BATTLE LOBBY #${selectedBattleLobby.number}`}
            disableConfirm={!selectedMechIDs.length}
            onConfirm={() => joinBattleLobby(selectedBattleLobby?.id || "", selectedMechIDs)}
            onClose={() => setSelectedBattleLobby(undefined)}
            isLoading={false}
            error={error}
            width="75rem"
        >
            <QueueDetails playerQueueStatus={currentPlayerQueue} />
            <TotalAndPageSizeOptions
                pageSize={pageSize}
                changePageSize={changePageSize}
                pageSizeOptions={[10, 20, 30]}
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
                    <SearchBattle searchValueInstant={search} setSearchValue={setSearch} />
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
        </ConfirmModal>
    )
}
