export enum GameServerKeys {
    // Auth container
    Welcome = "WELCOME",
    UserSubscribe = "USER:SUBSCRIBE",
    AuthSessionIDGet = "AUTH:SESSION:ID:GET",

    // Notification container
    SubGameNotification = "GAME:NOTIFICATION",

    // Voting abilities
    SubVoteStageUpdated = "VOTE:STAGE:UPDATED",
    SubVoteWinnerAnnouncement = "VOTE:WINNER:ANNOUNCEMENT",
    SubBattleAbility = "VOTE:BATTLE:ABILITY:UPDATED",
    SubFactionAbilities = "FACTION:ABILITIES:UPDATED",
    SubmitVoteAbilityRight = "VOTE:ABILITY:RIGHT",
    SubmitAbilityLocationSelect = "ABILITY:LOCATION:SELECT",
    GameAbilityContribute = "GAME:ABILITY:CONTRIBUTE",
    SubWarMachineAbilitiesUpdated = "WAR:MACHINE:ABILITIES:UPDATED",

    // Net message subscription
    TriggerLiveVoteUpdated = "LIVE:VOTE:UPDATED",
    TriggerWarMachineLocationUpdated = "WAR:MACHINE:LOCATION:UPDATED",
    TriggerViewerLiveCountUpdated = "VIEWER:LIVE:COUNT:UPDATED",
    TriggerSpoilOfWarUpdated = "SPOIL:OF:WAR:UPDATED",
    TriggerAbilityRightRatio = "ABILITY:RIGHT:RATIO:UPDATED",
    TriggerFactionAbilityPriceUpdated = "FACTION:ABILITY:PRICE:UPDATED",
    TriggerFactionVotePriceUpdated = "FACTION:VOTE:PRICE:UPDATED",

    // Global messages
    SubscribeGlobalAnnouncement = "GLOBAL_ANNOUNCEMENT:SUBSCRIBE",

    // Streams
    GetStreamList = "STREAMLIST:SUBSCRIBE",
    SubscribeStreamClose = "STREAM:CLOSE:SUBSCRIBE",

    // Queue
    JoinQueue = "BATTLE:QUEUE:JOIN",
    LeaveQueue = "WAR:WARMACHINE:QUEUE:LEAVE",

    // Get / sub to data
    SubWarMachineDestroyed = "WAR:MACHINE:DESTROYED:UPDATED",
    SubAISpawned = "AI:SPAWNED",
    GetFactionsColor = "FACTION:COLOUR",
    GetFactionVotePrice = "FACTION:VOTE:PRICE",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",
    SubFactionQueueLength = "FACTION:QUEUE:JOIN",
    SubscribeSupsMultiplier = "USER:SUPS:MULTIPLIER:SUBSCRIBE",
}

export enum PassportServerKeys {
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

    // Chat
    SendChatMessage = "CHAT:MESSAGE",
    SubscribeFactionStat = "FACTION:STAT:SUBSCRIBE",
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",

    // Assets
    SubAssetList = "USER:ASSET:LIST",
    SubAssetData = "ASSET:SUBSCRIBE",
    SubAssetQueuePosition = "WAR:MACHINE:QUEUE:POSITION:SUBSCRIBE",
    SubAssetDurability = "ASSET:DURABILITY:SUBSCRIBE",

    // Transactions
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",
    SubscribeUserLatestTransactions = "USER:SUPS:LATEST_TRANSACTION:SUBSCRIBE",
}
