import { Box, Fade, Stack, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { FactionAbilityItem } from '..'
import { NullUUID } from '../../constants'
import { useAuth, useWebsocket } from '../../containers'
import HubKey from '../../keys'
import { FactionAbility } from '../../types'

export const FactionAbilities = () => {
    const { state, subscribe } = useWebsocket()
    const theme = useTheme<Theme>()
    const [factionAbilities, setFactionAbilities] = useState<FactionAbility[]>()
    const { user } = useAuth()
    const userID = user?.id
    const factionID = user?.factionID

    // Subscribe to faction ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !userID || userID === NullUUID || !factionID || factionID === NullUUID) return
        return subscribe<FactionAbility[] | undefined>(
            HubKey.SubFactionAbilities,
            (payload) => setFactionAbilities(payload),
            null,
        )
    }, [subscribe, state, userID, factionID])

    if (!factionAbilities || factionAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Stack spacing={0.3}>
                <Typography sx={{ color: theme.factionTheme.primary, fontWeight: 'fontWeightBold' }}>
                    SYNDICATE UNIQUE SKILLS
                </Typography>

                <Stack spacing={1.3}>
                    {factionAbilities.map((fa) => (
                        <Box key={fa.id}>
                            <FactionAbilityItem factionAbility={fa} />
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </Fade>
    )
}
