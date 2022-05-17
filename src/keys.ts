export enum GameServerKeys {
    // Old netMessage
    SubSpoilsOfWar = "SPOIL:OF:WAR:UPDATED",
    SubLiveGraph = "LIVE:VOTE:COUNT:UPDATED",
    SubMechLiveStats = "WAR:MACHINE:STAT:UPDATED",
    SubBattleAbilityProgress = "BATTLE:ABILITY:PROGRESS:BAR:UPDATED",
    SubAbilityProgress = "ABILITY:PRICE:UPDATED",
    SubMechAbilityProgress = "MECH:ABILITY:PRICE:UPDATED",

    // Auth container
    UserSubscribe = "USER:SUBSCRIBE",
    ToggleGojiBerryTea = "GOJI:BERRY:TEA",
    PlayerRank = "PLAYER:RANK:GET",
    ListPunishments = "PLAYER:PUNISHMENT:LIST",

    // Contributor multiplier
    ListenContributorMulti = "BATTLE:CONTRIBUTOR:UPDATE",
    ListenContributorRate = "CONTRIBUTOR:MULTI:AMOUNT",

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

    TriggerBattleQueueUpdated = "BATTLE:QUEUE:UPDATED",

    // Global messages
    SubGlobalAnnouncement = "GLOBAL_ANNOUNCEMENT:SUBSCRIBE",

    // Asset / queue
    SubQueueFeed = "BATTLE:QUEUE:STATUS:SUBSCRIBE",
    GetAssetsQueue = "ASSET:MANY",
    JoinQueue = "BATTLE:QUEUE:JOIN",
    LeaveQueue = "BATTLE:QUEUE:LEAVE",

    // Player Abilities
    TriggerSaleAbilitiesListUpdated = "SALE:ABILITIES:LIST:UPDATED",
    SaleAbilityDetailed = "SALE:ABILITY:DETAILED",
    PlayerAbilitySubscribe = "PLAYER:ABILITY:SUBSCRIBE",
    SaleAbilityPriceSubscribe = "SALE:ABILITY:PRICE:SUBSCRIBE",
    PlayerAbilitiesList = "PLAYER:ABILITIES:LIST",
    SaleAbilitiesList = "SALE:ABILITIES:LIST",
    SaleAbilityPurchase = "SALE:ABILITY:PURCHASE",

    // Chat
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",
    SendChatMessage = "CHAT:MESSAGE",

    BattleMechHistoryList = "BATTLE:MECH:HISTORY:LIST",
    BattleMechStats = "BATTLE:MECH:STATS",

    // Get / sub to data
    SubWarMachineDestroyed = "WAR:MACHINE:DESTROYED:UPDATED",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",
    SubscribeSupsMultiplier = "USER:MULTIPLIERS:SUBSCRIBE",
    SubViewersLiveCount = "VIEWER:LIVE:COUNT:UPDATED",
    SubscribeUserStat = "USER:STAT:SUBSCRIBE",

    UpdateSettings = "PLAYER:UPDATE_SETTINGS",
    GetSettings = "PLAYER:GET_SETTINGS",

    // Ban system
    GetBanOptions = "PUNISH:OPTIONS",
    GetPlayerList = "FACTION:PLAYER:SEARCH",
    GetBanPlayerCost = "PUNISH:VOTE:PRICE:QUOTE",
    SubmitBanProposal = "ISSUE:PUNISH:VOTE",
    SubBanProposals = "PUNISH:VOTE:SUBSCRIBE",
    SubmitBanVote = "PUNISH:VOTE",

    // Player list
    SubPlayerList = "FACTION:ACTIVE:PLAYER:SUBSCRIBE",

    // Telegram
    UserTelegramShortcodeRegistered = "USER:TELEGRAM_SHORTCODE_REGISTERED",

    EnlistFaction = "FACTION:ENLIST",
}

export enum PassportServerKeys {
    // Bar
    SubscribeWallet = "USER:SUPS:SUBSCRIBE",
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",

    // Assets
    SubAssetData = "ASSET:SUBSCRIBE",
    UpdateAssetName = "ASSET:UPDATE:NAME",

    // Misc
    GetFreeSups = "GAMEBAR:GET:SUPS",

    //User
    UserUpdate = "USER:UPDATE",
}
