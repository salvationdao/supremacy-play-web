import { useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSupremacy, useUI } from "."
import { useGameServerCommandsUser, useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { AbilityDetail, AIType, BattleEndDetail, BattleState, BattleZoneStruct, Map, WarMachineState } from "../types"
import { BattleLobby } from "../types/battle_queue"
import { useArena } from "./arena"

interface GameClientMap {
    Name: string
    ImageURL: string
}

const S3BaseURL = "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com"
const SalvationDAOBaseURL = "https://afiles.ninja-cdn.com"
const maps: GameClientMap[] = [
    { Name: "Arctic Bay", ImageURL: "/supremacy/maps/ArcticBay.webp" },
    { Name: "Desert City", ImageURL: "/supremacy/maps/DesertCity.webp" },
    { Name: "MIBT", ImageURL: "/supremacy/maps/UrbanBuildings.webp" },
    { Name: "NyuTokyo", ImageURL: "/supremacy/maps/NeoTokyo.webp" },
    { Name: "CloudKu 9", ImageURL: "/supremacy/maps/CloudKu.webp" },
    { Name: "TheHive", ImageURL: "/supremacy/maps/TheHive.webp" },
    { Name: "Aokigahara Sea of Trees", ImageURL: "/supremacy/maps/AokigaharaForest.webp" },
    { Name: "Kazuya City", ImageURL: "/supremacy/maps/CityBlockArena.webp" },
    { Name: "IronDust 5", ImageURL: "/supremacy/maps/RedMountainMine.webp" },
]

const MiniMapImageURL = (baseURL: string, mapName: string): string => {
    const result = maps.find((m) => m.Name === mapName)
    return result ? `${baseURL}${result.ImageURL}` : ""
}

export interface GameSettingsResponse {
    battle_id: string
    battle_identifier: number
    game_map: Map
    battle_zone: BattleZoneStruct
    war_machines: WarMachineState[]
    spawned_ai: WarMachineState[]
    ability_details: AbilityDetail[]
    server_time: Date
    is_ai_driven_match: boolean
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
    const { setBattleIdentifier, setBattleID } = useSupremacy()
    const { toggleIsStreamBigDisplayMemorized, restoreIsStreamBigDisplayMemorized } = useUI()

    // States
    const [battleState, setBattleState] = useState<BattleState>(BattleState.EndState)
    const [map, setMap] = useState<Map>()
    const [battleZone, setBattleZone] = useState<BattleZoneStruct>()
    const [abilityDetails, setAbilityDetails] = useState<AbilityDetail[]>([])
    const [isAIDrivenMatch, setIsAIDrivenMatch] = useState<boolean>(false)
    const [nextBattle, setNextBattle] = useState<BattleLobby | undefined>()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()
    const [forceDisplay100Percentage, setForceDisplay100Percentage] = useState<string>("")

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

    // Subscribe for pre battle screen
    useGameServerSubscription<BattleState>(
        {
            URI: `/public/arena/${currentArenaID}/battle_state`,
            key: GameServerKeys.BattleState,
            ready: !!currentArenaID,
        },
        (payload) => setBattleState(payload),
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
            setBattleID(payload.battle_id)
            setBattleZone(payload.battle_zone)
            setAbilityDetails(payload.ability_details)
            setWarMachines(payload.war_machines)
            setSpawnedAI(payload.spawned_ai)
            setIsAIDrivenMatch(payload.is_ai_driven_match)
            payload.game_map.Background_Url = MiniMapImageURL(SalvationDAOBaseURL, payload.game_map.Name)
            payload.game_map.Image_Url = MiniMapImageURL(SalvationDAOBaseURL, payload.game_map.Name)
            setMap(payload.game_map)
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
            URI: `/mini_map/arena/${currentArenaID}/public/minimap`,
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

    // If battle ends, then we will focus on the stream for watch mech intro
    useEffect(() => {
        if (battleState != BattleState.BattlingState) {
            toggleIsStreamBigDisplayMemorized(true)
        } else {
            restoreIsStreamBigDisplayMemorized()
        }
    }, [battleState, restoreIsStreamBigDisplayMemorized, toggleIsStreamBigDisplayMemorized])

    return {
        battleState,
        map,
        setMap,

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
        isAIDrivenMatch,
        battleEndDetail,
        forceDisplay100Percentage,
        setForceDisplay100Percentage,
        nextBattle,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
