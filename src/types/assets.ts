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
    updated_at: Date
    created_at: Date
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
	ID               string              id: string              
	BlueprintID      string              blueprint_id: string              
	GenesisTokenID   decimal.NullDecimal genesis_token_id?: NullDecimal 
	Label            string              label: string              
	MechModel        string              mech_model: string              
	EquippedOn       null.String         equipped_on?: String         
	ImageURL         null.String         image_url?: String         
	AnimationURL     null.String         animation_url?: String         
	CardAnimationURL null.String         card_animation_url?: String         
	AvatarURL        null.String         avatar_url?: String         
	LargeImageURL    null.String         large_image_url?: String         
	CreatedAt        time.Time           created_at: Time           
}

export interface BlueprintMechSkin extends Collection {
	ID               string      id: string      
	Collection       string      collection: string      
	MechModel        string      mech_model: string      
	Label            string      label: string      
	Tier             string      tier?: string      
	ImageURL         null.String image_url?: String 
	AnimationURL     null.String animation_url?: String 
	CardAnimationURL null.String card_animation_url?: String 
	LargeImageURL    null.String large_image_url?: String 
	AvatarURL        null.String avatar_url?: String 
	CreatedAt        time.Time   created_at: Time   
}

export interface MechSkin extends Collection {
	label:string      
	image_url?:string 
	animation_url?:string 
	card_animation_url?:string 
	large_image_url?:string 
	avatar_url?:string 
	created_at:Date   
}

export interface MechAnimation extends Collection {
	*CollectionDetails
	ID             string      id: string      
	BlueprintID    string      blueprint_id: string      
	Label          string      label: string      
	MechModel      string      mech_model: string      
	EquippedOn     null.String equipped_on?: String 
	IntroAnimation null.Bool   intro_animation?: Bool   
	OutroAnimation null.Bool   outro_animation?: Bool   
	CreatedAt      time.Time   created_at: Time   
}

export interface PowerCore extends Collection {
	*CollectionDetails
	ID           string          id: string          
	Label        string          label: string          
	Size         string          size: string          
	Capacity     decimal.Decimal capacity: Decimal 
	MaxDrawRate  decimal.Decimal max_draw_rate: Decimal 
	RechargeRate decimal.Decimal recharge_rate: Decimal 
	Armour       decimal.Decimal armour: Decimal 
	MaxHitpoints decimal.Decimal max_hitpoints: Decimal 
	EquippedOn   null.String     equipped_on?: String     
	CreatedAt    time.Time       created_at: Time       
}

export interface Weapon extends Collection {
	*CollectionDetails
	ID                  string              id: string              
	BrandID             null.String         brand_id?: String         
	Label               string              label: string              
	Slug                string              slug: string              
	Damage              int                 damage: int                 
	BlueprintID         string              blueprint_id: string              
	DefaultDamageType   string              default_damage_type: string              
	GenesisTokenID      decimal.NullDecimal genesis_token_id?: NullDecimal 
	WeaponType          string              weapon_type: string              
	DamageFalloff       null.Int            damage_falloff?: Int            
	DamageFalloffRate   null.Int            damage_falloff_rate?: Int            
	Spread              decimal.NullDecimal spread?: NullDecimal 
	RateOfFire          decimal.NullDecimal rate_of_fire?: NullDecimal 
	Radius              null.Int            radius?: Int            
	RadiusDamageFalloff null.Int            radius_damage_falloff?: Int            
	ProjectileSpeed     decimal.NullDecimal projectile_speed?: NullDecimal 
	EnergyCost          decimal.NullDecimal energy_cost?: NullDecimal 
	MaxAmmo             null.Int            max_ammo?: Int            

	UpdatedAt time.Time updated_at: Time 
	CreatedAt time.Time created_at: Time 
}

export interface Utility extends Collection {
	*CollectionDetails
	ID             string              id: string              
	BrandID        null.String         brand_id?: String         
	Label          string              label: string              
	UpdatedAt      time.Time           updated_at: Time           
	CreatedAt      time.Time           created_at: Time           
	BlueprintID    string              blueprint_id: string              
	GenesisTokenID decimal.NullDecimal genesis_token_id?: NullDecimal 
	EquippedOn     null.String         equipped_on?: String         
	Type           string              type: string              

	Shield      *UtilityShield      shield?: UtilityShield      
	AttackDrone *UtilityAttackDrone attack_drone?: UtilityAttackDrone 
	RepairDrone *UtilityRepairDrone repair_drone?: UtilityRepairDrone 
	Accelerator *UtilityAccelerator accelerator?: UtilityAccelerator 
	AntiMissile *UtilityAntiMissile anti_missile?: UtilityAntiMissile 
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
