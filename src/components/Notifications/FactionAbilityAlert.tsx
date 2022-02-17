import { Box } from '@mui/material'
import { StyledImageText, StyledNormalText } from '..'
import { PASSPORT_WEB } from '../../constants'
import { BattleAbility, User } from '../../types'

interface BattleFactionAbilityAlertProps {
    user?: User
    ability: BattleAbility
}

export const FactionAbilityAlert = ({ data }: { data: BattleFactionAbilityAlertProps }) => {
    const { user, ability } = data
    const { label, colour, imageUrl } = ability

    return (
        <Box>
            <StyledImageText text={label} color={colour} imageUrl={imageUrl} />
            <StyledNormalText text=" has been initiated by " />
            <StyledImageText
                text={user ? user.faction.label : 'GABS'}
                color={user ? user.faction.theme.primary : 'grey !important'}
                imageUrl={
                    user && user.faction.logoBlobID ? `${PASSPORT_WEB}/api/files/${user.faction.logoBlobID}` : undefined
                }
            />
            <StyledNormalText text="." />
        </Box>
    )
}
