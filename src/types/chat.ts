import { User, UserRank, UserStat } from "."

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
    instant_pass_fee: string
    instant_pass_user_ids: string[]
}

export interface PunishListItem {
    id: string
    related_punish_vote_id: string
    ban_from: string
    battle_number?: number
    banned_player_id: string
    banned_by_id: string
    reason: string
    banned_at: Date
    end_at: Date
    manually_unban_by_id?: string
    manually_unban_reason?: string
    manually_unban_at?: Date
    ban_sups_contribute: boolean
    ban_location_select: boolean
    ban_send_chat: boolean
    ban_view_chat: boolean
    restrictions: string[]
    ban_by_user: User
    created_at: Date
    updated_at: Date
    deleted_at: Date
    is_permanent: boolean
    related_punish_vote?: {
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
    id?: string
    type: "TEXT" | "PUNISH_VOTE" | "SYSTEM_BAN" | "NEW_BATTLE"
    data: TextMessageData | PunishMessageData | SystemBanMessageData | NewBattleMessageData
    sent_at: Date
    locallySent?: boolean
}

export interface TextMessageMetadata {
    likes: {
        likes: number
        dislikes: number
        net: number
    }
    tagged_users_read: TaggedUsersRead
}

export type TaggedUsersRead = { [gid: number]: boolean }

export interface TextMessageData {
    id?: string
    from_user: User
    message_color?: string
    avatar_id?: string
    message: string
    user_rank?: UserRank
    from_user_stat?: UserStat
    tagged_users_gids?: number[]
    metadata?: TextMessageMetadata
}

export interface PunishMessageData {
    issued_by_user: User
    reported_user: User
    is_passed: boolean
    total_player_number: number
    agreed_player_number: number
    disagreed_player_number: number
    punish_option: BanOption
    punish_reason: string
    instant_pass_by_users: User[]
}

export interface SystemBanMessageData {
    banned_by_user: User
    banned_user: User
    faction_id: string
    battle_number?: number
    reason: string
    ban_duration: string
    is_permanent_ban: boolean
    restrictions: string[]
}

export interface NewBattleMessageData {
    battle_number: number
}
