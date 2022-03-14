import { Box, Stack } from "@mui/material"
import { StyledImageText, StyledNormalText } from "../.."
import { SvgEmergency } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll, httpProtocol } from "../../../containers"
import { acronym } from "../../../helpers"
import { BattleAbility, User } from "../../../types"

interface BattleFactionAbilityAlertProps {
    user?: User
    ability: BattleAbility
}

export const FactionAbilityAlert = ({
    data,
    factionsAll,
}: {
    data: BattleFactionAbilityAlertProps
    factionsAll: FactionsAll
}) => {
    const { user, ability } = data
    const { label, colour, image_url } = ability

    return (
        <Stack spacing={1}>
            <StyledImageText
                text={label}
                color={colour}
                imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`}
                imageMb={-0.3}
            />
            <Box>
                <SvgEmergency size="12px" sx={{ display: "inline", mr: 0.5 }} />
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
