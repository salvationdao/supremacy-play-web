export enum GameServerKeys {
    // Old netMessage
    SubSpoilsOfWar = "SPOIL:OF:WAR:UPDATED",
    SubLiveGraph = "LIVE:VOTE:COUNT:UPDATED",
    SubMechLiveStats = "WAR:MACHINE:STAT:UPDATED",
    SubAbilityProgress = "ABILITY:PRICE:UPDATED",
    SubMechAbilityCoolDown = "WAR:MACHINE:ABILITY:SUBSCRIBE",
    SubBattleAbilityOptInCheck = "BATTLE:ABILITY:OPT:IN:CHECK",
    OptInBattleAbility = "BATTLE:ABILITY:OPT:IN",

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
    TriggerWarMachineAbility = "WAR:MACHINE:ABILITY:TRIGGER",
    SubmitAbilityLocationSelect = "ABILITY:LOCATION:SELECT",

    SubMechCommands = "MECH:COMMANDS:SUBSCRIBE",
    SubMechMoveCommand = "MECH:MOVE:COMMAND:SUBSCRIBE",
    MechMoveCommandCreate = "MECH:MOVE:COMMAND:CREATE",
    MechMoveCommandCancel = "MECH:MOVE:COMMAND:CANCEL",

    // Game Use
    GameUserOnline = "GAME:ONLINE",

    // Global messages
    SubGlobalAnnouncement = "GLOBAL_ANNOUNCEMENT:SUBSCRIBE",

    // System messages
    SystemMessageList = "SYSTEM:MESSAGE:LIST",
    SystemMessageDismiss = "SYSTEM:MESSAGE:DISMISS",
    SubSystemMessageListUpdated = "SYSTEM:MESSAGE:LIST:UPDATED",

    // Asset / queue
    SubQueueFeed = "BATTLE:QUEUE:STATUS:SUBSCRIBE",
    GetMechs = "PLAYER:ASSET:MECH:LIST",
    // Weapons
    GetWeapons = "PLAYER:ASSET:WEAPON:LIST",
    GetWeaponDetails = "PLAYER:ASSET:WEAPON:DETAIL",
    GetMechDetails = "PLAYER:ASSET:MECH:DETAIL",
    SubMechQueuePosition = "PLAYER:ASSET:MECH:QUEUE:SUBSCRIBE",
    JoinQueue = "BATTLE:QUEUE:JOIN",
    LeaveQueue = "BATTLE:QUEUE:LEAVE",
    MechQueueUpdated = "PLAYER:ASSET:MECH:QUEUE:UPDATE",
    TriggerMechStatusUpdate = "PLAYER:ASSET:MECH:STATUS:UPDATE",
    MechRename = "PLAYER:MECH:RENAME",

    // Player Abilities
    PlayerAbilitiesList = "PLAYER:ABILITIES:LIST:SUBSCRIBE",
    SaleAbilitiesList = "SALE:ABILITIES:LIST:SUBSCRIBE",
    SaleAbilityClaim = "SALE:ABILITY:CLAIM",
    PlayerAbilityUse = "PLAYER:ABILITY:USE",

    // Minimap ability updates
    MinimapUpdatesSubscribe = "MINIMAP:UPDATES:SUBSCRIBE",

    // Chat
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",
    SendChatMessage = "CHAT:MESSAGE",

    BattleMechHistoryDetailed = "BATTLE:MECH:HISTORY:DETAILED",
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
    SubBanProposalCommandOverrideCount = "PUNISH:VOTE:COMMAND:OVERRIDE:COUNT:SUBSCRIBE",
    SubmitBanVote = "PUNISH:VOTE",
    SubmitInstantBan = "PUNISH:VOTE:INSTANT:PASS",

    // Player list
    SubPlayerList = "FACTION:ACTIVE:PLAYER:SUBSCRIBE",
    SubGlobalPlayerList = "GLOBAL:ACTIVE:PLAYER:SUBSCRIBE",
    GetPlayerByGid = "GET:PLAYER:GID",
    ReadTaggedMessage = "READ:TAGGED:MESSAGE",

    // Telegram
    UserTelegramShortcodeRegistered = "USER:TELEGRAM_SHORTCODE_REGISTERED",

    // Player Profile
    GetNotificationPreferences = "PLAYER:PREFERENCES_GET",
    UpdateNotificationPreferences = "PLAYER:PREFERENCES_UPDATE",

    EnlistFaction = "FACTION:ENLIST",

    //Redeem Coupon Code
    CodeRedemption = "CODE:REDEMPTION",

    // Storefront
    GetMysteryCrates = "STORE:MYSTERY:CRATES",
    SubMysteryCrate = "STORE:MYSTERY:CRATE:SUBSCRIBE",
    PurchaseMysteryCrate = "STORE:MYSTERY:CRATE:PURCHASE",

    // Marketplace
    MarketplaceSalesList = "MARKETPLACE:SALES:LIST",
    MarketplaceSalesGet = "MARKETPLACE:SALES:GET",
    MarketplaceSalesCreate = "MARKETPLACE:SALES:CREATE",
    MarketplaceSalesBuy = "MARKETPLACE:SALES:BUY",
    MarketplaceSalesBid = "MARKETPLACE:SALES:BID",
    SubMarketplaceSalesItem = "MARKETPLACE:SALES:ITEM:UPDATE",
    CancelMarketplaceListing = "MARKETPLACE:SALES:ARCHIVE",
    GetMarketplaceEvents = "MARKETPLACE:EVENT:LIST",

    // Marketplace Keycards
    MarketplaceSalesKeycardList = "MARKETPLACE:SALES:KEYCARD:LIST",
    GetKeycard = "MARKETPLACE:SALES:KEYCARD:GET",
    MarketplaceSalesKeycardCreate = "MARKETPLACE:SALES:KEYCARD:CREATE",
    MarketplaceSalesKeycardBuy = "MARKETPLACE:SALES:KEYCARD:BUY",
    CancelKeycardListing = "MARKETPLACE:SALES:KEYCARD:ARCHIVE",

    // Mystery Crates
    GetPlayerMysteryCrates = "PLAYER:ASSET:MYSTERY_CRATE:LIST",
    GetPlayerMysteryCrate = "PLAYER:ASSET:MYSTERY_CRATE:GET",
    OpenCrate = "CRATE:OPEN",

    // Keycards
    GetPlayerKeycards = "PLAYER:ASSET:KEYCARD:LIST",
    GetPlayerKeycard = "PLAYER:ASSET:KEYCARD:GET",

    // Player profile
    PlayerProfileGet = "PLAYER:PROFILE:GET",
    PlayerProfileAvatarUpdate = "PLAYER:AVATAR:UPDATE",
    PlayerProfileAvatarList = "PLAYER:AVATAR:LIST",
    PlayerProfileUsernameUpdate = "PLAYER:UPDATE:USERNAME",
    PlayerProfileAboutMeUpdate = "PLAYER:UPDATE:ABOUT_ME",
    PlayerAssetMechListPublic = "PLAYER:ASSET:MECH:LIST:PUBLIC",
    PlayerAssetMechDetailPublic = "PLAYER:ASSET:MECH:DETAIL:PUBLIC",
    PlayerBattleMechHistoryList = "PLAYER:BATTLE:MECH:HISTORY:LIST",

    // Leaderboard
    GetPlayerBattlesSpectated = "LEADERBOARD:PLAYER:BATTLE:SPECTATED",
    GetPlayerMechSurvives = "LEADERBOARD:PLAYER:MECH:SURVIVES",
    GetPlayerMechKills = "LEADERBOARD:PLAYER:MECH:KILLS",
    GetPlayerAbilityKills = "LEADERBOARD:PLAYER:ABILITY:KILLS",
    GetPlayerAbilityTriggers = "LEADERBOARD:PLAYER:ABILITY:TRIGGERS",
    GetPlayerMechsOwned = "LEADERBOARD:PLAYER:MECHS:OWNED",

    // Repairs
    GetRepairJobList = "MECH:REPAIR:OFFER:LIST",
    SubRepairJobStatus = "MECH:REPAIR:OFFER",
    SubMechRepairStatus = "MECH:REPAIR:CASE",
    GetMechRepairJob = "MECH:ACTIVE:REPAIR:OFFER",
    RegisterMechRepair = "MECH:REPAIR:OFFER:ISSUE",
    CancelMechRepair = "MECH:REPAIR:OFFER:CLOSE",
    RegisterRepairAgent = "REPAIR:AGENT:REGISTER",
    CompleteRepairAgent = "REPAIR:AGENT:COMPLETE",
}

export enum PassportServerKeys {
    // Bar
    SubscribeWallet = "USER:SUPS:SUBSCRIBE",
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",

    // Misc
    GetFreeSups = "GAMEBAR:GET:SUPS",
}
