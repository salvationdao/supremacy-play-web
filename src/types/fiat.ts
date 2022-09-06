export interface BillingHistory {
    id: string
    paid: boolean
    refunded: boolean
    receipt_number: string
    receipt_url: string
    created_at: string
}
