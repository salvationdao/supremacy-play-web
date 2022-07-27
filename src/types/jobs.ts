export interface RepairOffer {
    id: string
    repair_case_id: string
    is_self: boolean
    blocks_total: number
    offered_sups_amount: string
    expires_at: Date
    finished_reason?: string
    closed_at?: Date
    ownerID: string
}
