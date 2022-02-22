import { Box } from '@mui/material'
import { StyledImageText, StyledNormalText } from '..'
import { GenericWarMachinePNG } from '../../assets'
import { BattleAbility, User, WarMachineState } from '../../types'

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
            <StyledImageText text={label} color={colour} imageUrl={imageUrl} />
            <StyledNormalText text=" has been initiated by " />
            <StyledImageText text={name} color={faction.theme.primary} imageUrl={wmImageUrl} />
            <StyledNormalText text="." />
        </Box>
    )
}