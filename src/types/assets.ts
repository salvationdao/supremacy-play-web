import { Battle, Faction, Map, User, Vector2i } from "."

export enum RarityEnum {
    Mega = "MEGA",
    Colossal = "COLOSSAL",
    Rare = "RARE",
    Legendary = "LEGENDARY",
    EliteLegendary = "ELITE_LEGENDARY",
    UltraRare = "ULTRA_RARE",
    Exotic = "EXOTIC",
    Guardian = "GUARDIAN",
    Mythic = "MYTHIC",
    DeusEx = "DEUS_EX",
    Titan = "TITAN",
}

export enum MechStatusEnum {
    Idle = "IDLE",
    PendingQueue = "PENDING_QUEUE",
    Queue = "QUEUE",
    Battle = "BATTLE",
    Market = "MARKET",
    Sold = "SOLD",
    BattleReady = "BATTLE_READY",
    Damaged = "DAMAGED",
}

export enum PowerCoreSize {
    Small = "SMALL",
    Medium = "MEDIUM",
    Large = "LARGE",
}

export type UtilityObjectType<T> = T extends UtilityType.Shield
    ? UtilityShield
    : T extends UtilityType.AttackDrone
    ? UtilityAttackDrone
    : T extends UtilityType.RepairDrone
    ? UtilityRepairDrone
    : T extends UtilityType.AntiMissile
    ? UtilityAntiMissile
    : T extends UtilityType.Accelerator
    ? UtilityAccelerator
    : never

export enum UtilityType {
    Shield = "SHIELD",
    AttackDrone = "ATTACK DRONE",
    RepairDrone = "REPAIR DRONE",
    AntiMissile = "ANTI MISSILE",
    Accelerator = "ACCELERATOR",
}

export enum WeaponType {
    Cannon = "Cannon",
    Sword = "Sword",
    Minigun = "Minigun",
    MissileLauncher = "Missile Launcher",
    PlasmaGun = "Plasma Gun",
    SniperRifle = "Sniper Rifle",
    GrenadeLauncher = "Grenade Launcher",
    MachineGun = "Machine Gun",
    Flak = "Flak",
    Flamethrower = "Flamethrower",
    LaserBeam = "Laser Beam",
    LightningGun = "Lightning Gun",
    BFG = "BFG",
    Rifle = "Rifle",
}

export enum AssetItemType {
    Mech = "mech",
    Weapon = "weapon",
    MechSkin = "mech_skin",
    WeaponSkin = "weapon_skin",
    PowerCore = "power_core",
    Utility = "utilities",
    IntroAnimation = "intro_animation",
    OutroAnimation = "outro_animation",
}

export enum MechRepairStatEnum {
    Pending = "PENDING",
    StandardRepair = "STANDARD_REPAIR",
    FastRepair = "FAST_REPAIR",
}

export interface MechRepairStatus {
    repair_status: MechRepairStatEnum
    remain_seconds?: number
}

export interface RepairSlot {
    id: string
    player_id: string
    mech_id: string
    repair_case_id: string
    status: string
    next_repair_time: Date
    slot_number: number
}

export interface MechStatus {
    status: MechStatusEnum
    can_deploy: boolean
    queue_position: number | null
}

export interface Images {
    image_url?: string
    animation_url?: string
    card_animation_url?: string
    avatar_url?: string
    large_image_url?: string
    external_url?: string
    youtube_url?: string
}

export interface Collection {
    collection_slug: string
    hash: string
    token_id: number
    item_type: AssetItemType
    item_id: string
    tier: string
    owner_id: string
    on_chain_status: string
    locked_to_marketplace: boolean
    xsyn_locked: boolean
    market_locked: boolean
    item_sale_id?: string
}

export interface MechBasic extends Collection, Images {
    id: string
    label: string
    weapon_hardpoints: number
    utility_slots: number
    speed: number
    boosted_speed: number
    max_hitpoints: number
    boosted_max_hitpoints: number
    is_default: boolean
    is_insured: boolean
    name: string
    repair_blocks: number
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
    queue_position: number | null
    updated_at: Date
    created_at: Date
}

export interface MechBasicWithQueueStatus extends MechBasic {
    in_queue: boolean
}

export interface MechDetails extends MechBasic {
    blueprint_mech?: BlueprintMech
    brand: Brand
    user: User
    faction?: Faction
    default_chassis_skin: BlueprintMechSkin
    chassis_skin?: MechSkin
    intro_animation?: MechAnimation
    outro_animation?: MechAnimation
    power_core?: PowerCore
    weapons?: Weapon[]
    utility?: Utility[]
    battle_ready: boolean
    blueprint_weapon_ids_with_skin_inheritance: string[]
}

export interface BlueprintMech {
    id: string
    brand_id: string
    label: string
    weapon_hardpoints: number
    utility_slots: number
    speed: number
    max_hitpoints: number
    created_at: Date
    power_core_size?: string
    tier?: string
    default_chassis_skin_id: string
    collection: string
    repair_blocks: number
    boost_stat: string
    mech_type: string
    availability_id?: string
}

export interface Brand {
    id: string
    faction_id: string
    label: string
    deleted_at?: Date
    updated_at: Date
    created_at: Date
}

export interface BlueprintMechSkin extends Collection, Images {
    id: string
    collection: string
    mech_model: string
    label: string
    created_at: Date
}

export interface MechSkin extends Collection, Images {
    id: string
    blueprint_id: string
    label: string
    equipped_on?: string
    locked_to_mech: boolean
    level: number
    default_level: number
    genesis_token_id: number
    limited_release_token_id: number
    tier: RarityEnum
    collection: string
    created_at: Date
}

export interface MechAnimation extends Collection, Images {
    id: string
    blueprint_id: string
    label: string
    mech_model: string
    equipped_on?: string
    intro_animation?: boolean
    outro_animation?: boolean
    created_at: Date
}

export interface PowerCore extends Collection, Images {
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

export interface PowerCoreMaxStats {
    capacity: number
    max_draw_rate: number
    recharge_rate: number
    armour: number
    max_hitpoints: number
}

export interface Weapon extends Collection, Images {
    id: string
    brand_id?: string
    label: string
    slug: string
    damage: number
    blueprint_id: string
    default_damage_type: string
    genesis_token_id?: number
    equipped_on?: string
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
    weapon_skin?: WeaponSkin
    updated_at: Date
    created_at: Date
    market_locked: boolean
    item_sale_id?: string
    slot_number?: number
    locked_to_mech: boolean
}

export interface WeaponSkin extends Collection, Images {
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

export interface WeaponMaxStats {
    max_ammo?: number
    damage: number
    damage_falloff?: number
    damage_falloff_rate?: number
    spread?: number
    rate_of_fire?: number
    radius?: number
    radius_damage_falloff?: number
    projectile_speed?: number
    energy_cost?: number
}

export interface Utility extends Collection, Images {
    id: string
    brand_id?: string
    label: string
    updated_at: Date
    created_at: Date
    blueprint_id: string
    genesis_token_id?: number
    equipped_on?: string
    type: UtilityType
    locked_to_mech: boolean
    slot_number?: number

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
    boosted_recharge_rate: number
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
    boosted_seconds: number
    boosted_amount: number
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
    battle?: {
        battle: Battle
        game_map?: Map
    }
    mech?: MechDetails
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

export interface AbilityDetail {
    radius: number
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
    ownerUsername: string
    modelID: string
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

export enum MysteryCrateType {
    Mech = "MECH",
    Weapon = "WEAPON",
}

export interface StorefrontMysteryCrate extends Images {
    id: string
    mystery_crate_type: MysteryCrateType
    price: string
    amount: number
    amount_sold: number
    faction_id: string
    label: string
    description: string
    youtube_url?: string
}

export interface MysteryCrate extends Collection, Images {
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

export interface KeycardBlueprint extends Images {
    id: string
    label: string
    description: string
    collection: string
    keycard_token_id: string
    keycard_group: string
    syndicate?: string | null
    created_at: Date
}

export interface RewardResponse {
    mystery_crate?: StorefrontMysteryCrate
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
    id: string
    mech?: MechDetails
    power_core?: PowerCore
    mech_skins?: MechSkin[]
    weapon: Weapon[]
    weapon_skins?: WeaponSkin[]
}

export interface Rarity {
    label: string
    color: string
    textColor: string
}

export interface StorefrontPackage {
    id: string
    name: string
    description: string
    currency: string
    price_dollars: number
    price_cents: number
}

export interface Submodel {
    images: Images
    collection_slug: string
    hash: string
    id: string
    label: string
    owner_id: string
    tier: string
    token_id: number
    locked_to_marketplace: boolean
    market_locked: boolean
    xsyn_locked: boolean
    updated_at: Date
    created_at: Date
    level?: number
}

export enum SubmodelStatus {
    Equipped = "EQUIPPED",
    Unequipped = "UNEQUIPPED",
}

export interface BlueprintWeapon {
    id: string
    label: string
    damage: number
    weapon_type: string
    default_damage_type: string
    damage_falloff?: number
    damage_falloff_rate?: number
    spread?: string
    rate_of_fire?: string
    radius?: number
    radius_damage_falloff?: number
    projectile_speed?: string
    max_ammo?: number
    power_cost?: string
    collection: string
    brand_id?: string
    default_skin_id: string
    is_melee: boolean
    projectile_amount?: number
    dot_tick_damage?: string
    dot_max_ticks?: number
    is_arced?: boolean
    charge_time_seconds?: string
    burst_rate_of_fire?: string
}
