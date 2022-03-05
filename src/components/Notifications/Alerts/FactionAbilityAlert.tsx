import { Box } from "@mui/material"
import { StyledImageText, StyledNormalText } from "../.."
import { SvgEmergency } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { httpProtocol } from "../../../containers"
import { BattleAbility, User } from "../../../types"

interface BattleFactionAbilityAlertProps {
    user?: User
    ability: BattleAbility
}

export const FactionAbilityAlert = ({ data }: { data: BattleFactionAbilityAlertProps }) => {
    const { user, ability } = data
    const { label, colour, imageUrl } = ability

    return (
        <Box>
            <SvgEmergency size="12px" sx={{ display: "inline", mr: 0.5 }} />
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
                    user && user.faction.logoBlobID
                        ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logoBlobID}`
                        : undefined
                }
            />
        </Box>
    )
}
