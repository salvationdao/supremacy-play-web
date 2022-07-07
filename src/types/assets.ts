import { Battle, Faction, User, Vector2i } from "."

export enum MechStatusEnum {
    Idle = "IDLE",
    Queue = "QUEUE",
    Battle = "BATTLE",
    Market = "MARKET",
    Sold = "SOLD",
}

export enum WeaponType {
    Cannon = "Cannon",
    Sword = "Sword",
    Minigun = "Minigun",
    MissileLauncher = "Missile Launcher",
    PlasmaGun = "Plasma Gun",
    SniperRifle = "Sniper Rifle",
}

export interface MechStatus {
    status: MechStatusEnum
    queue_position?: number
}

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
    image_url?: string
    animation_url?: string
    card_animation_url?: string
    avatar_url?: string
    large_image_url?: string
    locked_to_marketplace: boolean
    item_sale_id?: string
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
    market_locked: boolean
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
    description: string
    background_color: string
    mech_model: string
    equipped_on?: string
    image_url?: string
    animation_url?: string
    card_animation_url?: string
    avatar_url?: string
    large_image_url?: string
    external_url?: string
    youtube_url?: string
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
    id: string
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
    weaponSkin?: WeaponSkin
    updated_at: Date
    created_at: Date
}

export interface WeaponSkin extends Collection {
    id: string
    blueprint_id: string
    owner_id: string
    label: string
    weapon_type: string
    equipped_on?: string
    tier: string
    created_at: string
    weapon_model_id: Date
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

export interface BattleMechHistoryIdentifier {
    battle_id: string
    mech_id: string
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

export enum AIType {
    Reinforcement = "Reinforcement",
    MiniMech = "Mini Mech",
    RobotDog = "Robot Dog",
}

export interface WarMachineState {
    // One off fetch on initial load
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
    aiType?: AIType | null // If null/undefined, it is a regular mech

    // Updated in subscription
    health: number
    shield: number
    position: Vector2i
    rotation: number
    isHidden: boolean
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

export type MysteryCrateType = "MECH" | "WEAPON"

export interface StorefrontMysteryCrate {
    id: string
    mystery_crate_type: MysteryCrateType
    price: string
    amount: number
    amount_sold: number
    faction_id: string
    label: string
    description: string
    image_url?: string
    card_animation_url?: string
    avatar_url?: string
    large_image_url?: string
    background_color?: string
    animation_url?: string
    youtube_url?: string
}

export interface MysteryCrate extends Collection {
    id: string
    type: string
    faction_id: string
    label: string
    opened: boolean
    locked_until: Date
    purchased: boolean
    description: string
    deleted_at?: string
    updated_at: string
    created_at: string
}

export interface Keycard {
    id: string
    player_id: string
    blueprint_keycard_id: string
    count: number
    market_listed_count: number
    item_sale_ids?: string[]
    created_at: string
    blueprints: KeycardBlueprint
}

export interface KeycardBlueprint {
    id: string
    label: string
    description: string
    collection: string
    keycard_token_id: string
    image_url: string
    animation_url: string
    card_animation_url: string
    keycard_group: string
    syndicate?: string | null
    created_at: Date
}

export interface RewardResponse {
    label: string
    image_url: string
    locked_until: Date
    amount: string
}

export interface MysteryCrateOwnershipResp {
    allowed: number
    owned: number
}

export interface OpenCrateResponse {
    mech?: MechDetails
    power_core?: PowerCore
    mech_skin?: MechSkin
    weapon: Weapon[]
    weapon_skin?: WeaponSkin
}

export interface Rarity {
    label: string
    color: string
    textColor: string
}
