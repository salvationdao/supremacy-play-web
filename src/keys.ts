enum HubKey {
    // Auth container
    Welcome = 'WELCOME',
    UserSubscribe = 'USER:SUBSCRIBE',
    AuthSessionIDGet = 'AUTH:SESSION:ID:GET',

    // Game container
    GetFactionsColor = 'FACTION:COLOUR',
    GetFactionVotePrice = 'FACTION:VOTE:PRICE',
    SubGameSettings = 'GAME:SETTINGS:UPDATED',
    SubVoteStageUpdated = 'VOTE:STAGE:UPDATED',
    SubVoteWinnerAnnouncement = 'VOTE:WINNER:ANNOUNCEMENT',
    SubFactionWarMachineQueueUpdated = 'FACTION:WAR:MACHINE:QUEUE:UPDATED',

    // Notification container
    SubGameNotification = 'GAME:NOTIFICATION',

    // In components
    SubBattleAbility = 'VOTE:BATTLE:ABILITY:UPDATED',
    SubFactionAbilities = 'FACTION:ABILITIES:UPDATED',
    SubmitVoteAbilityRight = 'VOTE:ABILITY:RIGHT',
    SubmitAbilityLocationSelect = 'ABILITY:LOCATION:SELECT',
    FactionAbilityContribute = 'FACTION:ABILITY:CONTRIBUTE',
}

export default HubKey
