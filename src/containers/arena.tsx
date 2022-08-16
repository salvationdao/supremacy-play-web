import React, { createContext, Dispatch, ReactNode, useContext, useState } from "react"
import { AuthContext, AuthState } from "./auth"
import { User } from "../types"
import { useGameServerSubscription, useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"

enum ArenaType {
    Story = "STORY",
    Expedition = "EXPEDITION",
}

interface Arena {
    id: string
    type: ArenaType
}

export interface ArenaState {
    arenas: Arena[]
    setArenas: Dispatch<React.SetStateAction<Arena[]>>
    currentArena?: Arena
    setCurrentArena: Dispatch<React.SetStateAction<Arena | undefined>>
    currentArenaID: string
}

const initialState: ArenaState = {
    arenas: [],
    setArenas: () => {
        return
    },
    currentArena: undefined,
    setCurrentArena: () => {
        return
    },
    currentArenaID: "",
}

export const ArenaContext = createContext<ArenaState>(initialState)

export const ArenaProvider = ({ children }: { children: ReactNode }) => {
    const [arenas, setArenas] = useState<Arena[]>([])
    const [currentArena, setCurrentArena] = useState<Arena>()

    const currentArenaID = currentArena?.id || ""

    return (
        <ArenaContext.Provider
            value={{
                arenas,
                setArenas,
                currentArena,
                setCurrentArena,
                currentArenaID,
            }}
        >
            {children}
        </ArenaContext.Provider>
    )
}

export const useArena = () => {
    return useContext<ArenaState>(ArenaContext)
}

export const ArenaListener = () => {
    const { setArenas, currentArenaID, setCurrentArena } = useArena()
    useGameServerSubscription<Arena[]>(
        {
            URI: "/public/arena_list",
            key: GameServerKeys.SubBattleArenaList,
        },
        (payload) => {
            console.log(payload)
            if (!payload || payload.length === 0) {
                setArenas([])
                return
            }

            setArenas(payload)

            // NOTE: temporary default arena to the first one
            if (!currentArenaID) {
                setCurrentArena(payload[0])
            }
        },
    )

    console.log(currentArenaID)

    useGameServerSubscription<boolean>(
        {
            URI: `/public/arena/${currentArenaID}/closed`,
            key: GameServerKeys.SubBattleArenaClosed,
            ready: currentArenaID != "",
        },
        (payload) => {
            if (!payload) return
            setCurrentArena(undefined)
        },
    )
    return null
}
