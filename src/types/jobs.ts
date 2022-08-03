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
    created_at: Date
}

export interface RepairJob extends RepairOffer {
    blocks_required_repair: number
    blocks_repaired: number
    sups_worth_per_block: string
    working_agent_count: number
}

export interface RepairStatus {
    id: string
    blocks_required_repair: number
    blocks_repaired: number
}

export enum FinishedReason {
    Abandoned = "ABANDONED",
    Expired = "Expired",
    Succeeded = "SUCCEEDED",
}

export interface RepairAgent {
    id: string
    repair_case_id: string
    repair_offer_id: string
    player_id: string
    started_at: Date
    finished_at?: Date
    finished_reason?: string
    required_stacks: number
}
