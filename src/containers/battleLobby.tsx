import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecured } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BattleLobby } from "../types/battle_queue"
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
    ) => {},
    joinBattleLobby: (battleLobbyID: string, mechIDs: string[], password?: string) => {},
    leaveBattleLobby: (mechIDs: string[]) => {},
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
            key: GameServerKeys.SubBattleLobbyUpdate,
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
                list = list.filter((bl) => !bl.ended_at)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (bls.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list
            })
        },
    )

    return (
        <BattleLobbyContext.Provider
            value={{
                battleLobbies,
                createBattleLobby,
                joinBattleLobby,
                leaveBattleLobby,
            }}
        >
            {children}
        </BattleLobbyContext.Provider>
    )
}

export const useBattleLobby = () => {
    return useContext<BattleLobbyState>(BattleLobbyContext)
}
