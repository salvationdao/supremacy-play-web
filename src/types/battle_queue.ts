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
    game_map_id: string
    generated_by_system: boolean
    ready_at?: Date
    assigned_to_battle_id?: string
    ended_at?: Date
    created_at: Date

    host_by: User
    game_map: GameMap
    is_private: boolean
}
