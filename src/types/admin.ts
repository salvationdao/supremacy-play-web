import { User } from "./user"
import { MechBasic } from "./assets"
import BigNumber from "bignumber.js"
import { ChatMessage } from "./chat"

export interface GetUserResp {
    user: User
    user_assets: AdminGetUserAsset | undefined
    ban_history: AdminPlayerBan | undefined
    recent_chat_history: ChatMessage[] | undefined
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