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

export interface Transaction {
    amount: string
    transaction_reference: string
    created_at: Date
    description: string
    debit: string
    credit: string
    group: string
    sub_group: string
}
