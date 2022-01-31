import React from 'react'
import { Box, BoxProps, CardMedia, Stack, Typography } from '@mui/material'
import { WarMachineState } from '../../types'
import { ClipThing } from '..'
import { colors } from '../../theme/theme'

const defaultClipSlantSize = '8px'

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
    const { tokenID, faction, name, imageUrl, healthMax, shieldMax, health, shield } = warMachine
    const {
        label,
        imageUrl: factionImageUrl,
        theme: { primary },
    } = faction

    return (
        <BoxSlanted
            clipSlantSize={defaultClipSlantSize}
            sx={{
                borderBottomWidth: '1.5px',
                borderBottomColor: primary,
            }}
        >
            <Stack direction="row" alignItems="center">
                <ClipThing
                    clipSize="7px"
                    clipSlantSize={defaultClipSlantSize}
                    border={{ isFancy: false, borderColor: primary, borderThickness: '1.5px' }}
                >
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            height: '100%',
                            width: 61,
                        }}
                    >
                        <CardMedia component="img" alt={name} height="100%" image={imageUrl} />
                    </Stack>
                </ClipThing>

                <Stack>
                    <Stack direction="row" spacing={0.4}>
                        <Box>
                            <BoxSlanted clipSlantSize={defaultClipSlantSize} sx={{ width: 25, height: 9 }}>
                                <Box
                                    sx={{
                                        width: `${(health / healthMax) * 100}%`,
                                        height: '100%',
                                        backgroundColor: colors.health,
                                    }}
                                />
                            </BoxSlanted>

                            <BoxSlanted clipSlantSize={defaultClipSlantSize} sx={{ width: 25, height: 9 }}>
                                <Box
                                    sx={{
                                        width: `${(shieldMax / shield) * 100}%`,
                                        height: '100%',
                                        backgroundColor: colors.shield,
                                    }}
                                />
                            </BoxSlanted>
                        </Box>

                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                height: '100%',
                                width: 16,
                            }}
                        >
                            <CardMedia component="img" alt={label} height="100%" image={factionImageUrl} />
                        </Stack>
                    </Stack>

                    <Box sx={{ px: 2, py: 1, backgroundColor: '#00000025' }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 'fontWeightBold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {name}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </BoxSlanted>
    )
}
