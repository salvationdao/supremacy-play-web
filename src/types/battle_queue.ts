import { NewMechStruct, RarityEnum } from "./assets"
import { GameMap } from "./game"
import { User } from "./user"

export interface BattleLobby {
    id: string
    name: string
    host_by_id: string
    number: number
    entry_fee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    each_faction_mech_amount: number
    max_deploy_per_player: number
    game_map_id?: string
    generated_by_system: boolean
    ready_at?: Date
    assigned_to_battle_id?: string
    assigned_to_arena_id?: string
    ended_at?: Date
    created_at: Date
    deleted_at?: Date
    will_not_start_until?: Date

    expires_at?: Date
    fill_at?: Date

    host_by: User
    game_map?: GameMap
    is_private: boolean
    access_code: string
    sups_pool: string

    battle_lobbies_mechs: BattleLobbiesMech[]

    opted_in_rm_supporters: BattleLobbySupporter[]
    opted_in_zai_supporters: BattleLobbySupporter[]
    opted_in_bc_supporters: BattleLobbySupporter[]

    selected_rm_supporters: BattleLobbySupporter[]
    selected_zai_supporters: BattleLobbySupporter[]
    selected_bc_supporters: BattleLobbySupporter[]
}

export interface BattleLobbiesMech extends NewMechStruct {
    battle_lobby_id: string
    queued_by?: User
    is_destroyed: boolean
}

export interface BattleLobbySupporter {
    id: string
    username: string
    faction_id: string
    avatar_url?: string
    custom_avatar_id?: string
}

export interface MechWeaponSlot {
    mech_id: string
    weapon_id: string
    slot_number: number
    allow_melee: boolean
    is_skin_inherited: boolean
    weapon?: Weapon
}

export interface Weapon {
    label: string
    avatar_url: string | undefined
    image_url: string
    damage: number
    damage_falloff: number
    damage_falloff_rate: number
    power_cost: string
    projectile_amount: number
    projectile_speed: string
    radius: number
    radius_damage_falloff: number
    rate_of_fire: string
    spread: string
    tier: RarityEnum
    weapon_type: string
    is_melee: boolean
    is_arced: boolean
}

export interface PlayerQueueStatus {
    total_queued: number
    queue_limit: number
}
