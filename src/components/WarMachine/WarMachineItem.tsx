import React from 'react'
import { Box, BoxProps, CardMedia, Stack, Typography } from '@mui/material'
import { WarMachineState } from '../../types'
import { ClipThing } from '..'
import { colors } from '../../theme/theme'

const defaultClipSlantSize = '18px'

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
    const { tokenID, faction, name, imageUrl, maxHitPoint, maxShield, remainHitPoint, remainShield } = warMachine
    const {
        label,
        logoUrl: factionLogoUrl,
        theme: { primary },
    } = faction

    return (
        <BoxSlanted clipSlantSize={defaultClipSlantSize}>
            <Stack direction="row" alignItems="center" sx={{ width: 200 }}>
                <ClipThing
                    clipSize="8px"
                    clipSlantSize={defaultClipSlantSize}
                    border={{ isFancy: false, borderColor: primary, borderThickness: '1.5px' }}
                    sx={{ zIndex: 2 }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 60,
                            overflow: 'hidden',
                            backgroundColor: primary,
                            backgroundImage: `url(${factionLogoUrl})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    />
                </ClipThing>

                <Stack
                    justifyContent="flex-end"
                    sx={{
                        flex: 1,
                        ml: -2.4,
                        mb: '-1.5px',
                        height: 60,
                        borderBottomStyle: 'solid',
                        borderBottomWidth: '2px',
                        borderBottomColor: primary,
                        zIndex: 1,
                    }}
                >
                    <Stack direction="row" spacing={0.4}>
                        <Box>
                            <BoxSlanted clipSlantSize={defaultClipSlantSize} sx={{ width: 25, height: 9 }}>
                                <Box
                                    sx={{
                                        width: `${(remainHitPoint / maxHitPoint) * 100}%`,
                                        height: '100%',
                                        backgroundColor: colors.health,
                                    }}
                                />
                            </BoxSlanted>

                            <BoxSlanted clipSlantSize={defaultClipSlantSize} sx={{ width: 25, height: 9 }}>
                                <Box
                                    sx={{
                                        width: `${(remainShield / maxShield) * 100}%`,
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
                            <CardMedia component="img" alt={label} height="100%" image={factionLogoUrl} />
                        </Stack>
                    </Stack>

                    <Box sx={{ pl: 2.2, pr: 4, py: 0.7, backgroundColor: '#00000025' }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#FFFFFF',
                                lineHeight: 1,
                                fontWeight: 'fontWeightBold',
                                fontFamily: 'Nostromo Regular Black',
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
