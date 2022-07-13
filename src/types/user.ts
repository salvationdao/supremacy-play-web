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

export interface MultiplierUpdateResp {
    battles: BattleMultipliers[]
}

export interface BattleMultipliers {
    battle_number: number
    total_multipliers: number
    multipliers: Multiplier[]
}

export interface Multiplier {
    key: string
    value: string
    description: string
    is_multiplicative: boolean
    battle_number: number
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
    publicProfilePage = "PUBLIC_PROFILE",
}
