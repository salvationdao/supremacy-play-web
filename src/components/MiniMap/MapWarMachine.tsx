import { Box, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SvgMapWarMachine, SvgMapSkull } from '../../assets'
import { NullUUID } from '../../constants'
import { useAuth, useWebsocket } from '../../containers'
import { colors } from '../../theme/theme'
import { Map, Vector2i, WarMachineState } from '../../types'

export const MapWarMachine = ({ warMachine, map }: { warMachine: WarMachineState; map: Map }) => {
    const { user } = useAuth()
    const userID = user?.id
    const factionID = user?.factionID
    const { state, subscribeWarMachineStatNetMessage } = useWebsocket()

    const [health, setHealth] = useState<number>(0)
    const [shield, setShield] = useState<number>(0)
    const [position, sePosition] = useState<Vector2i>({ x: 0, y: 0 })
    const [rotation, setRotation] = useState<number>(0)
    const prevRotation = useRef(0)

    const {
        participantID,
        faction,
        name,
        maxHealth,
        maxShield,
        health: initialHealth,
        shield: initialShield,
        position: initialPosition,
        rotation: initialRotation,
    } = warMachine

    const isAlive = health > 0
    const primaryColor = faction && faction.theme ? faction.theme.primary : '#FFFFFF'

    useEffect(() => {
        setHealth(initialHealth)
        setShield(initialShield)
        sePosition(initialPosition)
        setRotation(initialRotation)
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
            sePosition(payload.position)

            const newRotation = closestAngle(prevRotation.current, payload.rotation + 90)
            prevRotation.current = rotation
            setRotation(newRotation)
        })
    }, [participantID, state, subscribeWarMachineStatNetMessage, userID, factionID])

    if (!position) return null

    return (
        <Stack
            key={`warMachine-${participantID}`}
            alignItems="center"
            justifyContent="center"
            sx={{
                position: 'absolute',
                pointerEvents: 'none',
                transform: `translate(-50%, -50%) translate3d(${(position.x - map.left) * map.scale}px, ${
                    (position.y - map.top) * map.scale
                }px, 0)`,
                transition: 'transform 0.2s linear',
                zIndex: 5,
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        transform: `rotate3d(0, 0, 1, ${rotation}deg)`,
                        transition: 'transform 0.2s linear',
                    }}
                >
                    <SvgMapWarMachine fill={primaryColor} size="17px" sx={{ opacity: isAlive ? 1 : 0.7, zIndex: 3 }} />

                    {!isAlive && (
                        <SvgMapSkull
                            fill="#000000"
                            size="15px"
                            sx={{
                                position: 'absolute',
                                top: -6,
                                left: '50%',
                                transform: `translate(-50%, 0) rotate3d(0, 0, 1, -${rotation}deg)`,
                            }}
                        />
                    )}
                </Box>

                {isAlive && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: `0 0 20px 9px ${primaryColor}90`,
                            zIndex: -1,
                        }}
                    />
                )}
            </Box>

            {isAlive && (
                <Stack sx={{ mt: 0.7, width: 34 }} spacing={0.1}>
                    <Box sx={{ width: '100%', height: 7, border: '1px solid #00000080' }}>
                        <Box
                            sx={{
                                width: `${(shield / maxShield) * 100}%`,
                                height: '100%',
                                backgroundColor: colors.shield,
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '100%', height: 7, border: '1px solid #00000080' }}>
                        <Box
                            sx={{
                                width: `${(health / maxHealth) * 100}%`,
                                height: '100%',
                                backgroundColor: health / maxHealth <= 0.45 ? colors.red : colors.health,
                            }}
                        />
                    </Box>
                </Stack>
            )}

            {/* <Box sx={{ mt: 0.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: primaryColor,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: 1.1,
                        maxWidth: 70,

                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                        display: '-webkit-box',
                        overflowWrap: 'anywhere',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                    }}
                >
                    {name}aaaaaaaaaaaaaaaaaaa
                </Typography>
            </Box> */}
        </Stack>
    )
}

const closestAngle = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360) - 180
