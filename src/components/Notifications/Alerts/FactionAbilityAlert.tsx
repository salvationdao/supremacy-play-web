import { Box, Stack } from "@mui/material"
import { BattleFactionAbilityAlertProps, ClipThing, StyledImageText, StyledNormalText } from "../.."
import { SvgEmergency } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll } from "../../../containers"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"

export const FactionAbilityAlert = ({ data, factionsAll }: { data: BattleFactionAbilityAlertProps; factionsAll: FactionsAll }) => {
    const { user, ability } = data
    const { label, colour, image_url } = ability

    const mainColor = user?.faction.theme.primary

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: mainColor || colors.grey,
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
                        text={user ? acronym(user.faction.label) : "GABS"}
                        color={mainColor || "grey !important"}
                        imageUrl={user && user.faction ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[user.faction.id]?.logo_blob_id}` : undefined}
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
