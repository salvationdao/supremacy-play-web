import { createContext, ReactNode, useCallback, useContext } from "react"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
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

    return (
        <BattleLobbyContext.Provider
            value={{
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
