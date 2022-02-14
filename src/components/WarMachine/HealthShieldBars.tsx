import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { NetMessageTickWarMachine, WarMachineState } from '../../types'
import { BoxSlanted } from '..'
import { colors } from '../../theme/theme'
import { useWebsocket } from '../../containers'

export const HealthShieldBars = ({
    warMachine,
    setIsAlive,
}: {
    warMachine: WarMachineState
    setIsAlive: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { participantID, maxHealth, maxShield } = warMachine
    const { state, subscribeWarMachineStatNetMessage } = useWebsocket()
    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)
    const alreadySetAlive = useRef(false)

    // Listen on current war machine changes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeWarMachineStatNetMessage) return

        return subscribeWarMachineStatNetMessage<NetMessageTickWarMachine | undefined>(participantID, (payload) => {
            if (payload?.health !== undefined) {
                setHealth(payload.health)

                if (payload.health <= 0) {
                    setIsAlive(false)
                    alreadySetAlive.current = false
                } else if (!alreadySetAlive.current) {
                    setIsAlive(true)
                    alreadySetAlive.current = true
                }
            }
            if (payload?.shield !== undefined) setShield(payload.shield)
        })
    }, [participantID, state, subscribeWarMachineStatNetMessage])

    return (
        <Stack justifyContent="center" spacing={0.5} sx={{ flex: 1, height: '100%' }}>
            <Box>
                <BoxSlanted clipSlantSize="4.2px" sx={{ width: '100%', height: 12, backgroundColor: '#FFFFFF30' }}>
                    <BoxSlanted
                        clipSlantSize="4.2px"
                        sx={{
                            width: `${(shield / maxShield) * 100}%`,
                            height: '100%',
                            backgroundColor: colors.shield,
                        }}
                    />
                </BoxSlanted>
            </Box>

            <Box>
                <BoxSlanted
                    clipSlantSize="4.2px"
                    sx={{ ml: -0.5, width: '100%', height: 12, backgroundColor: '#FFFFFF30' }}
                >
                    <BoxSlanted
                        clipSlantSize="4.2px"
                        sx={{
                            width: `${(health / maxHealth) * 100}%`,
                            height: '100%',
                            backgroundColor: health / maxHealth <= 0.45 ? colors.red : colors.health,
                        }}
                    />
                </BoxSlanted>
            </Box>
        </Stack>
    )
}
