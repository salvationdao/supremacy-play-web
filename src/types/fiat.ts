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
    receipt_number: string
    receipt_url: string
    created_at: string
}
