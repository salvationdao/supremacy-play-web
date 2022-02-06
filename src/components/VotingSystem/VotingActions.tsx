import { Box, Slide, Stack, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { ClipThing, BattleAbilityItem } from '..'
import { SvgSupToken } from '../../assets'
import { UI_OPACITY } from '../../constants'
import { useGame } from '../../containers'
import { colors } from '../../theme/theme'

export const VotingActions = () => {
    const theme = useTheme<Theme>()
    const { factionVotePrice, votingState, battleAbility } = useGame()

    const isVoting = votingState?.phase == 'VOTE_ABILITY_RIGHT' || votingState?.phase == 'NEXT_VOTE_WIN'
    const isShowing = isVoting || votingState?.phase == 'VOTE_COOLDOWN'

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
            <Slide in={isShowing} direction="right">
                <Box>
                    <ClipThing border={{ isFancy: true, borderThickness: '3px' }} clipSize="10px">
                        <Box
                            sx={{ backgroundColor: theme.factionTheme.background, pl: 0.3, pr: 1.3, pt: 1.2, pb: 1.4 }}
                        >
                            <Stack
                                spacing={1.2}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                alignSelf="stretch"
                                sx={{ ml: 1, mb: 1 }}
                            >
                                <Typography sx={{ fontWeight: 'fontWeightBold' }}>
                                    {isVoting ? 'FIGHT FOR THE ACTION:' : 'NEXT ACTION:'}
                                </Typography>

                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <Typography variant="body2" sx={{ color: 'grey !important', lineHeight: 1 }}>
                                        1 vote
                                    </Typography>
                                    <Typography variant="body2" sx={{ mx: 0.3, lineHeight: 1 }}>
                                        =
                                    </Typography>
                                    <SvgSupToken component="span" size="14px" fill={colors.yellow} />
                                    <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                        {factionVotePrice.toNumber()}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box
                                sx={{
                                    flex: 1,
                                    // 180px total height, 24px title height
                                    maxHeight: `calc(180px - 24px)`,
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
                                        {battleAbility && (
                                            <BattleAbilityItem battleAbility={battleAbility} isVoting={isVoting} />
                                        )}
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
