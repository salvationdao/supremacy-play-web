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
    receipt_number: string
    receipt_url: string
    created_at: string
}

export interface FiatBillingHistoryItem {
    id: string
    description: string
    currency: string
    quantity: number
    amount_total_dollars: number
    amount_total_cents: number
    amount_subtotal_dollars: number
    amount_subtotal_cents: number
    amount_tax_dollars: number
    amount_tax_cents: number
}
