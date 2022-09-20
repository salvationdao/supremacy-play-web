import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecured, useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BattleBounty, BattleLobby } from "../types/battle_queue"
import BigNumber from "bignumber.js"
import { MechBasicWithQueueStatus } from "../types"
import { PlayerQueueStatus } from "../components/LeftDrawer/QuickDeploy/QuickDeploy"
import { FallbackUser } from "./auth"

export interface BattleLobbyState {
    battleLobbies: BattleLobby[]
    nextBattleLobby: BattleLobby
    createBattleLobby: (
        mechIDs: string[],
        entryFee: BigNumber,
        firstFactionCut: number,
        secondFactionCut: number,
        thirdFactionCut: number,
        gameMapID: string,
        password?: string,
    ) => void
    joinBattleLobby: (battleLobbyID: string, mechIDs: string[], password?: string) => void
    leaveBattleLobby: (mechIDs: string[]) => void
    battleETASeconds: number
    battleBounties: BattleBounty[]
    createBattleBounty: (mechID: string, amount: number) => void
    mechsWithQueueStatus: MechBasicWithQueueStatus[]
    playerQueueStatus: PlayerQueueStatus
    reachQueueLimit: boolean
}

const initialState: BattleLobbyState = {
    battleLobbies: [],
    nextBattleLobby: {
        id: "",
        host_by_id: "",
        number: 0,
        entry_fee: "",
        first_faction_cut: "",
        second_faction_cut: "",
        third_faction_cut: "",
        each_faction_mech_amount: 3,
        generated_by_system: true,
        host_by: FallbackUser,
        is_private: true,
        battle_lobbies_mechs: [],
        created_at: new Date(),
    },
    createBattleLobby: (
        mechIDs: string[],
        entryFee: BigNumber,
        firstFactionCut: number,
        secondFactionCut: number,
        thirdFactionCut: number,
        gameMapID: string,
        password?: string,
    ) => {
        // HACK: get around lint
        if (mechIDs && entryFee && firstFactionCut && secondFactionCut && thirdFactionCut && gameMapID && password) return
    },
    joinBattleLobby: (battleLobbyID: string, mechIDs: string[], password?: string) => {
        // HACK: get around lint
        if (battleLobbyID && mechIDs && password) return
    },
    leaveBattleLobby: (mechIDs: string[]) => {
        // HACK: get around lint
        if (mechIDs) return
    },
    battleETASeconds: 300,
    battleBounties: [],
    createBattleBounty: (mechID: string, amount: number) => {
        // HACK: get around lint
        if (mechID && amount) return
    },
    mechsWithQueueStatus: [],
    playerQueueStatus: {
        queue_limit: 10,
        total_queued: 0,
    },
    reachQueueLimit: false,
}

export const BattleLobbyContext = createContext<BattleLobbyState>(initialState)

export const BattleLobbyProvider = ({ children }: { children: ReactNode }) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const createBattleLobby = useCallback(
        async (
            mechIDs: string[], // initial mech
            entryFee: BigNumber, // sups
            firstFactionCut: number,
            secondFactionCut: number,
            thirdFactionCut: number,
            gameMapID: string,
            password?: string,
        ) => {
            try {
                await send(GameServerKeys.CreateBattleLobby, {
                    mech_ids: mechIDs,
                    entry_fee: entryFee,
                    first_faction_cut: firstFactionCut,
                    second_faction_cut: secondFactionCut,
                    third_faction_cut: thirdFactionCut,
                    game_map_id: gameMapID,
                    password,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to opt in battle ability."
                console.error(message)
            }
        },
        [send],
    )

    const joinBattleLobby = useCallback(
        async (battleLobbyID: string, mechIDs: string[], password?: string) => {
            try {
                await send(GameServerKeys.JoinBattleLobby, {
                    battle_lobby_id: battleLobbyID,
                    mech_ids: mechIDs,
                    password,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to opt in battle ability."
                console.error(message)
            }
        },
        [send],
    )

    const leaveBattleLobby = useCallback(
        async (mechIDs: string[]) => {
            try {
                await send(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: mechIDs,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to opt in battle ability."
                console.error(message)
            }
        },
        [send],
    )

    // load battle lobbies
    const [battleLobbies, setBattleLobbies] = useState<BattleLobby[]>(initialState.battleLobbies)
    useGameServerSubscriptionSecured<BattleLobby[]>(
        {
            URI: `/battle_lobbies`,
            key: GameServerKeys.SubBattleLobbyListUpdate,
        },
        (payload) => {
            if (!payload) return
            setBattleLobbies((bls) => {
                if (bls.length === 0) {
                    return payload
                }

                // replace current list
                let list = bls.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                // remove any finished lobby
                list = list.filter((bl) => !bl.ended_at && !bl.deleted_at)

                return list
            })
        },
    )

    const nextBattleLobby = useMemo(() => {
        const readyLobbies = battleLobbies
            .filter((bl) => !!bl.ready_at && !bl.assigned_to_battle_id)
            .sort((a, b) => (a.ready_at && b.ready_at && a.ready_at > b.ready_at ? 1 : -1))
        if (readyLobbies.length > 0) {
            return readyLobbies[0]
        }

        return initialState.nextBattleLobby
    }, [battleLobbies])

    const [battleETASeconds, setBattleETASeconds] = useState<number>(initialState.battleETASeconds)
    useGameServerSubscriptionSecured<number>(
        {
            URI: "/battle_eta",
            key: GameServerKeys.SunBattleETA,
        },
        (payload) => {
            if (!payload) return
            setBattleETASeconds(payload)
        },
    )

    // bounties

    const [battleBounties, setBattleBounties] = useState<BattleBounty[]>(initialState.battleBounties)
    useGameServerSubscriptionSecured<BattleBounty[]>(
        {
            URI: "/battle_bounties",
            key: GameServerKeys.SubBattleBountyListUpdate,
        },
        (payload) => {
            if (!payload) return

            setBattleBounties((bbs) => {
                if (bbs.length === 0) {
                    return payload
                }

                // replace current list
                let list = bbs.map((bb) => payload.find((p) => p.id === bb.id) || bb)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                // remove any closed bounties
                list = list.filter((bb) => !bb.is_closed)

                return list
            })
        },
    )

    const createBattleBounty = useCallback(
        async (mechID: string, amount: number) => {
            try {
                await send(GameServerKeys.CreateBattleBounty, {
                    mech_id: mechID,
                    amount,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to opt in battle ability."
                console.error(message)
            }
        },
        [send],
    )

    const [mechsWithQueueStatus, setMechsWithQueueStatus] = useState<MechBasicWithQueueStatus[]>(initialState.mechsWithQueueStatus)
    useGameServerSubscriptionSecuredUser<MechBasicWithQueueStatus[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerMechsBrief,
        },
        (payload) => {
            if (!payload) return

            setMechsWithQueueStatus((mqs) => {
                if (mqs.length === 0) {
                    return payload
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

                return list
            })
        },
    )

    const [playerQueueStatus, setPlayerQueueStatus] = useState<PlayerQueueStatus>(initialState.playerQueueStatus)
    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setPlayerQueueStatus(payload)

            console.log(payload)
        },
    )

    return (
        <BattleLobbyContext.Provider
            value={{
                battleLobbies,
                nextBattleLobby,
                createBattleLobby,
                joinBattleLobby,
                leaveBattleLobby,
                battleETASeconds,
                battleBounties,
                createBattleBounty,
                mechsWithQueueStatus,
                playerQueueStatus,
                reachQueueLimit: playerQueueStatus.queue_limit === playerQueueStatus.total_queued,
            }}
        >
            {children}
        </BattleLobbyContext.Provider>
    )
}

export const useBattleLobby = () => {
    return useContext<BattleLobbyState>(BattleLobbyContext)
}
