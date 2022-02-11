import { Box, Divider, Slide, Stack } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { ClipThing, BattleAbility, Prices } from '..'
import { CONTROLS_HEIGHT, GAMEBAR_HEIGHT, UI_OPACITY } from '../../constants'
import { useDimension, useGame } from '../../containers'
import { colors } from '../../theme/theme'
import { useAuth } from '../../containers'
import { FactionAbilities } from './FactionAbilities'

export const VotingSystem = () => {
    const { user } = useAuth()
    const { votingState } = useGame()
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()

    const isBattleStarted = votingState && votingState.phase !== 'HOLD' && votingState.phase !== 'WAIT_MECH_INTRO'

    if (!user || !user.faction) return null

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 14,
                overflow: 'hidden',
                opacity: UI_OPACITY,
                filter: 'drop-shadow(0 3px 3px #00000050)',
                minWidth: 280,
            }}
        >
            <Slide in={isBattleStarted} direction="right">
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
                                    // 100vh, 150px gap bottom, 10px gap above, 56px for the title, gamebar height, controls height
                                    maxHeight: `calc(${height}px - 150px - 10px - 56px - ${GAMEBAR_HEIGHT}px - ${CONTROLS_HEIGHT}px)`,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    pl: 1.1,
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
