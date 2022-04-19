import React, { Dispatch } from "react"

interface UpdateThemeContextProps {
    updateTheme: Dispatch<React.SetStateAction<FactionThemeColor>>
}

export const UpdateTheme = React.createContext({} as UpdateThemeContextProps)

export interface User {
    id: string
    username: string
    avatar_id: string
    faction_id: string
    faction: Faction
    sups: number
    gid: number
}

export type UserRank = "NEW_RECRUIT" | "PRIVATE" | "CORPORAL" | "GENERAL"

export interface FactionThemeColor {
    primary: string
    secondary: string
    background: string
}

export interface Faction {
    id: string
    label: string
    logo_blob_id: string
    background_blob_id: string
    theme: FactionThemeColor
}

export type BribeStage = "BRIBE" | "LOCATION_SELECT" | "COOLDOWN" | "HOLD"

export interface BattleAbility {
    id: string
    label: string
    colour: string
    text_colour: string
    description: string
    image_url: string
    cooldown_duration_second: number
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
}

export interface GameAbilityProgress {
    id: string
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

export interface BattleMechHistory {
    battle_id: string
    mech_id: string
    owner_id: string
    faction_id: string
    killed?: Date
    killed_by_id?: string
    kills: number
    damage_taken: number
    updated_at: Date
    created_at: Date
    faction_won?: boolean
    mech_survived?: boolean
    battle?: Battle
}

export interface BattleMechStats {
    mech_id: string
    total_wins: number
    total_deaths: number
    total_kills: number
    battles_survived: number
    total_losses: number
    extra_stats: {
        win_rate: number
        survival_rate: number
        kill_percentile: number
        survival_percentile: number
    }
}

export interface Vector2i {
    x: number
    y: number
}

export interface WarMachineState {
    // One off fetch on inital load
    hash: string
    participantID: number
    factionID: string
    faction: Faction
    name: string
    image: string
    maxHealth: number
    maxShield: number
    imageAvatar: string
    tier: string

    // Updated in subscription
    health: number
    shield: number
    position: Vector2i
    rotation: number
}

export interface WarMachineMetadata {
    hash: string
    is_insured: boolean
    contract_reward: string
    name: string
    model: string
    image: string
}

export interface Map {
    name: string
    image_url: string
    width: number
    height: number
    cells_x: number
    cells_y: number
    top: number
    left: number
    scale: number
    disabled_cells: number[]
}

export interface ViewerLiveCount {
    red_mountain: number
    boston: number
    zaibatsu: number
    other: number
}

export enum NetMessageType {
    Default,
    Tick,
    LiveVoting,
    ViewerLiveCountTick,
    SpoilOfWarTick,
    GameAbilityProgressTick,
    BattleAbilityProgressTick,
}

export interface NetMessageTickWarMachine {
    participant_id?: number
    position?: Vector2i
    rotation?: number
    health?: number
    shield?: number
}

export interface NetMessageTick {
    warmachines: NetMessageTickWarMachine[]
}

export interface BattleEndDetail {
    battle_id: string
    battle_identifier: number
    started_at: Date
    ended_at: Date
    total_multipliers: string
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

export interface MultiplierUpdateResp {
    battles: BattleMultipliers[]
}

export interface BattleMultipliers {
    battle_number: number
    total_multipliers: string
    multipliers: Multiplier[]
}

export interface Multiplier {
    key: string
    value: string
    description: string
    is_multiplicative: boolean
    battle_number: number
}

export interface Dimension {
    width: number
    height: number
}

export interface UserStat {
    id: string
    view_battle_count: number
    last_seven_days_kills: number
    total_ability_triggered: number
    ability_kill_count: number
    mech_kill_count: number
}
