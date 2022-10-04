import BigNumber from "bignumber.js"
import { MechBasic } from "./assets"
import { TextMessageData } from "./chat"
import { User } from "./user"

export interface GetUserResp {
    user: User
    user_assets: AdminGetUserAsset | undefined
    ban_history: AdminPlayerBan | undefined
    recent_chat_history: AdminChatView[] | undefined
    related_accounts: User[]
}

export interface AdminGetUserAsset {
    mechs: MechBasic[]
    sups: BigNumber
}

export interface AdminPlayerBan {
    id: string
    reason: string
    end_at: Date
}

export interface AdminChatView {
    text: string
    created_at: Date
}
