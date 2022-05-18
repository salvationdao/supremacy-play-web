import { Battle, Vector2i } from "."

export interface AssetDurability {
    hash: string
    started_at: Date
    expect_completed_at: Date
    repair_type: "FAST" | "STANDARD" | ""
}

interface Collection {
    collection_slug: string
    hash: string
    token_id: number
    item_type: string
    item_id: string
    tier: string
    owner_id: string
    on_chain_status: string
}

export interface MechBasic extends Collection {
    id: string
    label: string
    weapon_hardpoints: number
    utility_slots: number
    speed: number
    max_hitpoints: number
    is_default: boolean
    is_insured: boolean
    name: string
    genesis_token_id?: number
    limited_release_token_id?: number
    power_core_size: string
    blueprint_id: string
    brand_id: string
    faction_id: string
    model_id: string
    default_chassis_skin_id: string
    chassis_skin_id: string
    intro_animation_id: string
    outro_animation_id: string
    power_core_id: string
}

// export interface Asset {
//     id: string
//     hash: string
//     collection_id: string
//     store_item_id: string
//     tier: string
//     owner_id: string
//     created_at: Date
//     on_chain_status: string
//     unlocked_at: Date
//     data: {
//         mech: {
//             id: string
//             owner_id: string
//             template_id: string
//             chassis_id: string
//             external_token_id: number
//             tier: string
//             is_default: false
//             image_url: string
//             animation_url: string
//             avatar_url: string
//             hash: string
//             name: string
//             label: string
//             slug: string
//             asset_type: string
//             deleted_at?: Date
//             updated_at: Date
//             created_at: Date
//         }
//         chassis: {
//             id: string
//             brand_id: string
//             label: string
//             model: string
//             skin: string
//             slug: string
//             shield_recharge_rate: number
//             health_remaining: number
//             weapon_hardpoints: number
//             turret_hardpoints: number
//             utility_slots: number
//             speed: number
//             max_hitpoints: number
//             max_shield: number
//             deleted_at?: Date
//             updated_at: Date
//             created_at: Date
//         }
//         weapons: {
//             id: string
//             brand_id: string
//             label: string
//             slug: string
//             damage: number
//             weapon_type: string
//             deleted_at?: Date
//             updated_at: Date
//             created_at: Date
//         }[]
//     }
// }

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

export interface WarMachineState {
    // One off fetch on inital load
    id: string
    hash: string
    participantID: number
    factionID: string
    maxHealth: number
    imageAvatar: string
    maxShield: number
    ownedByID: string
    description?: string | null
    externalUrl: string
    name: string
    image: string
    tier: string
    model: string
    skin: string
    shieldRechargeRate: number
    speed: number
    durability: number
    powerGrid: number
    cpu: number
    weaponHardpoint: number
    turretHardpoint: number
    utilitySlots: number
    weaponNames: string[]

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

export interface RepairStatus {
    total_required_seconds: number
    remain_seconds: number
    full_repair_fee: string
}
