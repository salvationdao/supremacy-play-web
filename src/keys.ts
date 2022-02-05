enum HubKey {
    Welcome = 'WELCOME',
    UserSubscribe = 'USER:SUBSCRIBE',
    AuthSessionIDGet = 'AUTH:SESSION:ID:GET',

    SubGameSettings = 'GAME:SETTINGS:UPDATED',
    SubWarMachinesState = 'WARMACHINE:UPDATED',

    // SHOULD BE REMOVED
    SubmitFirstVote = 'TWITCH:FACTION:ABILITY:FIRST:VOTE',
    SubmitSecondVote = 'TWITCH:FACTION:ABILITY:SECOND:VOTE',
    SubFactionAbilities = 'TWITCH:FACTION:ABILITY:UPDATED',
    SubSecondVoteTick = 'TWITCH:FACTION:SECOND:VOTE:UPDATED',

    // NEW STUFF
    VoteAbilityRight = 'VOTE:ABILITY:RIGHT',
    AbilityLocationSelect = 'ABILITY:LOCATION:SELECT',
    SubGameNotification = 'GAME:NOTIFICATION',
    SubVoteWinnerAnnouncement = 'VOTE:WINNER:ANNOUNCEMENT',
    SubVoteAbilityCollectionUpdated = 'VOTE:ABILITY:COLLECTION:UPDATED',
    SubVoteStageUpdated = 'VOTE:STAGE:UPDATED',
    SubFactionWarMachineQueueUpdated = 'FACTION:WAR:MACHINE:QUEUE:UPDATED',
}

export default HubKey
