enum HubKey {
    // Auth container
    Welcome = "WELCOME",
    UserSubscribe = "USER:SUBSCRIBE",
    AuthSessionIDGet = "AUTH:SESSION:ID:GET",
    GetSessionID = "GAMEBAR:SESSION:ID:GET",
    AuthRingCheck = "GAMEBAR:AUTH:RING:CHECK",
    SubscribeGamebarUser = "GAMEBAR:USER:SUBSCRIBE",
    HubKeyFactionQueueJoin = "FACTION:QUEUE:JOIN",
    // Game container
    GetFactionsColor = "FACTION:COLOUR",
    GetFactionVotePrice = "FACTION:VOTE:PRICE",
    SubGameSettings = "GAME:SETTINGS:UPDATED",
    SubVoteStageUpdated = "VOTE:STAGE:UPDATED",
    SubVoteWinnerAnnouncement = "VOTE:WINNER:ANNOUNCEMENT",
    SubFactionWarMachineQueueUpdated = "FACTION:WAR:MACHINE:QUEUE:UPDATED",
    SubBattleEndDetailUpdated = "BATTLE:END:DETAIL:UPDATED",

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

    // Streams
    SubscribeStreamClose = "STREAM:CLOSE:SUBSCRIBE",
    GetStreamList = "STREAMLIST:SUBSCRIBE",
}

export default HubKey
