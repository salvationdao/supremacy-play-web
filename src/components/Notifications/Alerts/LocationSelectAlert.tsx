import { Box, Divider } from "@mui/material"
import { StyledImageText, StyledNormalText } from "../.."
import { SvgCancelled, SvgDisconnected, SvgHourglass, SvgLocation } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { httpProtocol } from "../../../containers"
import { BattleAbility, User } from "../../../types"

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
    faction_id: "",
    username: "Unknown user",
    avatar_id: "",
    sups: 0,
    faction: {
        id: "",
        label: "xxx",
        logo_blob_id: "",
        background_blob_id: "",
        theme: {
            primary: "grey !important",
            secondary: "#FFFFFF",
            background: "#0D0404",
        },
    },
}

export const LocationSelectAlert = ({ data }: { data: LocationSelectAlertProps }) => {
    const { type, currentUser, nextUser, ability } = data
    const { label, colour, image_url } = ability
    const { username, avatar_id, faction } = currentUser || FallbackUser
    const { username: nextUsername, avatar_id: nextavatar_id, faction: nextFaction } = nextUser || FallbackUser

    const abilityImageUrl = `${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`

    if (type == "CANCELLED_NO_PLAYER" || type == "CANCELLED_DISCONNECT") {
        return (
            <Box>
                <SvgCancelled size="12px" sx={{ display: "inline", mr: 0.5 }} />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
                <StyledNormalText text=" has been cancelled as there were no players available to choose a target location" />
            </Box>
        )
    }

    if (type == "FAILED_TIMEOUT") {
        return (
            <Box>
                <SvgHourglass size="12px" sx={{ display: "inline", mr: 0.5 }} />
                <StyledImageText
                    imageUrl={avatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                    imageMb={-0.3}
                />
                <StyledNormalText text=" failed to choose a target location in time. " />
                <Divider sx={{ my: 1.2, borderColor: "#FFFFFF", opacity: 0.15 }} />
                <SvgLocation size="12px" sx={{ display: "inline", mr: 0.5 }} />
                <StyledImageText
                    imageUrl={nextavatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${nextavatar_id}` : undefined}
                    text={nextUsername}
                    color={nextFaction.theme.primary}
                    imageMb={-0.3}
                />
                <StyledNormalText text=" has been assigned to choose a target for " />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
            </Box>
        )
    }

    if (type == "FAILED_DISCONNECTED") {
        return (
            <Box>
                <SvgDisconnected size="12px" sx={{ display: "inline", mr: 0.5 }} />
                <StyledImageText
                    imageUrl={avatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                    imageMb={-0.3}
                />
                <StyledNormalText text=" has disconnected" />
                <Divider sx={{ my: 1.2, borderColor: "#FFFFFF", opacity: 0.15 }} />
                <SvgLocation size="12px" sx={{ display: "inline", mr: 0.5 }} />
                <StyledImageText
                    imageUrl={nextavatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${nextavatar_id}` : undefined}
                    text={nextUsername}
                    color={nextFaction.theme.primary}
                    imageMb={-0.3}
                />
                <StyledNormalText text=" has been assigned to choose a target for " />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
            </Box>
        )
    }

    if (type == "TRIGGER") {
        return (
            <Box>
                <SvgLocation size="12px" sx={{ display: "inline", mr: 0.5 }} />
                <StyledImageText
                    imageUrl={avatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id}` : undefined}
                    text={username}
                    color={faction.theme.primary}
                    imageMb={-0.3}
                />
                <StyledNormalText text=" has chosen a target location for " />
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
            </Box>
        )
    }

    return null
}
