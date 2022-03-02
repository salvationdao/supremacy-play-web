enum HubKey {
    Welcome = "WELCOME",
    GetSessionID = "GAMEBAR:SESSION:ID:GET",
    GetFactionsAll = "FACTION:ALL",
    EnlistFaction = "FACTION:ENLIST",
    SendChatMessage = "CHAT:MESSAGE",
    AuthRingCheck = "GAMEBAR:AUTH:RING:CHECK",
    SubscribeGamebarUser = "GAMEBAR:USER:SUBSCRIBE",
    SubscribeUser = "USER:SUBSCRIBE",
    SubscribeWallet = "USER:SUPS:SUBSCRIBE",
    SubscribeFaction = "FACTION:SUBSCRIBE",
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
    SubFactionQueueCost = "ASSET:QUEUE:COST:UPDATE",
    SubFactionContractReward = "FACTION:CONTRACT:REWARD:SUBSCRIBE",
    JoinQueue = "ASSET:QUEUE:JOIN",

    // Transactions
    SubscribeUserTransactions = "USER:SUPS:TRANSACTIONS:SUBSCRIBE",
    SubscribeUserLatestTransactions = "USER:SUPS:LATEST_TRANSACTION:SUBSCRIBE",
}

export default HubKey
