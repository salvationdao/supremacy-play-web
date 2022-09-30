import { RarityEnum } from "./assets"
import { GameMap } from "./game"
import { User } from "./user"

export interface BattleLobby {
    id: string
    host_by_id: string
    number: number
    entry_fee: string
    first_faction_cut: string
    second_faction_cut: string
    third_faction_cut: string
    each_faction_mech_amount: number
    game_map_id?: string
    generated_by_system: boolean
    ready_at?: Date
    assigned_to_battle_id?: string
    assigned_to_arena_id?: string
    ended_at?: Date
    created_at: Date
    deleted_at?: Date

    host_by: User
    game_map?: GameMap
    is_private: boolean
    battle_lobbies_mechs: BattleLobbiesMech[]
}

export interface BattleLobbiesMech {
    mech_id: string
    battle_lobby_id: string
    name: string
    label: string
    tier: string
    avatar_url: string
    faction_id: string
    owner?: User
    is_destroyed: boolean
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
    avatar_url: string
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
