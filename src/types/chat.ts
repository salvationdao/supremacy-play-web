import { UserRank, User, UserStat } from "."

export interface BanProposalStruct {
    id: string
    punish_option_id: string
    reason: string
    faction_id: string
    issued_by_id: string
    issued_by_username: string
    issued_by_gid: number
    reported_player_id: string
    reported_player_username: string
    reported_player_gid: number
    status: string
    started_at: Date
    ended_at: Date
    punish_option: BanOption
    decision?: { is_agreed: boolean }
    instant_pass_by_id?: string
    instant_pass_fee: string
    instant_pass_tx_id?: string
}

export interface PunishListItem {
    id: string
    player_id: string
    punish_option_id: string
    punish_until: Date
    related_punish_vote_id: string
    created_at: Date
    updated_at: Date
    deleted_at: Date
    related_punish_vote: {
        id: string
        punish_option_id: string
        reason: string
        faction_id: string
        issued_by_id: string
        issued_by_username: string
        issued_by_gid: number
        reported_player_id: string
        reported_player_username: string
        reported_player_gid: number
        status: "PASSED" | "FAILED" | "PENDING"
        started_at: Date
        ended_at: Date
        created_at: Date
        updated_at: Date
        deleted_at: Date
    }
    punish_option: {
        id: string
        description: string
        key: string
        punish_duration_hours: 24
        created_at: Date
        updated_at: Date
        deleted_at: Date
    }
}

export interface BanUser {
    id: string
    username: string
    gid: number
}

export interface BanOption {
    id: string
    description: string
    key: string
    punish_duration_hours: number
}

export interface ChatMessageType {
    type: "TEXT" | "PUNISH_VOTE"
    data: TextMessageData | PunishMessageData
    sent_at: Date
    locallySent?: boolean
}

export interface TextMessageData {
    from_user: User
    message_color?: string
    avatar_id?: string
    message: string
    user_rank?: UserRank
    total_multiplier?: number
    is_citizen?: boolean
    from_user_stat?: UserStat
}

export interface PunishMessageData {
    issued_by_user: User
    reported_user: User
    is_passed: boolean
    instant_pass_by_user: User
    total_player_number: number
    agreed_player_number: number
    disagreed_player_number: number
    punish_option: BanOption
    punish_reason: string
}
