export interface FactionTheme {
    primary: string
    secondary: string
    background: string
}

export interface FactionGeneralData {
    id: string
    label: string
    logo_blob_id: string
    background_blob_id: string
    theme: FactionTheme
    description: string
}

export interface FactionStat {
    velocity: number
    recruit_number: number
    win_count: number
    loss_count: number
    kill_count: number
    death_count: number
    mvp: UserData
}

export interface UserFactionData {
    recruit_id: string
    sups_earned: number
    rank: string
    spectated_count: number

    // Faction specific
    theme: FactionTheme
    logo_blob_id: string
    background_blob_id: string
}

export interface UserData {
    id: string
    username: string
    avatar_id: string
    faction_id: string
    faction: FactionGeneralData
}

export interface UserStat {
    id: string
    view_battle_count: number
    total_vote_count: number
    total_ability_triggered: number
    kill_count: number
}

export interface ChatData {
    from_user_id: string
    from_username: string
    message_color?: string
    faction_colour?: string
    faction_logo_blob_id?: string
    avatar_id?: string
    message: string
    sent_at: Date
}

export interface Transaction {
    amount: string
    transaction_reference: string
    created_at: Date
    description: string
    debit: string
    credit: string
}
