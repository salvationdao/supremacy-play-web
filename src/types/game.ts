import { Faction, WarMachineState } from "."
import { FactionIDs } from "./../constants"
import { User } from "./user"

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
    Background_Url: string
    Width: number
    Height: number
    Cells_X: number
    Cells_Y: number
    Pixel_Top: number
    Pixel_Left: number
    Disabled_Cells: number[]
}

export const GAME_CLIENT_TILE_SIZE = 2000

export interface GameMap {
    id: string
    name: string
    logo_url: string
    background_url: string
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
    id: string
    game_map_id: string
    started_at: Date
    ended_at?: Date
    battle_number: number
    arena_id: string
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
    is_afk: boolean
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

export enum ArenaType {
    Story = "STORY",
    Expedition = "EXPEDITION",
}

export interface Arena {
    id: string
    type: ArenaType
    gid: number
    status?: ArenaStatus
}

export interface ArenaStatus {
    is_idle: boolean
}

export interface BattleReplay {
    id: string
    stream_id: string
    arena_id: string
    battle_id: string
    is_complete_battle: boolean
    recording_status: string
    started_at?: Date
    stopped_at?: Date
    intro_ended_at?: Date
    events?: ReplayEvent[]
    battle: Battle
    arena: Arena
    game_map?: GameMap
}

export interface ReplayEvent {
    timestamp: Date
    notification: NotificationStruct
}

// Notifications

export enum NotificationType {
    Text = "TEXT", // generic notification with no styles, just text
    LocationSelect = "LOCATION_SELECT", // user is choosing a target location on map
    BattleAbility = "BATTLE_ABILITY", // when a faction has initiated a battle ability
    FactionAbility = "FACTION_ABILITY", // when a faction has initiated a faction ability
    WarMachineAbility = "WAR_MACHINE_ABILITY", //
    WarMachineDestroyed = "WAR_MACHINE_DESTROYED", // when a faction has initiated a war machine ability
    BattleZoneChange = "BATTLE_ZONE_CHANGE", // when a war machine is destroyed
}

/*
NOTE:
Some examples:
1. CANCELLED_NO_PLAYER
=> {ability} is cancelled, due to no player select location

2. CANCELLED_DISCONNECT
=> {ability} is cancelled, due to the last player eligible to pick location is disconnected.

3. FAILED_TIMEOUT
=> {currentUsername} failed to select location in time, it is {nextUsername}'s turn to select the location for {ability}

4. FAILED_DISCONNECTED
=> {currentUsername} is disconnected, it is {nextUsername}'s turn to select the location for {ability}

5. TRIGGER
=> {currentUserName} has chosen a target location for {ability}
*/

export enum LocationSelectAlertType {
    CancelledNoPlayer = "CANCELLED_NO_PLAYER",
    CancelledDisconnect = "CANCELLED_DISCONNECT",
    FailedTimeOut = "FAILED_TIMEOUT",
    FailedDisconnected = "FAILED_DISCONNECTED",
    Trigger = "TRIGGER",
    Assigned = "ASSIGNED",
}

export interface LocationSelectAlertProps {
    type: LocationSelectAlertType
    currentUser?: User
    nextUser?: User
    ability: BattleAbility
    x?: number
    y?: number
}

export interface WarMachineAbilityAlertProps {
    user: User
    ability: BattleAbility
    warMachine: WarMachineState
}

export interface KillAlertProps {
    destroyed_war_machine: WarMachineState
    killed_by_war_machine?: WarMachineState
    killed_by?: string
    killed_by_user?: User
}

export interface BattleFactionAbilityAlertProps {
    user: User
    ability: BattleAbility
}

export interface NotificationStruct {
    type: NotificationType
    data: BattleFactionAbilityAlertProps | KillAlertProps | LocationSelectAlertProps | WarMachineAbilityAlertProps | BattleZoneStruct | string
}
