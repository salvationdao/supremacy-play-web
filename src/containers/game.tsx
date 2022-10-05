import { useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSupremacy, useUI } from "."
import { useGameServerCommandsUser, useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { AbilityDetail, AIType, BattleEndDetail, BattleZoneStruct, BribeStage, Map, WarMachineState } from "../types"
import { useArena } from "./arena"
import { BattleLobby } from "../types/battle_queue"

export interface BribeStageResponse {
    phase: BribeStage
    end_time: Date
}

export interface GameSettingsResponse {
    battle_identifier: number
    game_map: Map
    battle_zone: BattleZoneStruct
    war_machines: WarMachineState[]
    spawned_ai: WarMachineState[]
    ability_details: AbilityDetail[]
    server_time: Date
}

export interface UpcomingBattleResponse {
    is_pre_battle: boolean
    upcoming_battle: BattleLobby | undefined
}

// Game data that needs to be shared between different components
export const GameContainer = createContainer(() => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { factionID, user } = useAuth()
    const { currentArenaID } = useArena()
    const { setBattleIdentifier } = useSupremacy()
    const { toggleIsStreamBigDisplayMemorized, restoreIsStreamBigDisplayMemorized } = useUI()

    // States
    const [map, setMap] = useState<Map>()
    const [battleZone, setBattleZone] = useState<BattleZoneStruct>()
    const [abilityDetails, setAbilityDetails] = useState<AbilityDetail[]>([])
    const [bribeStage, setBribeStage] = useState<BribeStageResponse | undefined>()
    const [nextBattle, setNextBattle] = useState<BattleLobby | undefined>()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()
    const [forceDisplay100Percentage, setForceDisplay100Percentage] = useState<string>("")
    const isBattleStarted = useMemo(() => !!(map && bribeStage && bribeStage.phase !== BribeStage.Hold), [bribeStage, map])

    // Mechs
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [spawnedAI, setSpawnedAI] = useState<WarMachineState[] | undefined>([])

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

    // Tell server user is online for the round
    useEffect(() => {
        if (!map || !currentArenaID) return
        send(GameServerKeys.GameUserOnline, { arena_id: currentArenaID })
    }, [send, map, currentArenaID])

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

    // Subscribe for pre battle screen
    useGameServerSubscription<UpcomingBattleResponse>(
        {
            URI: `/public/arena/${currentArenaID}/upcoming_battle`,
            key: GameServerKeys.NextBattleDetails,
            ready: !!currentArenaID,
        },
        (payload) => {
            console.log("upcoming_battle: ", payload)
            if (!payload || !payload.is_pre_battle) {
                // set nil
                setNextBattle(undefined)
                return
            }
            // set upcoming details
            setNextBattle(payload.upcoming_battle)
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
            if (payload?.phase === BribeStage.Cooldown || payload?.phase === BribeStage.Hold) setForceDisplay100Percentage("")
        },
    )

    // If battle ends, then we will focus on the stream for watch mech intro
    useEffect(() => {
        if (!isBattleStarted) {
            toggleIsStreamBigDisplayMemorized(true)
        } else {
            restoreIsStreamBigDisplayMemorized()
        }
    }, [isBattleStarted, restoreIsStreamBigDisplayMemorized, toggleIsStreamBigDisplayMemorized])

    return {
        map,
        setMap,
        bribeStage,
        isBattleStarted,

        // Abilities and map stuff
        battleZone,
        setBattleZone,
        abilityDetails,

        // Mechs for map etc.
        warMachines, // All
        spawnedAI, // All
        orderedWarMachines, // All
        factionWarMachines, // Filtered
        otherWarMachines, // Filtered
        ownedMiniMechs, // Filtered

        // Others
        battleEndDetail,
        forceDisplay100Percentage,
        setForceDisplay100Percentage,
        nextBattle,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
