import { User } from "./user"

export interface RepairOffer {
    id: string
    repair_case_id: string
    is_self: boolean
    blocks_total: number
    offered_sups_amount: string
    expires_at: Date
    finished_reason?: FinishedReason
    closed_at?: Date
    offered_by_id: string
    job_owner: User
}

export interface RepairStatus {
    blocks_required_repair: number
    blocks_repaired: number
}

export enum FinishedReason {
    Abandoned = "ABANDONED",
    Expired = "Expired",
    Succeeded = "SUCCEEDED",
}
