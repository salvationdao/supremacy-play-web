import { Box, Stack } from "@mui/material"
import { ClipThing, StyledImageText } from "../.."
import { SvgEmergency } from "../../../assets"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleFactionAbilityAlertProps, Faction } from "../../../types"

export const FactionAbilityAlert = ({ data, getFaction }: { data: BattleFactionAbilityAlertProps; getFaction: (factionID: string) => Faction }) => {
    const { user, ability } = data
    const { label, colour, image_url } = ability

    const faction = getFaction(user?.faction_id)
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
                    <StyledImageText text={user ? acronym(faction.label) : "GABS"} color={mainColor || "grey !important"} imageUrl={faction.logo_url} />
                    <SvgEmergency fill="#FFFFFF" size="1.3rem" sx={{ display: "inline", mx: ".4rem" }} />
                    <StyledImageText text={label} color={colour} imageUrl={`${image_url}`} />
                </Box>
            </Stack>
        </ClipThing>
    )
}
