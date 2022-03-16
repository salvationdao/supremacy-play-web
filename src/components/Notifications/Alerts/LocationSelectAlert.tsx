import { Box, Stack, Typography } from "@mui/material"
import { NotificationResponse, StyledImageText, StyledNormalText } from "../.."
import { SvgCancelled, SvgDisconnected, SvgHourglass, SvgLocation, SvgDeath } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll, httpProtocol } from "../../../containers"
import { colors } from "../../../theme/theme"
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
    type:
        | "CANCELLED_NO_PLAYER"
        | "CANCELLED_DISCONNECT"
        | "FAILED_TIMEOUT"
        | "FAILED_DISCONNECTED"
        | "TRIGGER"
        | "ASSIGNED"
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

export const LocationSelectAlert = ({
    data,
    factionsAll,
}: {
    data: LocationSelectAlertProps
    factionsAll: FactionsAll
}) => {
    const { type, currentUser, ability } = data
    const { label, colour, image_url } = ability
    const { username, faction } = currentUser || FallbackUser

    const abilityImageUrl = `${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`

    if (type == "CANCELLED_NO_PLAYER" || type == "CANCELLED_DISCONNECT") {
        return (
            <Stack spacing=".8rem">
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
                <Box>
                    <SvgCancelled fill="grey" size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                    <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                    <StyledNormalText text="It has been cancelled as there were no players available to choose a target location." />
                </Box>
            </Stack>
        )
    }

    if (type == "FAILED_TIMEOUT") {
        return (
            <Stack spacing=".8rem">
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
                <Box>
                    <SvgHourglass fill="grey" size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                    <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.3}
                    />
                    <StyledNormalText text=" failed to choose a target location." />
                </Box>
            </Stack>
        )
    }

    if (type == "FAILED_DISCONNECTED") {
        return (
            <Stack spacing=".8rem">
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
                <Box>
                    <SvgDisconnected fill="grey" size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                    <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.3}
                    />
                    <StyledNormalText text=" has disconnected." />
                </Box>
            </Stack>
        )
    }

    if (type == "TRIGGER") {
        return (
            <Stack spacing=".8rem">
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
                <Box>
                    <SvgDeath fill={colors.red} size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                    <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.3}
                    />
                    <StyledNormalText text=" has chosen a target location." />
                </Box>
            </Stack>
        )
    }

    if (type == "ASSIGNED") {
        return (
            <Stack spacing=".8rem">
                <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.3} />
                <Box>
                    <SvgLocation fill={colors.yellow} size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                    <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.3}
                    />
                    <StyledNormalText text=" is choosing a target location." />
                </Box>
            </Stack>
        )
    }

    return null
}
