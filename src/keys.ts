export enum GameServerKeys {
    // Auth container
    Welcome = "WELCOME",
    UserSubscribe = "USER:SUBSCRIBE",
    AuthSessionIDGet = "AUTH:SESSION:ID:GET",
    GetSessionID = "GAMEBAR:SESSION:ID:GET",
    AuthRingCheck = "GAMEBAR:AUTH:RING:CHECK",
    SubscribeGamebarUser = "GAMEBAR:USER:SUBSCRIBE",

    // Game container
    GetFactionsColor = "FACTION:COLOUR",
    GetFactionVotePrice = "FACTION:VOTE:PRICE",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubVoteStageUpdated = "VOTE:STAGE:UPDATED",
    SubVoteWinnerAnnouncement = "VOTE:WINNER:ANNOUNCEMENT",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",
    SubFactionQueueLength = "FACTION:QUEUE:JOIN",
    SubFactionQueueLeaveLength = "FACTION:QUEUE:LEAVE",

    // Notification container
    SubGameNotification = "GAME:NOTIFICATION",

    // In components
    SubBattleAbility = "VOTE:BATTLE:ABILITY:UPDATED",
    SubFactionAbilities = "FACTION:ABILITIES:UPDATED",
    SubmitVoteAbilityRight = "VOTE:ABILITY:RIGHT",
    SubmitAbilityLocationSelect = "ABILITY:LOCATION:SELECT",
    GameAbilityContribute = "GAME:ABILITY:CONTRIBUTE",
    SubWarMachineDestroyed = "WAR:MACHINE:DESTROYED:UPDATED",
    SubWarMachineAbilitiesUpdated = "WAR:MACHINE:ABILITIES:UPDATED",
    SubUserWarMachineQueueUpdated = "USER:WAR:MACHINE:QUEUE:UPDATED",
    SubAISpawned = "AI:SPAWNED",

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
    SubscribeStreamClose = "STREAM:CLOSE:SUBSCRIBE",
    GetStreamList = "STREAMLIST:SUBSCRIBE",

    LeaveQueue = "WAR:WARMACHINE:QUEUE:LEAVE",
}

export enum PassportServerKeys {
    Welcome = "WELCOME",
    GetSessionID = "GAMEBAR:SESSION:ID:GET",
    GetFactionsAll = "FACTION:ALL",
    EnlistFaction = "FACTION:ENLIST",
    SendChatMessage = "CHAT:MESSAGE",
    AuthRingCheck = "GAMEBAR:AUTH:RING:CHECK",
    SubscribeGamebarUser = "GAMEBAR:USER:SUBSCRIBE",
    SubscribeUser = "USER:SUBSCRIBE",
    SubscribeWallet = "USER:SUPS:SUBSCRIBE",
    SubscribeFactionStat = "FACTION:STAT:SUBSCRIBE",
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",
    SubscribeUserStat = "USER:STAT:SUBSCRIBE",
    SubscribeSupsMultiplier = "USER:SUPS:MULTIPLIER:SUBSCRIBE",

    // Assets
    SubAssetList = "USER:ASSET:LIST",
    SubAssetData = "ASSET:SUBSCRIBE",
    SubAssetQueuePosition = "WAR:MACHINE:QUEUE:POSITION:SUBSCRIBE",
    SubAssetDurability = "ASSET:DURABILITY:SUBSCRIBE",
    SubFactionContractReward = "FACTION:CONTRACT:REWARD:SUBSCRIBE",
    JoinQueue = "ASSET:QUEUE:JOIN",

    // Transactions
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",
    SubscribeUserLatestTransactions = "USER:SUPS:LATEST_TRANSACTION:SUBSCRIBE",
}
