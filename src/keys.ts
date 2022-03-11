export enum GameServerKeys {
    // Auth container
    Welcome = "WELCOME",
    UserSubscribe = "USER:SUBSCRIBE",
    AuthSessionIDGet = "AUTH:SESSION:ID:GET",
    RingCheck = "RING:CHECK",

    // Notification container
    SubGameNotification = "GAME:NOTIFICATION",

    // Voting abilities
    SubBribeStageUpdated = "BRIBE:STAGE:UPDATED:SUBSCRIBE",
    SubBribeWinnerAnnouncement = "BRIBE:WINNER:SUBSCRIBE",
    SubBattleAbility = "BATTLE:ABILITY:UPDATED",
    SubFactionUniqueAbilities = "FACTION:UNIQUE:ABILITIES:UPDATED",
    SubWarMachineAbilitiesUpdated = "WAR:MACHINE:ABILITIES:UPDATED",
    ContributeFactionUniqueAbility = "FACTION:UNIQUE:ABILITY:CONTRIBUTE",
    BribeBattleAbility = "BATTLE:ABILITY:BRIBE",
    SubmitAbilityLocationSelect = "ABILITY:LOCATION:SELECT",

    // Game Use
    GameUserOnline = "GAME:ONLINE",

    // Net message subscription
    TriggerWarMachineLocationUpdated = "WAR:MACHINE:LOCATION:UPDATED",
    TriggerSpoilOfWarUpdated = "SPOIL:OF:WAR:UPDATED",
    TriggerFactionAbilityPriceUpdated = "ABILITY:PRICE:UPDATED",
    TriggerBattleAbilityProgressUpdated = "BATTLE:ABILITY:PROGRESS:BAR:UPDATED",

    // Global messages
    SubGlobalAnnouncement = "GLOBAL_ANNOUNCEMENT:SUBSCRIBE",
    SubStreamClose = "STREAM:CLOSE:SUBSCRIBE",

    // Streams
    GetStreamList = "STREAMLIST:SUBSCRIBE",

    // Queue
    JoinQueue = "BATTLE:QUEUE:JOIN",
    LeaveQueue = "WAR:WARMACHINE:QUEUE:LEAVE",

    // Get / sub to data
    SubWarMachineDestroyed = "WAR:MACHINE:DESTROYED:UPDATED",
    SubAISpawned = "AI:SPAWNED",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",
    SubFactionQueueLength = "FACTION:QUEUE:JOIN",
    SubscribeSupsMultiplier = "USER:SUPS:MULTIPLIER:SUBSCRIBE",
    SubViewersLiveCount = "VIEWER:LIVE:COUNT:UPDATED",
}

export enum PassportServerKeys {
    // Auth container
    Welcome = "WELCOME",
    GetSessionID = "GAMEBAR:SESSION:ID:GET",
    AuthRingCheck = "GAMEBAR:AUTH:RING:CHECK",
    SubscribeGamebarUser = "GAMEBAR:USER:SUBSCRIBE",
    SubscribeUser = "USER:SUBSCRIBE",

    // Bar
    GetFactionsAll = "FACTION:ALL",
    EnlistFaction = "FACTION:ENLIST",
    SubscribeWallet = "USER:SUPS:SUBSCRIBE",
    SubscribeUserStat = "USER:STAT:SUBSCRIBE",
    SubscribeFactionStat = "FACTION:STAT:SUBSCRIBE",

    // Chat
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",
    SendChatMessage = "CHAT:MESSAGE",

    // Assets
    SubAssetList = "USER:ASSET:LIST",
    SubAssetData = "ASSET:SUBSCRIBE",
    SubAssetQueuePosition = "WAR:MACHINE:QUEUE:POSITION:SUBSCRIBE",

    // Transactions
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",
    SubscribeUserLatestTransactions = "USER:SUPS:LATEST_TRANSACTION:SUBSCRIBE",
}
