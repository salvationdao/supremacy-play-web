import { Box, Divider } from "@mui/material"
import { FallbackUser, StyledImageText, StyledNormalText } from "../.."
import { SvgEmergency, SvgLocation } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll, httpProtocol } from "../../../containers"
import { acronym } from "../../../helpers"
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
    const { username, avatar_id, faction } = user || FallbackUser

    return (
        <Box>
            <SvgEmergency size="12px" sx={{ display: "inline", mr: 0.5 }} />
            <StyledImageText
                text={label}
                color={colour}
                imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`}
            />
            <StyledNormalText text=" has been initiated by " />
            <StyledImageText
                text={user ? acronym(user.faction.label) : "GABS"}
                color={user ? user.faction.theme.primary : "grey !important"}
                imageUrl={
                    user && user.faction
                        ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[user.faction.id]?.logo_blob_id}`
                        : undefined
                }
            />
            <StyledNormalText text=". " />
            <Divider sx={{ my: 1.2, borderColor: "#FFFFFF", opacity: 0.15 }} />
            <SvgLocation size="12px" sx={{ display: "inline", mr: 0.5 }} />
            <StyledImageText
                imageUrl={avatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id}` : undefined}
                text={username}
                color={faction.theme.primary}
            />
            <StyledNormalText text=" has been assigned to choose a target location" />
        </Box>
    )
}
