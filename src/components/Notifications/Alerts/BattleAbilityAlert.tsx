import { Box, Stack } from "@mui/material"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { SvgEmergency } from "../../../assets"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleAbility, Faction, User } from "../../../types"

export interface BattleFactionAbilityAlertProps {
    user: User
    ability: BattleAbility
}

export const BattleAbilityAlert = ({ data, getFaction }: { data: BattleFactionAbilityAlertProps; getFaction: (factionID: string) => Faction }) => {
    const { user, ability } = data
    const { label, colour, image_url } = ability

    const faction = getFaction(user.faction_id)
    const mainColor = faction.primary_color

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: mainColor || colors.grey,
                isFancy: true,
                borderThickness: ".15rem",
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
                        text={user ? acronym(faction.label) : "GABS"}
                        color={mainColor || "grey !important"}
                        imageUrl={faction.logo_url}
                        imageMb={-0.2}
                    />
                    <SvgEmergency fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
                    <StyledImageText text={label} color={colour} imageUrl={`${image_url}`} imageMb={-0.2} />
                </Box>
                <Box>
                    <StyledNormalText text="Battle ability has been initiated." />
                </Box>
            </Stack>
        </ClipThing>
    )
}
