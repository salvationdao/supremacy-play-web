import { Box, Slide, Stack, Typography } from '@mui/material'
import { ClipThing, FactionAbilityItem } from '..'
import { UI_OPACITY } from '../../constants'
import { useDimension, useGame } from '../../containers'
import { colors } from '../../theme/theme'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useMemo } from 'react'

export const VotingActions = () => {
    const { battleState, factionAbilities } = useGame()
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()
    const isVoting = useMemo(() => battleState?.phase == 'FIRST_VOTE' || battleState?.phase == 'TIE', [battleState])

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
            }}
        >
            <Slide in={isVoting} direction="right">
                <Box>
                    <ClipThing border={{ isFancy: true, borderThickness: '3px' }} clipSize="10px">
                        <Box
                            sx={{ backgroundColor: theme.factionTheme.background, pl: 0.3, pr: 1.3, pt: 1.2, pb: 1.4 }}
                        >
                            <Typography sx={{ ml: 1, mb: 1, fontWeight: 'fontWeightBold' }}>
                                VOTE FOR AN ACTION:
                            </Typography>

                            <Box
                                sx={{
                                    flex: 1,
                                    // 280px total height, 24px title height
                                    maxHeight: `calc(288px - 24px)`,
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
                                <Box sx={{ direction: 'ltr' }}>
                                    <Stack spacing={1.3}>
                                        {factionAbilities &&
                                            factionAbilities.map((a) => (
                                                <Box key={a.id}>
                                                    <FactionAbilityItem a={a} />
                                                </Box>
                                            ))}
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}
