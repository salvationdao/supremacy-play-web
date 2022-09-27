import { User } from "./user"
import { GameMap } from "./game"

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
    owner: User
    is_destroyed: boolean
}

export interface BattleBounty {
    id: string
    battle_lobby_id: string
    targeted_mech_id: string
    amount: string // sups
    offered_by_id: string
    is_closed: boolean

    offered_by_player: User
}
