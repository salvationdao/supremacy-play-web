import { Box } from '@mui/material'
import { StyledImageText, StyledNormalText } from '..'
import { PASSPORT_WEB } from '../../constants'
import { BattleAbility, User, WarMachineState } from '../../types'

interface WarMachineAbilityAlertProps {
    user?: User
    ability: BattleAbility
    warMachine: WarMachineState
}

export const WarMachineAbilityAlert = ({ data }: { data: WarMachineAbilityAlertProps }) => {
    const { user, ability, warMachine } = data
    const { label, colour, imageUrl } = ability
    const { name, imageUrl: warMachineImageUrl, faction } = warMachine

    return (
        <Box>
            <StyledImageText text={label} color={colour} />
            <StyledNormalText text=" has been initiated by " />
            <StyledImageText
                text={name}
                color={faction.theme.primary}
                imageUrl={warMachineImageUrl ? warMachineImageUrl : undefined}
            />
            <StyledNormalText text="." />
        </Box>
    )
}
