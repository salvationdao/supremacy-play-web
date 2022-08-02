import { Faction, WarMachineState } from "."
import { FactionIDs } from "./../constants"

export interface FactionsAll {
    [faction_id: string]: Faction
}

export type BribeStage = "OPT_IN" | "LOCATION_SELECT" | "COOLDOWN" | "HOLD"

export interface ViewerLiveCount {
    red_mountain: number
    boston: number
    zaibatsu: number
    other: number
}

export enum LocationSelectType {
    LINE_SELECT = "LINE_SELECT",
    MECH_SELECT = "MECH_SELECT",
    LOCATION_SELECT = "LOCATION_SELECT",
    GLOBAL = "GLOBAL",
    MECH_COMMAND = "MECH_COMMAND",
}

export interface Map {
    name: string
    image_url: string
    width: number
    height: number
    cells_x: number
    cells_y: number
    top_pixels: number
    left_pixels: number
    disabled_cells: number[]
}

export interface BattleZone {
    location: Position
    radius: number
    shrinkTime: number
    warnTime: number
}

export enum StreamService {
    OvenMediaEngine = "OvenMediaEngine",
    AntMedia = "AntMedia",
    Softvelum = "Softvelum",
    None = "None",
}

export interface Stream {
    host: string
    name: string
    url: string
    stream_id: string
    region: string
    resolution: string
    bit_rates_k_bits: number
    user_max: number
    users_now: number
    active: boolean
    status: string
    latitude: string
    longitude: string
    service: StreamService
    distance?: number
}

export interface Dimension {
    width: number
    height: number
}

export interface Position {
    x: number
    y: number
}

export interface Vector2i {
    x: number
    y: number
}

export interface BattleAbility {
    id: string
    label: string
    colour: string
    text_colour: string
    description: string
    image_url: string
    cooldown_duration_second: number
    ability_offering_id: string
}

export interface GameAbility {
    id: string
    game_client_ability_id: number
    identity: string
    label: string
    colour: string
    text_colour: string
    description: string
    image_url: string
    sups_cost: string
    current_sups: string
    ability_offering_id: string
    location_select_type: string
}

export interface BlueprintPlayerAbility {
    id: string
    game_client_ability_id: number
    label: string
    colour: string
    image_url: string
    description: string
    text_colour: string
    location_select_type: LocationSelectType
    created_at: Date
    inventory_limit: number
}

export interface PlayerAbility {
    id: string
    blueprint_id: string
    count: number
    last_purchased_at: Date
    ability: BlueprintPlayerAbility

    // Used for mech command related abilities
    mechHash?: string
}

export interface SaleAbility {
    id: string
    blueprint_id: string
    amount_sold: number
    current_price: string
    ability: BlueprintPlayerAbility
}

export enum SaleAbilityAvailability {
    Unavailable,
    CanClaim,
    CanPurchase,
}

export interface GameAbilityProgress {
    id: string
    offering_id: string
    sups_cost: string
    current_sups: string
    should_reset: boolean
}

export interface BattleAbilityProgress {
    faction_id: string
    sups_cost: string
    current_sups: string
}

export interface Battle {
    battle: {
        id: string
        game_map_id: string
        started_at: Date
        ended_at?: Date
        battle_number: number
    }
    game_map?: Map
}

export interface WarMachineLiveState {
    participant_id?: number
    position?: Vector2i
    rotation?: number
    health?: number
    shield?: number
    energy?: number
    is_hidden: boolean
}

export interface BattleEndDetail {
    battle_id: string
    battle_identifier: number
    started_at: Date
    ended_at: Date
    winning_condition: string
    winning_faction_id_order: FactionIDs[]
    winning_war_machines: WarMachineState[]
}

// {
//     "player_id": "cc43913e-393f-4c00-a6e2-26fc78accf78",
//     "rewarded_sups": "146250000000000000000",
//     "rewarded_player_ability": {
//       "id": "d76053ab-19f5-40cc-a592-d57afa7fa451",
//       "game_client_ability_id": 13,
//       "label": "Hacker Drone",
//       "colour": "#FF5861",
//       "image_url": "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-hacker-drone.png",
//       "description": "Deploy a drone onto the battlefield that hacks into the nearest War Machine and disrupts their targeting systems.",
//       "text_colour": "#FF5861",
//       "location_select_type": "LOCATION_SELECT",
//       "created_at": "2022-08-01T20:39:47.911364+08:00",
//       "rarity_weight": 30,
//       "inventory_limit": 10
//     },
//     "faction_rank": "THIRD"
//   }

export interface WarMachineDestroyedRecord {
    destroyed_war_machine: WarMachineState
    killed_by_war_machine?: WarMachineState
    killed_by?: string
    damage_records: DamageRecord[]
}

export interface DamageRecord {
    amount: number
    caused_by_war_machine?: WarMachineState
    source_name: string // weapon/ability name
}
