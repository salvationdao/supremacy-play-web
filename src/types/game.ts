import { Faction, WarMachineState } from "."
import { FactionIDs } from "./../constants"

export interface FactionsAll {
    [faction_id: string]: Faction
}

export enum BribeStage {
    OptIn = "OPT_IN",
    LocationSelect = "LOCATION_SELECT",
    Cooldown = "COOLDOWN",
    Hold = "HOLD",
}

export enum LocationSelectType {
    LineSelect = "LINE_SELECT",
    MechSelect = "MECH_SELECT",
    MechSelectAllied = "MECH_SELECT_ALLIED",
    MechSelectOpponent = "MECH_SELECT_OPPONENT",
    LocationSelect = "LOCATION_SELECT",
    Global = "GLOBAL",
    MechCommand = "MECH_COMMAND",
}

export interface Map {
    Name: string
    Image_Url: string
    Width: number
    Height: number
    Cells_X: number
    Cells_Y: number
    Pixel_Top: number
    Pixel_Left: number
    Disabled_Cells: number[]
}

export interface BattleZoneStruct {
    location: Position
    radius: number
    shrink_time: number
    warn_time: number
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
    cooldown_seconds: number
}

export interface PlayerAbility {
    id: string
    blueprint_id: string
    count: number
    last_purchased_at: Date
    cooldown_expires_on: Date
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
    mech_rewards: BattleMechReward[]
}

export interface BattleMechReward {
    id: string
    name?: string
    label: string
    faction_id: FactionIDs
    avatar_url: string
    rewarded_sups: string
    rewarded_sups_bonus: string
    owner_id: string
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

export enum MiniMapDisplayEffectType {
    None = "NONE",
    Range = "RANGE",
    Pulse = "PULSE",
    Drop = "DROP",
    Explosion = "EXPLOSION",
    Fade = "FADE",
    Landmine = "LANDMINE",
}

export enum MechDisplayEffectType {
    None = "NONE",
    Border = "BORDER",
    Pulse = "PULSE",
    Shake = "SHAKE",
}

export interface DisplayedAbility {
    offering_id: string
    mini_map_display_effect_type: MiniMapDisplayEffectType
    mech_display_effect_type: MechDisplayEffectType
    location_select_type: LocationSelectType
    image_url: string
    colour: string
    radius?: number
    mech_id?: string
    location: {
        x: number
        y: number
    }
    launching_at?: Date
    location_in_pixels?: boolean
    border_width?: number
    show_below_mechs?: boolean
    no_background_colour?: boolean
    // defaults to 1.5
    size_grid_override?: number
}
