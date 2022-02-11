import { Box } from '@mui/material'
import { StyledImageText, StyledNormalText } from '..'
import { PASSPORT_WEB } from '../../constants'
import { BattleAbility, User } from '../../types'

/*
NOTE:
Some examples:
1. CANCELLED_NO_PLAYER
=> {ability} is cancelled, due to no player select location

2. CANCELLED_DISCONNECTED
=> {ability} is cancelled, due to the last player eligible to pick location is disconnected.

3. FAILED_TIMEOUT
=> {currentUsername} failed to select location in time, it is {nextUsername}'s turn to select the location for {ability}

4. FAILED_DISCONNECTED
=> {currentUsername} is disconnected, it is {nextUsername}'s turn to select the location for {ability}

5. TRIGGER
=> {currentUserName} is selecting a target location for {ability}
*/

interface LocationSelectAlertProps {
    type: 'CANCELLED_NO_PLAYER' | 'CANCELLED_DISCONNECTED' | 'FAILED_TIMEOUT' | 'FAILED_DISCONNECTED' | 'TRIGGER'
    currentUser?: User
    nextUser?: User
    ability: BattleAbility
    x?: number
    y?: number
}

const FallbackUser: User = {
    id: '',
    factionID: '',
    username: 'Unknown User',
    avatarID: '',
    faction: {
        id: '',
        label: 'xxx',
        logoBlobID: '',
        backgroundBlobID: '',
        theme: {
            primary: 'grey !important',
            secondary: '#FFFFFF',
            background: '#0D0404',
        },
    },
}

export const LocationSelectAlert = ({ data }: { data: LocationSelectAlertProps }) => {
    const { type, currentUser, nextUser, ability } = data
    const { label, colour, imageUrl } = ability
    const { username, avatarID, faction } = currentUser || FallbackUser
    const { username: nextUsername, avatarID: nextAvatarID, faction: nextFaction } = nextUser || FallbackUser

    if (type == 'CANCELLED_NO_PLAYER' || type == 'CANCELLED_DISCONNECTED') {
        return (
            <Box>
                <StyledImageText text={label} color={colour} />
                <StyledNormalText text=" has been cancelled as there are no players left to choose a target location." />
            </Box>
        )
    }

    if (type == 'FAILED_TIMEOUT') {
        return (
            <Box>
                <StyledImageText
                    imageUrl={avatarID ? `${PASSPORT_WEB}/api/files/${avatarID}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                />
                <StyledNormalText text=" failed to choose a target location in time. " />
                <StyledImageText
                    imageUrl={nextAvatarID ? `${PASSPORT_WEB}/api/files/${nextAvatarID}` : undefined}
                    text={nextUsername}
                    color={nextFaction.theme.primary}
                />
                <StyledNormalText text=" has been assigned to choose a target for " />
                <StyledImageText text={label} color={colour} />
                <StyledNormalText text="." />
            </Box>
        )
    }

    if (type == 'FAILED_DISCONNECTED') {
        return (
            <Box>
                <StyledImageText
                    imageUrl={avatarID ? `${PASSPORT_WEB}/api/files/${avatarID}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                />
                <StyledNormalText text=" has disconnected. " />
                <StyledImageText
                    imageUrl={nextAvatarID ? `${PASSPORT_WEB}/api/files/${nextAvatarID}` : undefined}
                    text={nextUsername}
                    color={nextFaction.theme.primary}
                />
                <StyledNormalText text=" has been assigned to choose a target for " />
                <StyledImageText text={label} color={colour} />
                <StyledNormalText text="." />
            </Box>
        )
    }

    if (type == 'TRIGGER') {
        return (
            <Box>
                <StyledImageText
                    imageUrl={avatarID ? `${PASSPORT_WEB}/api/files/${avatarID}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                />
                <StyledNormalText text=" is choosing a target location for " />
                <StyledImageText text={label} color={colour} />
                <StyledNormalText text="." />
            </Box>
        )
    }

    return null
}
