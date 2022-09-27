import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecured } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BattleBounty } from "../types/battle_queue"
import BigNumber from "bignumber.js"

export interface BattleLobbyState {
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
}

const initialState: BattleLobbyState = {
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

    return (
        <BattleLobbyContext.Provider
            value={{
                createBattleLobby,
                joinBattleLobby,
                leaveBattleLobby,
                battleETASeconds,
            }}
        >
            {children}
        </BattleLobbyContext.Provider>
    )
}

export const useBattleLobby = () => {
    return useContext<BattleLobbyState>(BattleLobbyContext)
}
