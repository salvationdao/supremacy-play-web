import { BlueprintPlayerAbility } from "./game"

export interface UserFromPassport {
    id: string
    avatar_id?: string
    chat_banned_until: Date
    created_at: Date
    deleted_at: Date
    discord_id: string
    email: string
    facebook_id: string
    faction_id: string
    first_name: string
    google_id: string
    keywords: string
    last_name: string
    metadata: Record<string, unknown>
    mint_lock: boolean
    mobile_number: string
    nonce: string
    old_password_required: boolean
    permissions: string
    private_address: string
    public_address: string
    rename_banned: boolean
    role_id: string
    sups: string
    total_lock: boolean
    twitch_id: string
    twitter_id: string
    two_factor_authentication_activated: boolean
    two_factor_authentication_is_set: boolean
    two_factor_authentication_secret: string
    updated_at: Date
    username: string
    verified: boolean
    withdraw_lock: boolean
}

export interface User {
    id: string
    username: string
    faction_id: string
    gid: number
    mobile_number?: string
    rank: UserRank
    features: Feature[]
}

export interface FactionStat {
    velocity: number
    recruit_number: number
    win_count: number
    loss_count: number
    kill_count: number
    death_count: number
    mvp: User
}

export interface Transaction {
    id: string
    amount: string
    transaction_reference: string
    created_at: Date
    description: string
    debit: string
    credit: string
    group: string
    sub_group: string
}

export type UserRank = "NEW_RECRUIT" | "PRIVATE" | "CORPORAL" | "GENERAL"

export enum FactionName {
    RedMountainOffworldMiningCorporation = "Red Mountain Offworld Mining Corporation",
    BostonCybernetics = "Boston Cybernetics",
    ZaibatsuHeavyIndustries = "Zaibatsu Heavy Industries",
}

export interface Faction {
    id: string
    label: string
    logo_url: string
    background_url: string
    wallpaper_url: string
    primary_color: string
    secondary_color: string
    background_color: string
    description: string
}

export interface UserStat {
    id: string
    view_battle_count: number
    last_seven_days_kills: number
    total_ability_triggered: number
    ability_kill_count: number
    mech_kill_count: number
}

export interface Feature {
    id: string
    name: FeatureName
}

export enum FeatureName {
    mechMove = "MECH_MOVE",
    playerAbility = "PLAYER_ABILITY",
    systemMessages = "SYSTEM_MESSAGES",
    chatBan = "CHAT_BAN",
    profileAvatar = "PROFILE_AVATAR",
}

export enum SystemMessageDataType {
    MechQueue = "MECH_QUEUE",
    MechBattleComplete = "MECH_BATTLE_COMPLETE",
    Global = "GLOBAL",
    Faction = "FACTION",
    PlayerAbilityRefunded = "PLAYER_ABILITY_REFUNDED",
}

export interface SystemMessage {
    id: string
    player_id: string
    sender_id: string
    data_type: SystemMessageDataType
    title: string
    message: string
    data: unknown | null
    sent_at: Date
    read_at?: Date
    sender: User
}

export interface SystemMessageDataMechBattleComplete {
    rewarded_sups: string
    rewarded_sups_bonus: string
    rewarded_player_ability?: BlueprintPlayerAbility
    mech_battle_briefs: MechBattleBriefStruct[]
}

export interface MechBattleBriefStruct {
    mech_id: string
    faction_id: string
    kills: KillInfo[]
    killed: KillInfo | null
    label: string
    name: string
}

export interface KillInfo {
    name: string
    faction_id: string
}

export enum QuestKey {
    AbilityKill = "ability_kill",
    MechKill = "mech_kill",
    MechCommanderUsedInBattle = "mech_commander_used_in_battle",
    RepairForOther = "repair_for_other",
    ChatSent = "chat_sent",
    MechJoinBattle = "mech_join_battle",
}

export interface QuestStat {
    id: string
    name: string
    round_name: string
    key: QuestKey
    description: string
    obtained: boolean
    end_at: Date
}

export interface QuestProgress {
    quest_id: string
    current: number
    goal: number
}

export interface LeaderboardRound {
    id: string
    name: string
    started_at: Date
    end_at: Date
}
