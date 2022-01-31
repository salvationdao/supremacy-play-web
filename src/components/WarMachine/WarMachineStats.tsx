import { Box, Slide, Stack } from '@mui/material'
import { UI_OPACITY } from '../../constants'
import { colors } from '../../theme/theme'
import { WarMachineItem } from './WarMachineItem'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useWarMachines } from '../../containers'

export const WarMachineStats = () => {
    const theme = useTheme<Theme>()
    const { warMachinesSub } = useWarMachines()

    if (!warMachinesSub || warMachinesSub.length <= 0) return null

    return (
        <Stack
            sx={{
                position: 'absolute',
                bottom: 15,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 15,
                overflow: 'hidden',
                opacity: UI_OPACITY,
            }}
        >
            <Slide in={true} direction="up">
                <Box>
                    <Box
                        sx={{
                            flex: 1,
                            // 100vw, 18px each side
                            maxWidth: 'calc(100vw - (2 * 18px))',
                            overflowY: 'hidden',
                            overflowX: 'auto',
                            direction: 'ltr',
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
                            transition: 'all .2s',
                        }}
                    >
                        <Box sx={{ direction: 'ltr' }}>
                            <Stack spacing={3} direction="row" alignItems="center">
                                {warMachinesSub.map((m) => (
                                    <Box key={m.tokenID}>
                                        <WarMachineItem warMachine={m} />
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>
        </Stack>
    )
}
