import BigNumber from "bignumber.js"
import { MechDetails } from "./assets"
import { User } from "./user"

export interface GetUserResp {
    user: User
    user_assets: AdminGetUserAsset | undefined
    ban_history: AdminPlayerBan[] | undefined
    active_ban: AdminPlayerBan[] | undefined
    recent_chat_history: AdminChatView[] | undefined
    related_accounts: User[]
}

export interface AdminGetUserAsset {
    mechs?: MechDetails[]
    sups: BigNumber
}

export interface AdminPlayerBan {
    id: string
    reason: string
    end_at: Date
    created_at: Date
    banned_by: User
    banned_at: Date
    manually_unbanned: boolean
    manually_unbanned_reason: string | undefined
}

export interface AdminChatView {
    text: string
    created_at: Date
}

export interface AdminLookupHistoryResp {
    username: string
    gid: number
    faction_id?: string
    visited_on: Date
}
