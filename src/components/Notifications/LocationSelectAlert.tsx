import { Box } from "@mui/material"
import { StyledImageText, StyledNormalText } from ".."
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { httpProtocol } from "../../containers"
import { BattleAbility, User } from "../../types"

/*
NOTE:
Some examples:
1. CANCELLED_NO_PLAYER
=> {ability} is cancelled, due to no player select location

2. CANCELLED_DISCONNECT
=> {ability} is cancelled, due to the last player eligible to pick location is disconnected.

3. FAILED_TIMEOUT
=> {currentUsername} failed to select location in time, it is {nextUsername}'s turn to select the location for {ability}

4. FAILED_DISCONNECTED
=> {currentUsername} is disconnected, it is {nextUsername}'s turn to select the location for {ability}

5. TRIGGER
=> {currentUserName} has chosen a target location for {ability}
*/

interface LocationSelectAlertProps {
    type: "CANCELLED_NO_PLAYER" | "CANCELLED_DISCONNECT" | "FAILED_TIMEOUT" | "FAILED_DISCONNECTED" | "TRIGGER"
    currentUser?: User
    nextUser?: User
    ability: BattleAbility
    x?: number
    y?: number
}

export const FallbackUser: User = {
    id: "",
    factionID: "",
    username: "Unknown User",
    avatarID: "",
    sups: 0,
    faction: {
        id: "",
        label: "xxx",
        logoBlobID: "",
        backgroundBlobID: "",
        theme: {
            primary: "grey !important",
            secondary: "#FFFFFF",
            background: "#0D0404",
        },
    },
}

export const LocationSelectAlert = ({ data }: { data: LocationSelectAlertProps }) => {
    const { type, currentUser, nextUser, ability } = data
    const { label, colour, imageUrl } = ability
    const { username, avatarID, faction } = currentUser || FallbackUser
    const { username: nextUsername, avatarID: nextAvatarID, faction: nextFaction } = nextUser || FallbackUser

    const abilityImageUrl = `${httpProtocol()}://${GAME_SERVER_HOSTNAME}${imageUrl}`

    if (type == "CANCELLED_NO_PLAYER" || type == "CANCELLED_DISCONNECT") {
        return (
            <Box>
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} />
                <StyledNormalText text=" has been cancelled as there were no players available to choose a target location." />
            </Box>
        )
    }

    if (type == "FAILED_TIMEOUT") {
        return (
            <Box>
                <StyledImageText
                    imageUrl={avatarID ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files${avatarID}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                />
                <StyledNormalText text=" failed to choose a target location in time. " />
                <StyledImageText
                    imageUrl={nextAvatarID ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files${nextAvatarID}` : undefined}
                    text={nextUsername}
                    color={nextFaction.theme.primary}
                />
                <StyledNormalText text=" has been assigned to choose a target for " />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} />
                <StyledNormalText text="." />
            </Box>
        )
    }

    if (type == "FAILED_DISCONNECTED") {
        return (
            <Box>
                <StyledImageText
                    imageUrl={avatarID ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files${avatarID}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                />
                <StyledNormalText text=" has disconnected. " />
                <StyledImageText
                    imageUrl={nextAvatarID ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files${nextAvatarID}` : undefined}
                    text={nextUsername}
                    color={nextFaction.theme.primary}
                />
                <StyledNormalText text=" has been assigned to choose a target for " />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} />
                <StyledNormalText text="." />
            </Box>
        )
    }

    if (type == "TRIGGER") {
        return (
            <Box>
                <StyledImageText
                    imageUrl={avatarID ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files${avatarID}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                />
                <StyledNormalText text=" has chosen a target location for " />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} />
                <StyledNormalText text="." />
            </Box>
        )
    }

    return null
}
