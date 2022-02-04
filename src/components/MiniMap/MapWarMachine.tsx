import { Box, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SvgMapWarMachine, SvgMapSkull } from '../../assets'
import { colors } from '../../theme/theme'
import { Map, WarMachineState } from '../../types'

export const MapWarMachine = ({ warMachine, map }: { warMachine: WarMachineState; map: Map }) => {
    const { tokenID, faction, name, maxHealth, maxShield, health, shield, position, rotation } = warMachine
    const newRotation = rotation + 90

    if (!position) return null

    const isAlive = health > 0
    const primaryColor = faction && faction.theme ? faction.theme.primary : '#FFFFFF'

    const [rot, setRot] = useState(newRotation)
    const prevRotation = useRef(newRotation)

    useEffect(() => {
        const r = closestAngle(prevRotation.current, newRotation)
        setRot(r)
        prevRotation.current = r
    }, [newRotation])

    return (
        <Stack
            key={`warMachine-${tokenID}`}
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
                        transform: `rotate3d(0, 0, 1, ${rot}deg)`,
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
                                transform: `translate(-50%, 0) rotate3d(0, 0, 1, -${rot}deg)`,
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
                            boxShadow: `0 0 20px 9px ${primaryColor}80`,
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
