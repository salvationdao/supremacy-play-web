import { useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSupremacy } from "."
import { useGameServerCommandsUser, useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { AbilityDetail, AIType, BattleEndDetail, BattleZone, BribeStage, Map, WarMachineState } from "../types"

export interface BribeStageResponse {
    phase: BribeStage
    end_time: Date
}

export interface GameSettingsResponse {
    battle_identifier: number
    game_map: Map
    battle_zone: BattleZone
    war_machines: WarMachineState[]
    spawned_ai: WarMachineState[]
    ability_details: AbilityDetail[]
}

// Game data that needs to be shared between different components
export const GameContainer = createContainer(() => {
    const { setBattleIdentifier } = useSupremacy()
    const { factionID, user } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")

    // States
    const [map, setMap] = useState<Map>()
    const [battleZone, setBattleZone] = useState<BattleZone>()
    const [abilityDetails, setAbilityDetails] = useState<AbilityDetail[]>([])
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [spawnedAI, setSpawnedAI] = useState<WarMachineState[] | undefined>([])
    const [bribeStage, setBribeStage] = useState<BribeStageResponse | undefined>()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()
    const [forceDisplay100Percentage, setForceDisplay100Percentage] = useState<string>("")

    const factionWarMachines = useMemo(() => {
        if (!warMachines) return
        return warMachines?.filter((w) => w.factionID === factionID).sort((a, b) => a.participantID - b.participantID)
    }, [warMachines, factionID])

    const otherWarMachines = useMemo(() => {
        if (!warMachines) return
        return warMachines?.filter((w) => w.factionID !== factionID).sort((a, b) => a.participantID - b.participantID)
    }, [warMachines, factionID])

    const orderedWarMachines = useMemo(() => {
        if (!otherWarMachines || !factionWarMachines) return
        return [...factionWarMachines, ...otherWarMachines]
    }, [otherWarMachines, factionWarMachines])

    const ownedMiniMechs = useMemo(
        () => (spawnedAI ? spawnedAI.filter((sa) => sa.aiType === AIType.MiniMech && sa.ownedByID === user.id) : []),
        [spawnedAI, user],
    )

    // Subscribe for game settings
    useGameServerSubscription<GameSettingsResponse | undefined>(
        {
            URI: "/public/game_settings",
            key: GameServerKeys.SubGameSettings,
        },
        (payload) => {
            if (!payload) return
            if (payload.battle_identifier > 0) setBattleIdentifier(payload.battle_identifier)
            setMap(payload.game_map)
            setBattleZone(payload.battle_zone)
            setAbilityDetails(payload.ability_details)
            setWarMachines(payload.war_machines)
            setSpawnedAI(payload.spawned_ai)
        },
    )

    // Subscribe for spawned AI
    useGameServerSubscription<WarMachineState[] | undefined>(
        {
            URI: "/public/minimap",
            key: GameServerKeys.SubBattleAISpawned,
        },
        (payload) => {
            if (!payload) return
            setSpawnedAI(payload)
        },
    )

    useEffect(() => {
        if (!map) return
        send(GameServerKeys.GameUserOnline)
    }, [send, map])

    // Subscribe on battle end information
    useGameServerSubscription<BattleEndDetail>(
        {
            URI: "/public/battle_end_result",
            key: GameServerKeys.SubBattleEndDetailUpdated,
        },
        (payload) => {
            if (!payload) return
            setBattleEndDetail(payload)
        },
    )

    // Subscribe on current voting state
    useGameServerSubscription<BribeStageResponse | undefined>(
        {
            URI: "/public/bribe_stage",
            key: GameServerKeys.SubBribeStageUpdated,
        },
        (payload) => {
            setBribeStage(payload)
            // reset force display, if
            if (payload?.phase === "COOLDOWN" || payload?.phase === "HOLD") setForceDisplay100Percentage("")
        },
    )

    return {
        bribeStage,
        map,
        setMap,
        battleZone,
        setBattleZone,
        abilityDetails,
        warMachines,
        factionWarMachines,
        otherWarMachines,
        orderedWarMachines,
        ownedMiniMechs,
        spawnedAI,
        battleEndDetail,
        setBattleEndDetail,
        forceDisplay100Percentage,
        setForceDisplay100Percentage,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
