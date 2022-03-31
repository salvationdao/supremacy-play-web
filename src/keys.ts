export enum GameServerKeys {
    // Auth container
    Welcome = "WELCOME",
    UserSubscribe = "USER:SUBSCRIBE",
    AuthSessionIDGet = "AUTH:SESSION:ID:GET",
    AuthJWTCheck = "AUTH:JWT:CHECK",
    RingCheck = "RING:CHECK",
    ToggleGojiBerryTea = "GOJI:BERRY:TEA",

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
    TriggerLiveVoteCountUpdated = "LIVE:VOTE:COUNT:UPDATED",
    TriggerFactionAbilityPriceUpdated = "ABILITY:PRICE:UPDATED",
    TriggerBattleAbilityProgressUpdated = "BATTLE:ABILITY:PROGRESS:BAR:UPDATED",
    TriggerBattleQueueUpdated = "BATTLE:QUEUE:UPDATED",

    // Global messages
    SubGlobalAnnouncement = "GLOBAL_ANNOUNCEMENT:SUBSCRIBE",
    SubStreamClose = "STREAM:CLOSE:SUBSCRIBE",

    // Streams
    SubStreamList = "STREAMLIST:SUBSCRIBE",

    // Queue
    JoinQueue = "BATTLE:QUEUE:JOIN",
    LeaveQueue = "BATTLE:QUEUE:LEAVE",
    SubQueueStatus = "BATTLE:QUEUE:STATUS:SUBSCRIBE",
    AssetQueueStatus = "ASSET:QUEUE:STATUS",
    AssetQueueStatusList = "ASSET:QUEUE:STATUS:LIST",
    SubAssetQueueStatus = "ASSET:QUEUE:STATUS:SUBSCRIBE",

    // Chat
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",
    SendChatMessage = "CHAT:MESSAGE",
    ChatPastMessages = "CHAT:PAST_MESSAGES",
    SubscribeChatUserStats = "PLAYER:USER:STAT:CHAT:SUBSCRIBE",

    // Get / sub to data
    SubWarMachineDestroyed = "WAR:MACHINE:DESTROYED:UPDATED",
    SubAISpawned = "AI:SPAWNED",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",
    SubscribeSupsMultiplier = "USER:SUPS:MULTIPLIER:SUBSCRIBE",
    SubViewersLiveCount = "VIEWER:LIVE:COUNT:UPDATED",
    SubscribeUserStat = "USER:STAT:SUBSCRIBE",

    SubMultiplierMap = "MULTIPLIER:MAP:SUBSCRIBE",

    SubPlayerPrefs = "PLAYER:PREFERENCES_SUBSCRIBE",
    TogglePlayerBattleQueueNotifications = "PLAYER:TOGGLE_BATTLE_QUEUE_NOTIFICATIONS",
    SubPlayerBattleQueueBrowser = "PLAYER:BROWSER_NOFTICATION_SUBSCRIBE",

    // Ban system
    GetBanOptions = "PUNISH:OPTIONS",
    GetPlayerList = "FACTION:PLAYER:SEARCH",
    GetBanPlayerCost = "PUNISH:VOTE:PRICE:QUOTE",
    SubmitBanProposal = "ISSUE:PUNISH:VOTE",
    SubBanProposals = "PUNISH:VOTE:SUBSCRIBE",
    SubmitBanVote = "PUNISH:VOTE",
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

    // Assets
    SubAssetList = "USER:ASSET:LIST",
    SubAssetData = "ASSET:SUBSCRIBE",

    // Transactions
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",
    SubscribeUserLatestTransactions = "USER:SUPS:LATEST_TRANSACTION:SUBSCRIBE",

    // Misc
    GetFreeSups = "GAMEBAR:GET:SUPS",
}
