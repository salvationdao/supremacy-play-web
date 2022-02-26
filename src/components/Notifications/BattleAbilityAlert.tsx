import { Box } from "@mui/material"
import { FallbackUser, StyledImageText, StyledNormalText } from ".."
import { GAME_SERVER_HOSTNAME } from "../../constants"
import { httpProtocol } from "../../containers"
import { BattleAbility, User } from "../../types"

interface BattleFactionAbilityAlertProps {
    user?: User
    ability: BattleAbility
}

export const BattleAbilityAlert = ({ data }: { data: BattleFactionAbilityAlertProps }) => {
    const { user, ability } = data
    const { label, colour, imageUrl } = ability
    const { username, avatarID, faction } = user || FallbackUser

    return (
        <Box>
            <StyledImageText
                text={label}
                color={colour}
                imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${imageUrl}`}
            />
            <StyledNormalText text=" has been initiated by " />
            <StyledImageText
                text={user ? user.faction.label : "GABS"}
                color={user ? user.faction.theme.primary : "grey !important"}
                imageUrl={
                    user && user.faction.logoBlobID ? `${GAME_SERVER_HOSTNAME}/api/files/${user.faction.logoBlobID}` : undefined
                }
            />
            <StyledNormalText text=". " />
            <StyledImageText
                imageUrl={avatarID ? `${GAME_SERVER_HOSTNAME}/api/files/${avatarID}` : undefined}
                text={username}
                color={faction.theme.primary}
            />
            <StyledNormalText text=" has been assigned to choose a target location." />
        </Box>
    )
}
