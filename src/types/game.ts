import { Faction, MultiplierUpdateResp, WarMachineState } from "."

export interface FactionsAll {
    [faction_id: string]: Faction
}

export type BribeStage = "BRIBE" | "LOCATION_SELECT" | "COOLDOWN" | "HOLD"

export interface ViewerLiveCount {
    red_mountain: number
    boston: number
    zaibatsu: number
    other: number
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

export interface Stream {
    host: string
    name: string
    url: string
    stream_id: string
    region: string
    resolution: string
    bit_rates_kbits: number
    user_max: number
    users_now: number
    active: boolean
    status: string
    latitude: number
    longitude: number
    distance?: number
}

export interface Dimension {
    width: number
    height: number
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
    identity: string
    label: string
    colour: string
    text_colour: string
    description: string
    image_url: string
    sups_cost: string
    current_sups: string
    ability_offering_id: string
}

export interface PlayerAbility {
    id: string
    owner_id: string
    blueprint_id: string
    game_client_ability_id: string
    label: string
    colour: string
    image_url: string
    description: string
    text_colour: string
    location_select_type: "MECH_SELECT" | "LOCATION_SELECT" | "GLOBAL"
    purchased_at: string
}

export interface SaleAbility {
    id: string
    current_price: string
    available_until?: Date
    ability?: PlayerAbility
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
    id: string
    game_map_id: string
    started_at: Date
    ended_at?: Date
    battle_number: number
    game_map?: Map
}

export interface WarMachineLiveState {
    participant_id?: number
    position?: Vector2i
    rotation?: number
    health?: number
    shield?: number
    energy?: number
}

export interface BattleEndDetail {
    battle_id: string
    battle_identifier: number
    started_at: Date
    ended_at: Date
    total_multipliers: number
    battle_multipliers: MultiplierUpdateResp
    winning_condition: string
    winning_faction: Faction
    winning_war_machines: WarMachineState[]
    top_sups_contributors: {
        username: string
        avatar_id: string
        faction_id: string
        faction_colour: string
    }[]
    top_sups_contribute_factions: Faction[]
    most_frequent_ability_executors: {
        username: string
        avatar_id: string
        faction_id: string
        faction_colour: string
    }[]
}

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
