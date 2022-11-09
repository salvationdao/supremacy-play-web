import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, StyledImageText } from "../../.."
import { SvgLocation } from "../../../../assets"
import { FallbackUser } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { Faction, LocationSelectAlertProps } from "../../../../types"
import { PlayerNameGid } from "../../../Common/PlayerNameGid"

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
                borderThickness: ".2rem",
            }}
            opacity={0.6}
            backgroundColor={colors.darkNavy}
        >
            <Stack spacing=".5rem" sx={{ px: "1.44rem", pt: "1.2rem", pb: ".8rem" }}>
                <Box>
                    <PlayerNameGid player={currentUser || FallbackUser} />
                    <SvgLocation fill="#FFFFFF" size="1.3rem" sx={{ display: "inline", mx: ".4rem" }} />
                    <StyledImageText text={label} color={colour} imageUrl={abilityImageUrl} />
                </Box>
            </Stack>
        </ClipThing>
    )
}
