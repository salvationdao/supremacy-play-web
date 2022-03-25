import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { SvgCancelled, SvgDisconnected, SvgHourglass, SvgLocation, SvgDeath } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll, httpProtocol } from "../../../containers"
import { acronym } from "../../../helpers"
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

export interface LocationSelectAlertProps {
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
        label: "",
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

    const abilityImageUrl = useMemo(() => `${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`, [image_url])
    const mainColor = faction.theme.primary

    const Icon = () => {
        if (type == "CANCELLED_NO_PLAYER" || type == "CANCELLED_DISCONNECT") {
            return <SvgCancelled fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type == "FAILED_TIMEOUT") {
            return <SvgHourglass fill="#FFFFFF" size="1.15rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type == "FAILED_DISCONNECTED") {
            return <SvgDisconnected fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type == "TRIGGER") {
            return <SvgDeath fill="#FFFFFF" size="1.25rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type == "ASSIGNED") {
            return <SvgLocation fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        return <SvgDeath fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
    }

    const Content = () => {
        if (type == "CANCELLED_NO_PLAYER" || type == "CANCELLED_DISCONNECT") {
            return (
                <Box>
                    <StyledNormalText text="Cancelled as there were no players available to choose a target." />
                </Box>
            )
        }

        if (type == "FAILED_TIMEOUT" || type == "FAILED_DISCONNECTED") {
            return (
                <Box>
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.2}
                    />
                    <StyledNormalText text=" failed to choose a target." />
                </Box>
            )
        }

        if (type == "TRIGGER") {
            return (
                <Box>
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.2}
                    />
                    <StyledNormalText text=" has confirmed target." />
                </Box>
            )
        }

        if (type == "ASSIGNED") {
            return (
                <Box>
                    <StyledImageText
                        text={username}
                        color={faction.theme.primary}
                        imageUrl={
                            faction
                                ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`
                                : undefined
                        }
                        imageMb={-0.2}
                    />
                    <StyledNormalText text=" is assigned to choose a target." />
                </Box>
            )
        }

        return null
    }

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: mainColor || "none",
                isFancy: true,
                borderThickness: ".2rem",
            }}
        >
            <Stack
                spacing=".5rem"
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                    backgroundColor: colors.darkNavy,
                }}
            >
                <Box>
                    <StyledImageText
                        text={acronym(faction.label) || "GABS"}
                        color={mainColor || "grey !important"}
                        imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`}
                        imageMb={-0.2}
                    />
                    <Icon />
                    <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} imageMb={-0.2} />
                </Box>
                <Content />
            </Stack>
        </ClipThing>
    )
}
