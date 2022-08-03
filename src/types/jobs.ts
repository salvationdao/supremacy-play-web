import { User } from "./user"

export interface RepairOffer {
    id: string
    repair_case_id: string
    offered_by_id: string
    expires_at: Date
    finished_reason?: string
    closed_at?: string
    blocks_required_repair: number
    blocks_repaired: number
    sups_worth_per_block: string
    working_agent_count: number
    job_owner: User
    created_at: Date
    blocks_total: number
    offered_sups_amount: string
}

export interface RepairJob extends RepairOffer {
    blocks_required_repair: number
    blocks_repaired: number
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
