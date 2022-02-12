import { Box, Fade, Stack, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { GameAbilityItem } from '..'
import { NullUUID } from '../../constants'
import { useAuth, useWebsocket } from '../../containers'
import HubKey from '../../keys'
import { GameAbility } from '../../types'

export const FactionAbilities = () => {
    const { state, subscribe } = useWebsocket()
    const theme = useTheme<Theme>()
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const { factionID } = useAuth()

    // Subscribe to faction ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !factionID || factionID === NullUUID) return
        return subscribe<GameAbility[] | undefined>(
            HubKey.SubFactionAbilities,
            (payload) => setGameAbilities(payload),
            null,
        )
    }, [subscribe, state, factionID])

    if (!gameAbilities || gameAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Stack spacing={0.3}>
                <Typography sx={{ color: theme.factionTheme.primary, fontWeight: 'fontWeightBold' }}>
                    SYNDICATE UNIQUE SKILLS
                </Typography>

                <Stack spacing={1.3}>
                    {gameAbilities.map((fa) => (
                        <Box key={fa.id}>
                            <GameAbilityItem gameAbility={fa} />
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </Fade>
    )
}
