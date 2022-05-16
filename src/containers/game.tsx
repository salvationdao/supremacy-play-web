import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerAuth, useGameServerWebsocket, useSupremacy } from "."
import { GameServerKeys } from "../keys"
import { BattleEndDetail, BribeStage, GameAbility, Map, WarMachineState } from "../types"
import { FactionGeneralData } from "../types/passport"

export interface BribeStageResponse {
    phase: BribeStage
    end_time: Date
}

export interface GameSettingsResponse {
    battle_identifier: number
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
    const { setBattleIdentifier } = useSupremacy()
    const { state, send, subscribe } = useGameServerWebsocket()
    const { userID } = useGameServerAuth()

    // States
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [spawnedAI, setSpawnedAI] = useState<WarMachineState[] | undefined>([])
    const [bribeStage, setBribeStage] = useState<BribeStageResponse | undefined>()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()

    const [forceDisplay100Percentage, setForceDisplay100Percentage] = useState<string>("")

    // Subscribe for game settings
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<GameSettingsResponse | undefined>(
            GameServerKeys.SubGameSettings,
            (payload) => {
                if (!payload) return
                if (payload.battle_identifier > 0) setBattleIdentifier(payload.battle_identifier)
                setMap(payload.game_map)
                setWarMachines(payload.war_machines)
                setSpawnedAI(payload.spawned_ai)
            },
            null,
        )
    }, [state, subscribe, setBattleIdentifier])

    useEffect(() => {
        if (!send || !userID || !map) return
        send(GameServerKeys.GameUserOnline)
    }, [send, map, userID])

    // Subscribe on battle end information
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<BattleEndDetail>(
            GameServerKeys.SubBattleEndDetailUpdated,
            (payload) => {
                if (!payload) return
                setBattleEndDetail(payload)
            },
            null,
            true,
        )
    }, [state, subscribe])

    // Subscirbe on current voting state
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<BribeStageResponse | undefined>(
            GameServerKeys.SubBribeStageUpdated,
            (payload) => {
                setBribeStage(payload)

                // reset force display, if
                if (payload?.phase === "COOLDOWN" || payload?.phase === "HOLD") setForceDisplay100Percentage("")
            },
            null,
        )
    }, [state, subscribe])

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
        map,
        setMap,
        warMachines,
        spawnedAI,
        battleEndDetail,
        setBattleEndDetail,
        forceDisplay100Percentage,
        setForceDisplay100Percentage,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
