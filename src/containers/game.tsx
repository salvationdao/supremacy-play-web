import { useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSupremacy } from "."
import { useGameServerCommandsUser, useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { AbilityDetail, AIType, BattleEndDetail, BattleZone, BribeStage, Map, WarMachineState } from "../types"
import { useArena } from "./arena"

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
    const { currentArenaID } = useArena()
    const { send } = useGameServerCommandsUser("/user_commander")

    // States
    const [isStreamBigDisplay, setIsStreamBigDisplay] = useState((localStorage.getItem("isStreamBigDisplay") || "true") === "true")
    const prevIsStreamBigDisplay = useRef<boolean>()

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
            URI: `/public/arena/${currentArenaID}/game_settings`,
            key: GameServerKeys.SubGameSettings,
            ready: !!currentArenaID,
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
            URI: `/public/arena/${currentArenaID}/minimap`,
            key: GameServerKeys.SubBattleAISpawned,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return
            setSpawnedAI(payload)
        },
    )

    useEffect(() => {
        if (!map || !currentArenaID) return
        send(GameServerKeys.GameUserOnline, { arena_id: currentArenaID })
    }, [send, map, currentArenaID])

    // Subscribe on battle end information
    useGameServerSubscription<BattleEndDetail>(
        {
            URI: `/public/arena/${currentArenaID}/battle_end_result`,
            key: GameServerKeys.SubBattleEndDetailUpdated,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return
            setBattleEndDetail(payload)
        },
    )

    // Subscribe on current voting state
    useGameServerSubscription<BribeStageResponse | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/bribe_stage`,
            key: GameServerKeys.SubBribeStageUpdated,
            ready: !!currentArenaID,
        },
        (payload) => {
            setBribeStage(payload)
            // reset force display, if
            if (payload?.phase === "COOLDOWN" || payload?.phase === "HOLD") setForceDisplay100Percentage("")
        },
    )

    useEffect(() => {
        localStorage.setItem("isStreamBigDisplay", isStreamBigDisplay.toString())
    }, [isStreamBigDisplay])

    return {
        isStreamBigDisplay,
        setIsStreamBigDisplay,
        prevIsStreamBigDisplay,

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
