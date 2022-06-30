import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { SvgCancelled, SvgDeath, SvgDisconnected, SvgHourglass, SvgLocation } from "../../../assets"
import { FallbackUser } from "../../../containers"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleAbility, Faction, User } from "../../../types"

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

export enum LocationSelectAlertType {
    CancelledNoPlayer = "CANCELLED_NO_PLAYER",
    CancelledDisconnect = "CANCELLED_DISCONNECT",
    FailedTimeOut = "FAILED_TIMEOUT",
    FailedDisconnected = "FAILED_DISCONNECTED",
    Trigger = "TRIGGER",
    Assigned = "ASSIGNED",
}

export interface LocationSelectAlertProps {
    type: LocationSelectAlertType
    currentUser?: User
    nextUser?: User
    ability: BattleAbility
    x?: number
    y?: number
}

export const LocationSelectAlert = ({ data, getFaction }: { data: LocationSelectAlertProps; getFaction: (factionID: string) => Faction }) => {
    const { type, currentUser, ability } = data
    const { label, colour, image_url } = ability
    const { username, gid, faction_id } = currentUser || FallbackUser

    const faction = getFaction(faction_id)
    const abilityImageUrl = useMemo(() => `${image_url}`, [image_url])
    const mainColor = faction.primary_color

    const Icon = () => {
        if (type === LocationSelectAlertType.CancelledNoPlayer || type === LocationSelectAlertType.CancelledDisconnect) {
            return <SvgCancelled fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type === LocationSelectAlertType.FailedTimeOut) {
            return <SvgHourglass fill="#FFFFFF" size="1.15rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type === LocationSelectAlertType.FailedDisconnected) {
            return <SvgDisconnected fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type === LocationSelectAlertType.Trigger) {
            return <SvgDeath fill="#FFFFFF" size="1.25rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        if (type === LocationSelectAlertType.Assigned) {
            return <SvgLocation fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
        }

        return <SvgDeath fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
    }

    const Content = () => {
        if (type === LocationSelectAlertType.CancelledNoPlayer || type === LocationSelectAlertType.CancelledDisconnect) {
            return (
                <Box>
                    <StyledNormalText text="Cancelled as there were no players available to choose a target." />
                </Box>
            )
        }

        if (type === LocationSelectAlertType.FailedTimeOut || type === LocationSelectAlertType.FailedDisconnected) {
            return (
                <Box>
                    <StyledImageText
                        text={
                            <>
                                {`${username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </>
                        }
                        color={mainColor}
                        imageUrl={faction.logo_url}
                        imageMb={-0.2}
                    />
                    <StyledNormalText text=" failed to choose a target." />
                </Box>
            )
        }

        if (type === LocationSelectAlertType.Trigger) {
            return (
                <Box>
                    <StyledImageText
                        text={
                            <>
                                {`${username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </>
                        }
                        color={mainColor}
                        imageUrl={faction.logo_url}
                        imageMb={-0.2}
                    />
                    <StyledNormalText text=" has confirmed target." />
                </Box>
            )
        }

        if (type === LocationSelectAlertType.Assigned) {
            return (
                <Box>
                    <StyledImageText
                        text={
                            <>
                                {`${username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </>
                        }
                        color={mainColor}
                        imageUrl={faction.logo_url}
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
            clipSize="6px"
            border={{
                borderColor: mainColor || colors.grey,
                isFancy: true,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.darkNavy}
        >
            <Stack
                spacing=".5rem"
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                }}
            >
                <Box>
                    <StyledImageText
                        text={acronym(faction.label) || "GABS"}
                        color={mainColor || "grey !important"}
                        imageUrl={faction.logo_url}
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
