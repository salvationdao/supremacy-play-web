import { Box, Stack, Typography } from '@mui/material'
import { BattleEndTooltip, StyledImageText } from '..'
import { PASSPORT_WEB } from '../../constants'
import { colors } from '../../theme/theme'
import { BattleEndDetail } from '../../types'

export const SectionMostFrequentAbilityExecutor = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { mostFrequentAbilityExecutors } = battleEndDetail

    return (
        <Stack spacing={2}>
            <Box sx={{ px: 2.5, py: 1.1, backgroundColor: '#00000083' }}>
                <Typography
                    component="span"
                    variant="h4"
                    sx={{
                        position: 'relative',
                        fontFamily: 'Nostromo Regular Black',
                        fontWeight: 'fontWeightBold',
                        color: colors.neonBlue,
                    }}
                >
                    EXECUTORS
                    <BattleEndTooltip
                        text="The players that had executed the most abilities during the battle."
                        color={colors.neonBlue}
                    />
                </Typography>
            </Box>

            {mostFrequentAbilityExecutors && mostFrequentAbilityExecutors.length > 0 && (
                <Stack spacing={2}>
                    <Stack spacing={1.3} sx={{ pl: 1 }}>
                        {mostFrequentAbilityExecutors.map((u, index) => (
                            <Stack key={index} direction="row" spacing={1.3} alignItems="center">
                                <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: 'fontWeightBold' }}>
                                    {index + 1}.
                                </Typography>
                                <StyledImageText
                                    color={u.faction.theme.primary}
                                    text={u.username}
                                    imageUrl={`${PASSPORT_WEB}/api/files/${u.avatarID}`}
                                    variant="h5"
                                    imageSize={29}
                                    imageBorderThickness="2px"
                                    fontWeight="normal"
                                    truncateLine
                                />
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}
