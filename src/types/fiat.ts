export enum FiatProductType {
    StarterPackage = "starter_package",
    MechSkin = "mech_skin",
    WeaponSkin = "weapon_skin",
    MechAnimation = "mech_animation",
}

export interface FiatProduct {
    id: string
    name: string
    description: string
    currency: string
    price_dollars: number
    price_cents: number
}

export interface FiatBillingHistory {
    id: string
    paid: boolean
    refunded: boolean
    items: FiatBillingHistoryItem[]
    currency: string
    total_dollars: number
    total_cents: number
    receipt_number: string
    receipt_url: string
    created_at: string
}

export interface FiatBillingHistoryItem {
    id: string
    description: string
    currency: string
    quantity: number
    total_dollars: number
    total_cents: number
    subtotal_dollars: number
    subtotal_cents: number
    tax_dollars: number
    tax_cents: number
}
