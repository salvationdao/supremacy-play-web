import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { useDebounce, usePagination } from "../../../hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { NewMechStruct } from "../../../types"
import { colors, fonts } from "../../../theme/theme"
import { SearchBattle } from "../../Replays/BattlesReplays/SearchBattle"
import { TotalAndPageSizeOptions } from "../../Common/Deprecated/TotalAndPageSizeOptions"
import { SortTypeLabel } from "../../../types/marketplace"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { getRarityDeets } from "../../../helpers"
import FlipMove from "react-flip-move"
import { BattleLobbyMechQueueCard } from "../BattleLobbyMech/BattleLobbyMechQueueCard"
import { EmptyWarMachinesPNG } from "../../../assets"
import { QueueDetails } from "../BattleLobbyMech/QueueDetails"
import { FancyButton } from "../../Common/Deprecated/FancyButton"
import { BattleLobby, PlayerQueueStatus } from "../../../types/battle_queue"
import { useAuth } from "../../../containers"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

interface MechSelectorProps {
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
    battleLobby?: BattleLobby
    keepOnSelect?: boolean
}

export const MechSelector = ({ selectedMechs, setSelectedMechs, battleLobby, keepOnSelect }: MechSelectorProps) => {
    const { factionTheme } = useTheme()
    const { userID, factionID } = useAuth()
    const [searchValue, setSearchValue, searchValueInstant] = useDebounce("", 300)
    const [list, setList] = useState<NewMechStruct[]>([])

    const [showStakedMechs, setShowStakedMechs] = useState(false)

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

    const { page, changePage, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    const [sort, setSort] = useState<string>(SortTypeLabel.RarestDesc)

    // return true, if a mech has equipped a power core and more than one weapon
    const queueable = useCallback((lb: NewMechStruct): boolean => {
        // check power core
        if (!lb.power_core) return false

        // check weapon count
        let hasWeapon = false
        lb.weapon_slots?.forEach((ws) => {
            // skip, if already has weapon
            if (hasWeapon) return

            // check whether the mech has weapon equipped
            hasWeapon = !!ws.weapon
        })

        return hasWeapon
    }, [])

    const [factionStakedMechs, setFactionStakedMechs] = useState<NewMechStruct[]>([])
    useGameServerSubscriptionFaction<NewMechStruct[]>(
        {
            URI: "/staked_mechs",
            key: GameServerKeys.SubFactionStakedMechs,
        },
        (payload) => {
            if (!payload) return
            setFactionStakedMechs((fsm) => {
                if (fsm.length === 0) {
                    return payload.filter((p) => p.is_staked && p.can_deploy && queueable(p))
                }

                // replace current list
                const list = fsm.map((mq) => payload.find((p) => p.id === mq.id) || mq)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((mq) => mq.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((p) => p.is_staked && p.can_deploy && queueable(p))
            })
        },
    )

    const [ownedMechs, setOwnedMechs] = useState<NewMechStruct[]>([])
    useGameServerSubscriptionSecuredUser<NewMechStruct[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerQueueableMechs,
        },
        (payload) => {
            if (!payload) return

            setOwnedMechs((mqs) => {
                if (mqs.length === 0) {
                    return payload.filter((p) => !p.is_staked && p.can_deploy && queueable(p))
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

                return list.filter((p) => !p.is_staked && p.can_deploy && queueable(p))
            })
        },
    )

    useEffect(() => {
        let result = [...ownedMechs]
        if (showStakedMechs) {
            result = [...factionStakedMechs]
        }

        result = result.filter((r) => !selectedMechs.some((m) => m.id === r.id))

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
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
        }

        // pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)

        if (keepOnSelect) {
            // show selected mechs on the top of the list
            result.unshift(...selectedMechs)
        }

        setList(result)
    }, [ownedMechs, factionStakedMechs, showStakedMechs, sort, page, pageSize, setTotalItems, searchValue, selectedMechs, keepOnSelect])

    const [playerQueueLimit, setPlayerQueueLimit] = useState({
        queue_limit: 3,
        total_queued: 0,
    })
    useEffect(() => {
        let slotLeft = 3 // slot left on each faction
        let queueLimit = 3 // max amount of mechs a player can deploy in the lobby
        if (battleLobby) {
            slotLeft = battleLobby.each_faction_mech_amount - battleLobby.battle_lobbies_mechs.filter((m) => m.faction_id === factionID).length
            queueLimit = battleLobby.max_deploy_per_player - battleLobby.battle_lobbies_mechs.filter((m) => m.queued_by?.id === userID).length
        }
        const playerQueueRemain = currentPlayerQueue.queue_limit - currentPlayerQueue.total_queued

        setPlayerQueueLimit((prev) => ({ ...prev, queue_limit: Math.min(slotLeft, queueLimit, playerQueueRemain) }))
    }, [battleLobby, currentPlayerQueue, userID, factionID])

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
                                                toggleIsSelected={() => {
                                                    setSelectedMechs((prev) => {
                                                        // remove, if exists
                                                        if (prev.some((sm) => sm.id === mech.id)) {
                                                            setPlayerQueueLimit((cpq) => ({ ...cpq, total_queued: cpq.total_queued - 1 }))
                                                            return prev.filter((sm) => sm.id !== mech.id)
                                                        }

                                                        // return prev stat, if already reach queue limit
                                                        if (playerQueueLimit.queue_limit <= prev.length) {
                                                            return prev
                                                        }

                                                        setPlayerQueueLimit((cpq) => ({ ...cpq, total_queued: cpq.total_queued + 1 }))

                                                        // otherwise, append
                                                        return prev.concat(mech)
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
    }, [list, selectedMechs, setSelectedMechs, playerQueueLimit])

    return (
        <Stack flex={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <QueueDetails playerQueueStatus={playerQueueLimit} />

                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        clipSlantSize: "0px",
                        corners: {
                            topLeft: true,
                            topRight: true,
                            bottomLeft: true,
                            bottomRight: true,
                        },
                        backgroundColor: showStakedMechs ? factionTheme.primary : factionTheme.background,
                        opacity: 1,
                        border: { isFancy: true, borderColor: factionTheme.primary, borderThickness: "2px" },
                        sx: { position: "relative", px: ".4rem", py: ".5rem", minWidth: "18rem" },
                    }}
                    sx={{ color: factionTheme.primary, p: 0, height: "100%" }}
                    onClick={() => {
                        setShowStakedMechs((prev) => !prev)
                        changePage(1)
                    }}
                >
                    <Typography variant="body2" fontFamily={fonts.nostromoHeavy} color={showStakedMechs ? factionTheme.secondary : factionTheme.primary}>
                        Staked Mechs
                    </Typography>
                </FancyButton>
            </Stack>
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
                    <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                </Box>
            )}
        </Stack>
    )
}
