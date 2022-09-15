import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecured } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BattleBounty, BattleLobby } from "../types/battle_queue"
import BigNumber from "bignumber.js"

export interface BattleLobbyState {
    battleLobbies: BattleLobby[]
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
}

const initialState: BattleLobbyState = {
    battleLobbies: [],
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
                let list = bls.map((bl) => {
                    const target = payload.find((p) => p.id === bl.id)
                    if (target) {
                        return target
                    }
                    return bl
                })

                // remove any finished lobby
                list = list.filter((bl) => !bl.ended_at && !bl.deleted_at)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list
            })
        },
    )

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
                let list = bbs.map((bb) => {
                    const target = payload.find((p) => p.id === bb.id)
                    if (target) {
                        return target
                    }
                    return bb
                })

                // remove any closed bounties
                list = list.filter((bb) => !bb.is_closed)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

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

    return (
        <BattleLobbyContext.Provider
            value={{
                battleLobbies,
                createBattleLobby,
                joinBattleLobby,
                leaveBattleLobby,
                battleETASeconds,
                battleBounties,
                createBattleBounty,
            }}
        >
            {children}
        </BattleLobbyContext.Provider>
    )
}

export const useBattleLobby = () => {
    return useContext<BattleLobbyState>(BattleLobbyContext)
}
