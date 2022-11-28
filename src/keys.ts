export enum GameServerKeys {
    // Old netMessage
    SubMechLiveStats = "WAR:MACHINE:STAT:UPDATED",
    SubMechAbilityCoolDown = "WAR:MACHINE:ABILITY:SUBSCRIBE",
    SubBattleAbilityOptInCheck = "BATTLE:ABILITY:OPT:IN:CHECK",
    OptInBattleAbility = "BATTLE:ABILITY:OPT:IN",

    // Auth container
    UserSubscribe = "USER:SUBSCRIBE",
    ToggleGojiBerryTea = "GOJI:BERRY:TEA",
    PlayerRank = "PLAYER:RANK:GET",
    ListPunishments = "PLAYER:PUNISHMENT:LIST",
    SubPlayerFactionPassExpiryDate = "PLAYER:FACTION:PASS:EXPIRY:DATE",

    // Notification container
    SubGameNotification = "GAME:NOTIFICATION",

    // Battle Arena
    SubGameMapList = "GAME:MAP:LIST",
    SubPlayerQueueableMechs = "PLAYER:OWNED:MECHS",
    SubArenaStatus = "ARENA:STATUS:UPDATED",
    SunBattleETA = "BATTLE:ETA:UPDATE",
    SubBattleArenaList = "BATTLE:ARENA:LIST",
    SubBattleArenaClosed = "BATTLE:ARENA:CLOSED",
    SubMiniMapAbilityDisplayList = "MINI:MAP:ABILITY:DISPLAY:LIST",
    NextBattleDetails = "NEXT:BATTLE:DETAILS",
    BattleState = "BATTLE:STATE",
    SubFactionStakedMechs = "FACTION:STAKED:MECHS",

    // Voting abilities
    SubBribeStageUpdated = "BRIBE:STAGE:UPDATED:SUBSCRIBE",
    SubBribeWinnerAnnouncement = "BRIBE:WINNER:SUBSCRIBE",
    SubBattleAbility = "BATTLE:ABILITY:UPDATED",
    SubWarMachineAbilitiesUpdated = "WAR:MACHINE:ABILITIES:UPDATED",
    TriggerWarMachineAbility = "WAR:MACHINE:ABILITY:TRIGGER",
    SubmitAbilityLocationSelect = "ABILITY:LOCATION:SELECT",

    SubMiniMapAbilityContentSubscribe = "MINI:MAP:ABILITY:CONTENT",
    SubMechCommandUpdateSubscribe = "MECH:COMMAND:UPDATE",
    SubFactionMechCommandUpdateSubscribe = "FACTION:MECH:COMMANDS:UPDATE",
    SubMiniMapUpdateSubscribe = "MINI:MAP:UPDATE",

    // Game Use
    GameUserOnline = "GAME:ONLINE",

    // Global messages
    SubGlobalAnnouncement = "GLOBAL_ANNOUNCEMENT:SUBSCRIBE",

    // System messages
    SystemMessageList = "SYSTEM:MESSAGE:LIST",
    SystemMessageDismiss = "SYSTEM:MESSAGE:DISMISS",
    SubSystemMessageListUpdated = "SYSTEM:MESSAGE:LIST:UPDATED",
    SystemMessageSend = "SYSTEM:MESSAGE:SEND",

    // Asset / queue
    JoinQueue = "BATTLE:QUEUE:JOIN",
    LeaveQueue = "BATTLE:QUEUE:LEAVE",
    SubQueueFeed = "BATTLE:QUEUE:STATUS:SUBSCRIBE",
    SubMechQueuePosition = "PLAYER:ASSET:MECH:QUEUE:SUBSCRIBE",
    MechQueueUpdated = "PLAYER:ASSET:MECH:QUEUE:UPDATE",
    SubBattleLobbyListUpdate = "BATTLE:LOBBY:LIST:UPDATE",
    SubInvolvedBattleLobbiesUpdate = "INVOLVED:BATTLE:LOBBY:LIST:UPDATE",
    CreateBattleLobby = "BATTLE:LOBBY:CREATE",
    SubPrivateBattleLobby = "PRIVATE:BATTLE:LOBBY:UPDATE",
    JoinBattleLobby = "BATTLE:LOBBY:JOIN",
    LeaveBattleLobby = "BATTLE:LOBBY:LEAVE",
    JoinBattleLobbySupporter = "BATTLE:LOBBY:SUPPORTER:JOIN",
    TopUpBattleLobbyReward = "BATTLE:LOBBY:TOP:UP:REWARD",
    GetPrivateBattleLobby = "PRIVATE:BATTLE:LOBBY:GET",
    StakeMechs = "MECHS:STAKE",
    UnstakeMechs = "MECHS:UNSTAKE",

    GetMechs = "PLAYER:ASSET:MECH:LIST",
    PlayerQueueStatus = "PLAYER:QUEUE:STATUS",
    EquipMech = "PLAYER:ASSET:MECH:EQUIP",
    GetMechDetails = "PLAYER:ASSET:MECH:DETAIL",
    GetWeapons = "PLAYER:ASSET:WEAPON:LIST",
    GetPlayerOwnedWeapons = "PLAYER:OWNED:WEAPONS",
    GetPlayerOwnedMechSkins = "PLAYER:OWNED:MECH:SKINS",
    GetPlayerOwnedWeaponSkins = "PLAYER:OWNED:WEAPON:SKINS",
    GetPlayerOwnedMysteryCrates = "PLAYER:OWNED:MYSTERY:CRATES",
    GetPlayerOwnedKeycards = "PLAYER:OWNED:KEYCARDS",
    GetWeaponsDetailed = "PLAYER:ASSET:WEAPON:DETAIL:LIST",
    GetWeaponDetails = "PLAYER:ASSET:WEAPON:DETAIL",
    GetPowerCores = "PLAYER:ASSET:POWER_CORE:LIST",
    GetPowerCoresDetailed = "PLAYER:ASSET:POWER_CORE:DETAIL:LIST",
    GetPowerCoreDetails = "PLAYER:ASSET:POWER_CORE:DETAIL",
    GetUtilities = "PLAYER:ASSET:UTILITY:LIST",
    GetUtilityDetails = "PLAYER:ASSET:UTILITY:DETAIL",
    TriggerMechStatusUpdate = "PLAYER:ASSET:MECH:STATUS:UPDATE",
    MechRename = "PLAYER:MECH:RENAME",
    SubMechIsStaked = "MECH:IS:STAKED",

    // Player Abilities
    SubPlayerAbilitiesList = "PLAYER:ABILITIES:LIST:SUBSCRIBE",
    SubSaleAbilitiesPrice = "SALE:ABILITIES:PRICE:SUBSCRIBE",
    SubSaleAbilitiesList = "SALE:ABILITIES:LIST:SUBSCRIBE",
    SaleAbilitiesList = "SALE:ABILITIES:LIST",
    SaleAbilityPurchase = "SALE:ABILITY:PURCHASE",
    PlayerAbilityUse = "PLAYER:ABILITY:USE",
    PlayerSupportAbilityUse = "PLAYER:SUPPORT:ABILITY:USE",

    // Minimap ability updates
    MinimapUpdatesSubscribe = "MINIMAP:UPDATES:SUBSCRIBE",
    MinimapEventsSubscribe = "MINIMAP:EVENTS:SUBSCRIBE",

    // Chat
    SubscribeFactionChat = "FACTION:CHAT:SUBSCRIBE",
    SubscribeGlobalChat = "GLOBAL:CHAT:SUBSCRIBE",
    SendChatMessage = "CHAT:MESSAGE",
    ReadTaggedMessage = "READ:TAGGED:MESSAGE",
    ReactToMessage = "REACT:MESSAGE",
    ChatBanPlayer = "CHAT:BAN:PLAYER",
    ChatReport = "CHAT:REPORT:MESSAGE",

    BattleMechHistoryList = "BATTLE:MECH:HISTORY:LIST",
    BattleMechStats = "BATTLE:MECH:STATS",

    // Get / sub to data
    SubBattleAISpawned = "BATTLE:AI:SPAWNED:SUBSCRIBE",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",
    SubViewersLiveCount = "VIEWER:LIVE:COUNT:UPDATED",
    SubscribeUserStat = "USER:STAT:SUBSCRIBE",
    UpdateSettings = "PLAYER:UPDATE_SETTINGS",
    GetSettings = "PLAYER:GET_SETTINGS",
    PlayerSupportAbilities = "PLAYER:SUPPORT:ABILITIES",

    // Ban system
    GetBanOptions = "PUNISH:OPTIONS",
    GetPlayerListFaction = "FACTION:PLAYER:SEARCH",
    GetPlayerList = "PLAYER:SEARCH",
    GetPlayerFriends = "PLAYER:FRIEND:SEARCH",
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

    // Telegram
    UserTelegramShortcodeRegistered = "USER:TELEGRAM_SHORTCODE_REGISTERED",

    // Player Profile
    GetNotificationPreferences = "PLAYER:PREFERENCES_GET",
    UpdateNotificationPreferences = "PLAYER:PREFERENCES_UPDATE",
    UpdateMarketingPreferences = "PLAYER:MARKETING:UPDATE",
    EnlistFaction = "FACTION:ENLIST",

    //Redeem Coupon Code
    CodeRedemption = "CODE:REDEMPTION",

    // Storefront
    GetMysteryCrates = "STORE:MYSTERY:CRATES",
    SubMysteryCrate = "STORE:MYSTERY:CRATE:SUBSCRIBE",
    PurchaseMysteryCrate = "STORE:MYSTERY:CRATE:PURCHASE",

    // Fiat
    FiatProductList = "FIAT:PRODUCT:LIST",
    FiatProductGet = "FIAT:PRODUCT:GET",
    FiatBillingHistoryList = "FIAT:BILLING_HISTORY:LIST",
    FiatBillingHistoryGet = "FIAT:BILLING_HISTORY:GET",
    FiatShoppingCartItemAdd = "FIAT:SHOPPING_CART:ITEM:ADD",
    FiatShoppingCartItemUpdate = "FIAT:SHOPPING_CART:ITEM:UPDATE",
    FiatShoppingCartItemRemove = "FIAT:SHOPPING_CART:ITEM:REMOVE",
    FiatShoppingCartItemClear = "FIAT:SHOPPING_CART:ITEM:CLEAR",
    FiatShoppingCartExpired = "FIAT:SHOPPING_CART:EXPIRED",
    FiatShoppingCartUpdated = "FIAT:SHOPPING_CART:UPDATED",
    FiatCheckoutSetup = "FIAT:CHECKOUT:SETUP",

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

    // Submodels
    GetMechSubmodelsDetailed = "PLAYER:ASSET:MECH:SUBMODEL:DETAIL:LIST",
    GetWeaponSubmodelsDetailed = "PLAYER:ASSET:WEAPON:SUBMODEL:DETAIL:LIST",
    GetMechBlueprintsDetailed = "PLAYER:MECH:BLUEPRINT:DETAIL:LIST",
    GetWeaponBlueprintsDetailed = "PLAYER:WEAPON:BLUEPRINT:DETAIL:LIST",

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
    PlayerProfileLayerList = "PLAYER:PROFILE:LAYERS:LIST",

    PlayerProfileCustomAvatarList = "PLAYER:CUSTOM_AVATAR:LIST",
    PlayerProfileCustomAvatarDetails = "PLAYER:CUSTOM_AVATAR:DETAILS",
    PlayerProfileCustomAvatarUpdate = "PLAYER:PROFILE:CUSTOM_AVATAR:UPDATE",
    PlayerProfileCustomAvatarCreate = "PLAYER:PROFILE:CUSTOM_AVATAR:CREATE",
    PlayerProfileCustomAvatarDelete = "PLAYER:PROFILE:CUSTOM_AVATAR:DELETE",

    // Leaderboard
    GetLeaderboardRounds = "LEADERBOARD:ROUNDS",
    GetPlayerBattlesSpectated = "LEADERBOARD:PLAYER:BATTLE:SPECTATED",
    GetPlayerMechSurvives = "LEADERBOARD:PLAYER:MECH:SURVIVES",
    GetPlayerMechKills = "LEADERBOARD:PLAYER:MECH:KILLS",
    GetPlayerAbilityKills = "LEADERBOARD:PLAYER:ABILITY:KILLS",
    GetPlayerAbilityTriggers = "LEADERBOARD:PLAYER:ABILITY:TRIGGERS",
    GetPlayerMechsOwned = "LEADERBOARD:PLAYER:MECHS:OWNED",
    GetPlayerRepairBlocks = "LEADERBOARD:PLAYER:REPAIR:BLOCK",

    // Repairs
    SubRepairJobListUpdated = "MECH:REPAIR:OFFER:LIST:UPDATE",
    SubRepairJobStatus = "MECH:REPAIR:OFFER",
    SubMechRepairStatus = "MECH:REPAIR:CASE",
    GetMechRepairJob = "MECH:ACTIVE:REPAIR:OFFER",
    RegisterMechRepair = "MECH:REPAIR:OFFER:ISSUE",
    CancelMechRepair = "MECH:REPAIR:OFFER:CLOSE",
    RegisterRepairAgent = "REPAIR:AGENT:REGISTER",
    RepairAgentUpdate = "REPAIR:AGENT:RECORD",
    SubRepairTowerNewBlocks = "NEXT:REPAIR:GAME:BLOCK",
    AbandonRepairAgent = "REPAIR:AGENT:ABANDON",

    // Repair bay
    GetRepairBaySlots = "MECH:REPAIR:SLOTS",
    InsertRepairBay = "MECH:REPAIR:SLOT:INSERT",
    RemoveRepairBay = "MECH:REPAIR:SLOT:REMOVE",
    SwapRepairBay = "MECH:REPAIR:SLOT:SWAP",

    // Companion App
    AuthGenOneTimeToken = "GEN:ONE:TIME:TOKEN",
    GetPlayerDeviceList = "PLAYER:DEVICE:LIST",

    // Quests
    SubPlayerQuestStats = "PLAYER:QUEST:STAT",
    SubPlayerQuestStatsProgression = "PLAYER:QUEST:PROGRESSIONS",

    SubChallengeFunds = "CHALLENGE:FUND",

    // Replays
    GetReplays = "GET:BATTLE:REPLAYS",
    GetReplayDetails = "GET:REPLAY:DETAILS",

    // Admins
    ModGetUser = "MOD:GET:USER",
    ModBanUser = "MOD:BAN:USER",
    ModUnbanUser = "MOD:UNBAN:USER",
    ModRestartServer = "MOD:RESTART:SERVER",
    ModLookupHistory = "MOD:LOOKUP:HISTORY",
    ModRenamePlayer = "MOD:RENAME:PLAYER",
    ModRenameMech = "MOD:RENAME:MECH",

    // Faction Commander
    JoinFactionCommander = "VOICE:JOIN:FACTION:COMMANDER",
    LeaveFactionCommander = "VOICE:LEAVE:FACTION:COMMANDER",

    // Voice chat
    SubPlayerVoiceStream = "PLAYER:VOICE:STREAM",
    SubPlayerVoiceStreamListeners = "PLAYER:VOICE:STREAM:LISTENERS",
    GetPlayerVoiceStreamListeners = "VOICE:STREAM:GET:LISTENERS",
    VoiceChatVoteKick = "VOICE:VOTE:KICK",
    VoiceChatConnect = "VOICE:STREAM:CONNECT",
    VoiceChatDisconnect = "VOICE:STREAM:DISCONNECT",

    // Faction Pass
    SubFactionPassList = "FACTION:PASS:LIST",
    PurchaseFactionPassWithSups = "FACTION:PASS:SUPS:PURCHASE",
    SubFactionMostPopularStakedMech = "FACTION:MOST:POPULAR:STAKED:MECH",
    SubFactionStakedMechCount = "FACTION:STAKED:MECH:COUNT",
    SubFactionStakedMechInQueueCount = "FACTION:STAKED:MECH:IN:QUEUE:COUNT",
    SubFactionStakedMechDamagedCount = "FACTION:STAKED:MECH:DAMAGED:COUNT",
    SubFactionStakedMechBattleReadyCount = "FACTION:STAKED:MECH:BATTLE:READY:COUNT",
    SubFactionStakedMechInBattleCount = "FACTION:STAKED:MECH:IN:BATTLE:COUNT",
    SubFactionStakedMechBattledCount = "FACTION:STAKED:MECH:BATTLED:COUNT",
    SubFactionStakedMechInRepairBay = "FACTION:STAKED:MECH:IN:REPAIR:BAY",
}

export enum PassportServerKeys {
    // Bar
    SubscribeWallet = "USER:SUPS:SUBSCRIBE",
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",

    // Misc
    GetFreeSups = "GAMEBAR:GET:SUPS",
}
