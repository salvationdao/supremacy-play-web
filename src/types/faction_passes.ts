export interface FactionPass {
    id: string
    label: string
    last_for_days: number
    eth_price_wei: string
    usd_price: string
    sups_price: string
    discount_percentage: string
    deleted_at?: Date
}
