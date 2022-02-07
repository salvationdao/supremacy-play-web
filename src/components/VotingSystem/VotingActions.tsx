import { Box, Divider, Slide, Stack } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { ClipThing, BattleAbility, Prices } from '..'
import { UI_OPACITY } from '../../constants'
import { colors } from '../../theme/theme'

export const VotingActions = () => {
    const theme = useTheme<Theme>()

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: 65,
                left: 10,
                zIndex: 14,
                overflow: 'hidden',
                opacity: UI_OPACITY,
                filter: 'drop-shadow(0 3px 3px #00000050)',
                minWidth: 457,
            }}
        >
            <Slide in={true} direction="right">
                <Box>
                    <ClipThing border={{ isFancy: true, borderThickness: '3px' }} clipSize="10px">
                        <Box sx={{ backgroundColor: theme.factionTheme.background, pl: 0.9, pr: 2, pt: 1.8, pb: 2 }}>
                            <Box sx={{ ml: 1, mb: 1.8 }}>
                                <Prices />
                                <Divider sx={{ mt: 1.6, borderColor: theme.factionTheme.primary, opacity: 0.28 }} />
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    // 480px total height, 24px title height
                                    maxHeight: `calc(480px - 24px)`,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    pl: 1,
                                    py: 0.2,
                                    direction: 'rtl',
                                    scrollbarWidth: 'none',
                                    '::-webkit-scrollbar': {
                                        width: 4,
                                    },
                                    '::-webkit-scrollbar-track': {
                                        boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
                                        borderRadius: 3,
                                    },
                                    '::-webkit-scrollbar-thumb': {
                                        background: theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                <Stack spacing={2} sx={{ direction: 'ltr' }}>
                                    <BattleAbility />

                                    {/* <Stack spacing={0}>
                                        <Typography
                                            sx={{ color: theme.factionTheme.primary, fontWeight: 'fontWeightBold' }}
                                        >
                                            SYNDICATE SPECIAL ACTION
                                        </Typography>
                                        <Stack spacing={1.3}>
                                            {battleAbility && (
                                                <BattleAbility battleAbility={battleAbility} isVoting={isVoting} />
                                            )}
                                        </Stack>
                                    </Stack> */}
                                </Stack>
                            </Box>
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}
