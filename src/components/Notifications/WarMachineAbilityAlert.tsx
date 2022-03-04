import { Box } from "@mui/material"
import { StyledImageText, StyledNormalText } from ".."
import { GenericWarMachinePNG, SvgEmergency } from "../../assets"
import { GAME_SERVER_HOSTNAME } from "../../constants"
import { httpProtocol } from "../../containers"
import { BattleAbility, User, WarMachineState } from "../../types"

interface WarMachineAbilityAlertProps {
    user?: User
    ability: BattleAbility
    warMachine: WarMachineState
}

export const WarMachineAbilityAlert = ({ data }: { data: WarMachineAbilityAlertProps }) => {
    const { ability, warMachine } = data
    const { label, colour, imageUrl } = ability
    const { name, imageUrl: warMachineImageUrl, faction } = warMachine

    const wmImageUrl = warMachineImageUrl || GenericWarMachinePNG

    return (
        <Box>
            <SvgEmergency size="12px" sx={{ display: "inline", mr: 0.5 }} />
            <StyledImageText
                text={label}
                color={colour}
                imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${imageUrl}`}
            />
            <StyledNormalText text=" has been initiated by " />
            <StyledImageText text={name} color={faction.theme.primary} imageUrl={wmImageUrl} />
        </Box>
    )
}
