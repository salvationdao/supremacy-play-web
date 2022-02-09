import React, { useEffect, useState } from 'react'
import { Box, BoxProps, Stack, Typography } from '@mui/material'
import { WarMachineState } from '../../types'
import { ClipThing } from '..'
import { colors } from '../../theme/theme'
import { SvgSkull } from '../../assets'
import { useAuth, useWebsocket } from '../../containers'
import { NullUUID } from '../../constants'

interface BoxSlantedProps extends BoxProps {
    clipSize?: string
    clipSlantSize?: string
}

const BoxSlanted: React.FC<BoxSlantedProps> = ({ children, clipSize = '0px', clipSlantSize = '0px', sx, ...props }) => {
    return (
        <Box
            {...props}
            sx={{
                ...sx,
                clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${clipSize}) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, 0% calc(100% - ${clipSize}))`,
            }}
        >
            {children}
        </Box>
    )
}

export const WarMachineItem = ({ warMachine }: { warMachine: WarMachineState }) => {
    const { user } = useAuth()
    const userID = user?.id
    const factionID = user?.factionID
    const { state, subscribeWarMachineStatNetMessage } = useWebsocket()

    const [health, setHealth] = useState<number>(0)
    const [shield, setShield] = useState<number>(0)

    const {
        participantID,
        faction,
        name,
        imageUrl,
        maxHealth,
        maxShield,
        health: initialHealth,
        shield: initialShield,
    } = warMachine
    const {
        logoUrl: factionLogoUrl,
        theme: { primary, background },
    } = faction

    useEffect(() => {
        setHealth(initialHealth)
        setShield(initialShield)
    }, [])

    // Listen on current war machine changes
    useEffect(() => {
        if (
            state !== WebSocket.OPEN ||
            !subscribeWarMachineStatNetMessage ||
            !userID ||
            userID === '' ||
            !factionID ||
            factionID === NullUUID
        )
            return

        return subscribeWarMachineStatNetMessage<WarMachineState | undefined>(participantID, (payload) => {
            if (!payload) return
            setHealth(payload.health)
            setShield(payload.shield)
        })
    }, [participantID, state, subscribeWarMachineStatNetMessage, userID, factionID])

    const isAlive = health > 0

    return (
        <BoxSlanted clipSlantSize="20px" key={`WarMachineItem-${participantID}`}>
            <Stack direction="row" alignItems="center" sx={{ width: 225, opacity: isAlive ? 1 : 0.5 }}>
                <ClipThing
                    clipSize="8px"
                    clipSlantSize="20px"
                    border={{ isFancy: false, borderColor: primary, borderThickness: '2.5px' }}
                    sx={{ zIndex: 2 }}
                >
                    <Box
                        sx={{
                            width: 92,
                            height: 76,
                            overflow: 'hidden',
                            backgroundColor: primary,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    >
                        {!isAlive && (
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: 3.3,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(#00000090, #000000)',
                                }}
                            >
                                <SvgSkull fill="#FFFFFF" size="100%" />
                            </Stack>
                        )}
                    </Box>
                </ClipThing>

                <Stack
                    justifyContent="flex-end"
                    sx={{
                        flex: 1,
                        ml: -2.5,
                        mb: '-2.3px',
                        height: 78.4,
                        borderBottomStyle: 'solid',
                        borderBottomWidth: '2.5px',
                        borderBottomColor: primary,

                        backgroundColor: '#00000056',
                        opacity: isAlive ? 1 : 0.7,
                        zIndex: 1,
                    }}
                >
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ flex: 1, pl: 3, pr: 2.2 }}>
                        <Stack justifyContent="center" spacing={0.5} sx={{ flex: 1, height: '100%' }}>
                            <Box>
                                <BoxSlanted
                                    clipSlantSize="4.2px"
                                    sx={{ width: '100%', height: 12, backgroundColor: '#FFFFFF30' }}
                                >
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

                        <Box
                            sx={{
                                width: 26,
                                height: 26,
                                backgroundImage: `url(${factionLogoUrl})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                backgroundSize: 'contain',
                            }}
                        />
                    </Stack>

                    <Stack
                        justifyContent="center"
                        sx={{ pl: 2.2, pr: 3.4, py: 0.7, height: 33, backgroundColor: `${background}95` }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#FFFFFF',
                                lineHeight: 1,
                                fontWeight: 'fontWeightBold',
                                fontFamily: 'Nostromo Regular Black',

                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'normal',
                                display: '-webkit-box',
                                overflowWrap: 'anywhere',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                            }}
                        >
                            {name}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </BoxSlanted>
    )
}
