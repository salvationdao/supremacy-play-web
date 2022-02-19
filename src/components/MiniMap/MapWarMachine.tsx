import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { SvgMapSkull, GenericWarMachine, SvgMapWarMachine } from '../../assets'
import { useWebsocket } from '../../containers'
import { shadeColor } from '../../helpers'
import { colors } from '../../theme/theme'
import { Map, NetMessageTickWarMachine, Vector2i, WarMachineState } from '../../types'

const ICON_SIZE = 25
const ARROW_LENGTH = ICON_SIZE / 2 + 10

export const MapWarMachine = ({ warMachine, map }: { warMachine: WarMachineState; map: Map }) => {
    const { participantID, faction, maxHealth, maxShield, imageUrl } = warMachine
    const { state, subscribeWarMachineStatNetMessage } = useWebsocket()

    const wmImageUrl = imageUrl || GenericWarMachine

    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)
    const [position, sePosition] = useState<Vector2i>(warMachine.position)
    // 0 is east, and goes CW, can be negative and above 360
    const [rotation, setRotation] = useState<number>(warMachine.rotation)
    const isAlive = health > 0
    const primaryColor = faction && faction.theme ? faction.theme.primary : '#FFFFFF'

    // Listen on current war machine changes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeWarMachineStatNetMessage) return

        return subscribeWarMachineStatNetMessage<NetMessageTickWarMachine | undefined>(participantID, (payload) => {
            if (payload?.health !== undefined) setHealth(payload.health)
            if (payload?.shield !== undefined) setShield(payload.shield)
            if (payload?.position !== undefined) sePosition(payload.position)
            if (payload?.rotation !== undefined) setRotation(payload.rotation)
        })
    }, [participantID, state, subscribeWarMachineStatNetMessage])

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
                zIndex: isAlive ? 5 : 4,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    overflow: 'visible',
                    backgroundColor: primaryColor,
                    backgroundImage: `url(${wmImageUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    border: `${primaryColor} solid 1px`,
                    borderRadius: 1,
                    boxShadow: isAlive ? `0 0 8px 2px ${shadeColor(primaryColor, 80)}70` : 'none',
                    zIndex: 2,
                }}
            >
                {!isAlive && (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(#00000040, #00000090)',
                        }}
                    >
                        <SvgMapSkull
                            fill="#000000"
                            size="13px"
                            sx={{
                                position: 'absolute',
                                top: '52%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    </Stack>
                )}

                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${rotation + 90}deg)`,
                        transition: 'all .2s',
                        zIndex: -1,
                    }}
                >
                    <Box sx={{ position: 'relative', height: ARROW_LENGTH }}>
                        <SvgMapWarMachine
                            fill={primaryColor}
                            size="10px"
                            sx={{
                                position: 'absolute',
                                top: -6,
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        />
                    </Box>
                    <Box sx={{ height: ARROW_LENGTH }} />
                </Box>
            </Box>

            {isAlive && (
                <Stack sx={{ mt: 0.2, width: 34, zIndex: 1 }} spacing={0.1}>
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
        </Stack>
    )
}
