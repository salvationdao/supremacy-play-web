import { Box, Stack } from "@mui/material"
import { StyledImageText, StyledNormalText } from "../.."
import { SvgEmergency } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll, httpProtocol } from "../../../containers"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleAbility, User } from "../../../types"

interface BattleFactionAbilityAlertProps {
    user?: User
    ability: BattleAbility
}

export const BattleAbilityAlert = ({
    data,
    factionsAll,
}: {
    data: BattleFactionAbilityAlertProps
    factionsAll: FactionsAll
}) => {
    const { user, ability } = data
    const { label, colour, image_url } = ability

    return (
        <Stack spacing=".8rem">
            <StyledImageText
                text={label}
                color={colour}
                imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`}
                imageMb={-0.3}
            />
            <Box>
                <SvgEmergency fill={colors.orange} size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                <StyledNormalText text="Initiated by " />
                <StyledImageText
                    text={user ? acronym(user.faction.label) : "GABS"}
                    color={user ? user.faction.theme.primary : "grey !important"}
                    imageUrl={
                        user && user.faction
                            ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[user.faction.id]?.logo_blob_id}`
                            : undefined
                    }
                    imageMb={-0.3}
                />
            </Box>
        </Stack>
    )
}
