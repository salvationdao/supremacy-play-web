export enum FiatProductType {
    StarterPackage = "starter_package",
    MysteryCrate = "mystery_crate",
    MechSkin = "mech_skin",
    WeaponSkin = "weapon_skin",
    MechAnimation = "mech_animation",
}

export interface FiatProduct {
    id: string
    product_type: FiatProductType
    name: string
    description: string
    currency: string
    avatar_url: string
    pricing: FiatProductPricing[]
}

export interface FiatProductPricing {
    currency_code: string
    amount: string
}

export interface FiatOrder {
    id: string
    user_id: string
    order_status: string
    payment_method: string
    txn_reference: string
    currency: string
    created_at: string
    items: FiatOrderItem[]
}

export interface FiatOrderItem {
    id: string
    order_id: string
    fiat_product_id: string
    name: string
    description: string
    quantity: number
    amount: string
}

export interface ShoppingCart {
    items: ShoppingCartItem[]
    created_at: string
    expires_at: string
}

export interface ShoppingCartItem {
    id: string
    quantity: number
    product: FiatProduct
}
