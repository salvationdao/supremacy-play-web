import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, StyledImageText } from "../.."
import { SvgLocation } from "../../../assets"
import { FallbackUser } from "../../../containers"
import { colors } from "../../../theme/theme"
import { BattleAbility, Faction, User } from "../../../types"
import { Player } from "../../Common/Player"

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
    const { currentUser, ability } = data
    const { label, colour, image_url } = ability
    const { faction_id } = currentUser || FallbackUser

    const faction = getFaction(faction_id)
    const abilityImageUrl = useMemo(() => `${image_url}`, [image_url])
    const mainColor = faction.primary_color

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: mainColor || colors.grey,
                isFancy: true,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.darkNavy}
        >
            <Stack spacing=".5rem" sx={{ px: "1.44rem", pt: "1.2rem", pb: ".8rem" }}>
                <Box>
                    <Player player={currentUser || FallbackUser} />
                    <SvgLocation fill="#FFFFFF" size="1.3rem" sx={{ display: "inline", mx: ".4rem" }} />
                    <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} />
                </Box>
            </Stack>
        </ClipThing>
    )
}
