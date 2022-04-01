import { UserStat } from "."

export interface BanProposalStruct {
    id: string
    punish_option_id: string
    reason: string
    faction_id: string
    issued_by_id: string
    issued_by_username: string
    issued_by_player_gid: number
    reported_player_id: string
    reported_player_username: string
    reported_player_gid: number
    status: string
    started_at: Date
    ended_at: Date
    punish_option: BanOption
    decision?: { is_agreed: boolean }
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
}

export interface TextMessageData {
    from_user_id: string
    from_user_faction_id?: string
    from_username: string
    from_user_gid: number
    message_color?: string
    avatar_id?: string
    message: string
    total_multiplier?: number
    is_citizen?: boolean
    from_user_stat?: UserStat
    self?: boolean
}

export interface PunishMessageData {
    issued_by_player_id: string
    issued_by_player_username: string
    issued_by_player_faction_id: string
    reported_player_id: string
    issued_by_player_gid: number
    reported_player_gid: number
    reported_player_username: string
    reported_player_faction_id: string
    is_passed: boolean
    total_player_number: number
    agreed_player_number: number
    disagreed_player_number: number
    punish_option: BanOption
    punish_reason: string
}
