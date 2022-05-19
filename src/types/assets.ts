import { Battle, Faction, User, Vector2i } from "."

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
    updated_at: Date
    created_at: Date
}

export interface MechDetails extends MechBasic {
    blueprint_mech?: BlueprintMech
    brand: Brand
    user: User
    faction?: Faction
    model: MechModel
    default_chassis_skin: BlueprintMechSkin
    chassis_skin?: MechSkin
    intro_animation?: MechAnimation
    outro_animation?: MechAnimation
    power_core?: PowerCore
    weapons: Weapon[]
    utility: Utility[]
}

export interface BlueprintMech {
    id: string
    brand_id: string
    label: string
    slug: string
    skin: string
    weapon_hardpoints: number
    utility_slots: number
    speed: number
    max_hitpoints: number
    updated_at: Date
    created_at: Date
    model_id: string
    power_core_size?: string
    tier?: string
    default_chassis_skin_id: string
    collection: string
}

export interface Brand {
    id: string
    faction_id: string
    label: string
    deleted_at?: Date
    updated_at: Date
    created_at: Date
}

export interface MechModel extends Collection {
    id: string
    blueprint_id: string
    genesis_token_id?: number
    label: string
    mech_model: string
    equipped_on?: string
    image_url?: string
    animation_url?: string
    card_animation_url?: string
    avatar_url?: string
    large_image_url?: string
    created_at: Date
}

export interface BlueprintMechSkin extends Collection {
    id: string
    collection: string
    mech_model: string
    label: string
    image_url?: string
    animation_url?: string
    card_animation_url?: string
    large_image_url?: string
    avatar_url?: string
    created_at: Date
}

export interface MechSkin extends Collection {
    label: string
    image_url?: string
    animation_url?: string
    card_animation_url?: string
    large_image_url?: string
    avatar_url?: string
    created_at: Date
}

export interface MechAnimation extends Collection {
    id: string
    blueprint_id: string
    label: string
    mech_model: string
    equipped_on?: string
    intro_animation?: boolean
    outro_animation?: boolean
    created_at: Date
}

export interface PowerCore extends Collection {
    id: string
    label: string
    size: string
    capacity: number
    max_draw_rate: number
    recharge_rate: number
    armour: number
    max_hitpoints: number
    equipped_on?: string
    created_at: Date
}

export interface Weapon extends Collection {
    id: string
    brand_id?: string
    label: string
    slug: string
    damage: number
    blueprint_id: string
    default_damage_type: string
    genesis_token_id?: number
    weapon_type: string
    damage_falloff?: number
    damage_falloff_rate?: number
    spread?: number
    rate_of_fire?: number
    radius?: number
    radius_damage_falloff?: number
    projectile_speed?: number
    energy_cost?: number
    max_ammo?: number
    updated_at: Date
    created_at: Date
}

export interface Utility extends Collection {
    id: string
    brand_id?: string
    label: string
    updated_at: Date
    created_at: Date
    blueprint_id: string
    genesis_token_id?: number
    equipped_on?: string
    type: string

    shield?: UtilityShield
    attack_drone?: UtilityAttackDrone
    repair_drone?: UtilityRepairDrone
    accelerator?: UtilityAccelerator
    anti_missile?: UtilityAntiMissile
}

export interface UtilityShield {
    utility_id: string
    hitpoints: number
    recharge_rate: number
    recharge_energy_cost: number
}

export interface UtilityAttackDrone {
    utility_id: string
    damage: number
    rate_of_fire: number
    hitpoints: number
    lifespan_seconds: number
    deploy_energy_cost: number
}

export interface UtilityRepairDrone {
    utility_id: string
    repair_type?: string
    repair_amount: number
    deploy_energy_cost: number
    lifespan_seconds: number
}

export interface UtilityAccelerator {
    utility_id: string
    energy_cost: number
    boost_seconds: number
    boost_amount: number
}

export interface UtilityAntiMissile {
    utility_id: string
    rate_of_fire: number
    fire_energy_cost: number
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
