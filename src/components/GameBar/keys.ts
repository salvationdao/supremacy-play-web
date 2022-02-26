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
	CollectionList = "COLLECTION:LIST",
	AssetList = "ASSET:LIST",
	AssetUpdated = "ASSET:SUBSCRIBE",
	AssetJoinQueue = "ASSET:QUEUE:JOIN",
	AssetInsurancePay = "ASSET:INSURANCE:PAY",
	AssetGetDurability = "ASSET:DURABILITY:SUBSCRIBE",
	UserWarMachineQueuePositionSubscribe = "USER:WAR:MACHINE:QUEUE:POSITION:SUBSCRIBE",
}

export default HubKey
