import { createContext, ReactNode, useContext, useState } from "react"
import { useGameServerSubscriptionSecured } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BattleLobby } from "../types/battle_queue"

export interface BattleLobbyState {
    battleLobbies: BattleLobby[]
}

const initialState: BattleLobbyState = {
    battleLobbies: [],
}

export const BattleLobbyContext = createContext<BattleLobbyState>(initialState)

export const BattleLobbyProvider = ({ children }: { children: ReactNode }) => {
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
            }}
        >
            {children}
        </BattleLobbyContext.Provider>
    )
}

export const useBattleLobby = () => {
    return useContext<BattleLobbyState>(BattleLobbyContext)
}
