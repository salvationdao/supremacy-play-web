export interface AssetDurability {
    hash: string
    started_at: Date
    expect_completed_at: Date
    repair_type: "FAST" | "STANDARD" | ""
}

export interface Asset {
    id: string
    hash: string
    collection_id: string
    store_item_id: string
    tier: string
    owner_id: string
    created_at: Date
    on_chain_status: string
    unlocked_at: Date
    data: {
        mech: {
            id: string
            owner_id: string
            template_id: string
            chassis_id: string
            external_token_id: number
            tier: string
            is_default: false
            image_url: string
            animation_url: string
            avatar_url: string
            hash: string
            name: string
            label: string
            slug: string
            asset_type: string
            deleted_at?: Date
            updated_at: Date
            created_at: Date
        }
        chassis: {
            id: string
            brand_id: string
            label: string
            model: string
            skin: string
            slug: string
            shield_recharge_rate: number
            health_remaining: number
            weapon_hardpoints: number
            turret_hardpoints: number
            utility_slots: number
            speed: number
            max_hitpoints: number
            max_shield: number
            deleted_at?: Date
            updated_at: Date
            created_at: Date
        }
        weapons: {
            id: string
            brand_id: string
            label: string
            slug: string
            damage: number
            weapon_type: string
            deleted_at?: Date
            updated_at: Date
            created_at: Date
        }[]
    }
}

export interface Attribute {
    display_type?: "number"
    trait_type: string
    token_id?: number
    value: string | number
}
