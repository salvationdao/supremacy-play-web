enum HubKey {
    Welcome = 'WELCOME',
    UserSubscribe = 'USER:SUBSCRIBE',
    Auth = 'TWITCH:AUTH',
    AuthJWT = 'TWITCH:JWT:AUTH',

    SubmitFirstVote = 'TWITCH:FACTION:ABILITY:FIRST:VOTE',
    SubmitSecondVote = 'TWITCH:FACTION:ABILITY:SECOND:VOTE',
    SubmitTargetMapLocation = 'TWITCH:ACTION:LOCATION:SELECT',

    SubFactionStage = 'TWITCH:FACTION:VOTE:STAGE:UPDATED',
    SubSupTokens = 'USER:SUPS:UPDATED',
    SubFactionAbilities = 'TWITCH:FACTION:ABILITY:UPDATED',
    SubSecondVoteTick = 'TWITCH:FACTION:SECOND:VOTE:UPDATED',
    SubNotifications = 'TWITCH:NOTIFICATION',
    SubWinnerAnnouncement = 'TWITCH:VOTE:WINNER:ANNOUNCEMENT',
    SubGameSettings = 'GAME:SETTINGS:UPDATED',
    SubWarMachinesState = 'WARMACHINE:UPDATED',
}

export default HubKey
