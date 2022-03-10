import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { NullUUID } from "../constants"
import { GameServerKeys, PassportServerKeys } from "../keys"
import { BribeStage, Map, WarMachineState, GameAbility } from "../types"
import { useGameServerAuth, usePassportServerWebsocket } from "."
import { useGameServerWebsocket } from "."
import { FactionGeneralData } from "../types/passport"

export interface BribeStageResponse {
    phase: BribeStage
    end_time: Date
}

export interface GameSettingsResponse {
    game_map: Map
    war_machines: WarMachineState[]
    spawned_ai: WarMachineState[]
}

export interface WinnerAnnouncementResponse {
    game_ability: GameAbility
    end_time: Date
}

export interface FactionsAll {
    [faction_id: string]: FactionGeneralData
}

// Game data that needs to be shared between different components
export const GameContainer = createContainer(() => {
    const { state, send, subscribe } = useGameServerWebsocket()
    const { send: sendPassportWS } = usePassportServerWebsocket()
    const { faction_id } = useGameServerAuth()

    // States
    const [factionsAll, setFactionsAll] = useState<FactionsAll>({})
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [spawnedAI, setSpawnedAI] = useState<WarMachineState[] | undefined>([])
    const [bribeStage, setBribeStage] = useState<BribeStageResponse | undefined>()
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [highlightedMechHash, setHighlightedMechHash] = useState<string | undefined>(undefined)

    // Subscribe for game settings
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<GameSettingsResponse | undefined>(
            GameServerKeys.SubGameSettings,
            (payload) => {
                if (!payload) return
                setMap(payload.game_map)
                setWarMachines(payload.war_machines)
                setSpawnedAI(payload.spawned_ai)
            },
            null,
        )
    }, [state, subscribe])

    // Get main color of each factions
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        ;(async () => {
            try {
                const resp = await sendPassportWS<FactionGeneralData[]>(PassportServerKeys.GetFactionsAll)
                if (resp) {
                    const currentData = {} as FactionsAll
                    resp.forEach((f) => {
                        currentData[f.id] = f
                    })
                    setFactionsAll(currentData)
                }
            } catch (e) {
                console.log(e)
                return false
            }
        })()
    }, [send, state])

    // Subscirbe on current voting state
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe<BribeStageResponse | undefined>(
            GameServerKeys.SubBribeStageUpdated,
            (payload) => {
                setBribeStage(payload)
            },
            null,
        )
    }, [state, subscribe, faction_id])

    // Subscribe on winner announcements
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe<WinnerAnnouncementResponse | undefined>(
            GameServerKeys.SubBribeWinnerAnnouncement,
            (payload) => setWinner(payload),
            null,
        )
    }, [state, subscribe, faction_id])

    // Subscribe to spawned AI events
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<WarMachineState | undefined>(
            GameServerKeys.SubAISpawned,
            (payload) => {
                if (!payload) return
                setSpawnedAI((prev) => (prev === undefined ? [payload] : [...prev, payload]))
            },
            null,
        )
    }, [state, subscribe])

    return {
        bribeStage,
        factionsAll,
        winner,
        setWinner,
        map,
        setMap,
        warMachines,
        spawnedAI,
        highlightedMechHash,
        setHighlightedMechHash,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
