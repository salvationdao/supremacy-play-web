import { Box, Divider, Slide, Stack } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { ClipThing, BattleAbility, Prices } from '..'
import { UI_OPACITY } from '../../constants'
import { useDimension } from '../../containers'
import { colors } from '../../theme/theme'
import { useAuth } from '../../containers'
import { FactionAbilities } from './FactionAbilities'

export const VotingSystem = () => {
    const { user } = useAuth()
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()

    if (!user || !user.faction) return null

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: 70,
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
                            <Box sx={{ ml: 1, mb: 2 }}>
                                <Prices />
                                <Divider sx={{ mt: 1.6, borderColor: theme.factionTheme.primary, opacity: 0.28 }} />
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    // 100vh, 150px gap bottom, 70px gap above, 56px for the title
                                    maxHeight: `calc(${height}px - 150px - 70px - 56px)`,
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
                                <Stack spacing={2.5} sx={{ direction: 'ltr' }}>
                                    <BattleAbility />
                                    <FactionAbilities />
                                </Stack>
                            </Box>
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}
