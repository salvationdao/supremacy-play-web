export interface FactionTheme {
    primary: string
    secondary: string
    background: string
}

export interface FactionGeneralData {
    id: string
    label: string
    logoBlobID: string
    backgroundBlobID: string
    theme: FactionTheme
    description: string
}

export interface FactionStat {
    velocity: number
    recruitNumber: number
    winCount: number
    lossCount: number
    killCount: number
    deathCount: number
    mvp: UserData
}

export interface UserFactionData {
    recruitID: string
    supsEarned: number
    rank: string
    spectatedCount: number

    // Faction specific
    theme: FactionTheme
    logoBlobID: string
    backgroundBlobID: string
}

export interface UserData {
    id: string
    username: string
    avatarID: string
    factionID: string
    faction: FactionGeneralData
}

export interface UserStat {
    id: string
    viewBattleCount: number
    totalVoteCount: number
    totalAbilityTriggered: number
    killCount: number
}

export interface ChatData {
    fromUserID: string
    fromUsername: string
    messageColor?: string
    factionColour?: string
    factionLogoBlobID?: string
    avatarID?: string
    message: string
    sentAt: Date
}

export interface Transaction {
    amount: string
    transactionReference: string
    createdAt: Date
    description: string
    debit: string
    credit: string
}
