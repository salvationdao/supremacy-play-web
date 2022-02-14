import { Box, Slide, Stack } from '@mui/material'
import { colors } from '../../theme/theme'
import { WarMachineItem } from './WarMachineItem'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useAuth, useDimension, useGame } from '../../containers'

export const WarMachineStats = () => {
    const theme = useTheme<Theme>()
    const { factionID } = useAuth()
    const { warMachines } = useGame()
    const {
        iframeDimensions: { width },
    } = useDimension()

    if (!warMachines || warMachines.length <= 0) return null

    return (
        <Stack
            sx={{
                position: 'absolute',
                bottom: 15,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 13,
                overflow: 'hidden',
                filter: 'drop-shadow(0 3px 3px #00000020)',
            }}
        >
            <Slide in={true} direction="up">
                <Box>
                    <Box
                        sx={{
                            flex: 1,
                            // 100vw, 18px each side
                            maxWidth: `calc(${width}px - (2 * 40px))`,
                            overflowY: 'hidden',
                            overflowX: 'auto',
                            direction: 'ltr',
                            scrollbarWidth: 'none',
                            pb: 1.5,
                            '::-webkit-scrollbar': {
                                height: 4,
                            },
                            '::-webkit-scrollbar-track': {
                                boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}50`,
                                borderRadius: 3,
                            },
                            '::-webkit-scrollbar-thumb': {
                                background: `${theme.factionTheme.primary}20`,
                                borderRadius: 3,
                            },
                            transition: 'all .2s',
                        }}
                    >
                        <Box sx={{ direction: 'ltr' }}>
                            <Stack spacing={3.8} direction="row" alignItems="center" justifyContent="flex-start">
                                <Stack spacing={6.5} direction="row" alignItems="center" justifyContent="center">
                                    {warMachines
                                        .filter((wm) => wm.factionID == factionID)
                                        .map((wm) => (
                                            <WarMachineItem
                                                key={`${wm.participantID} - ${wm.tokenID}`}
                                                warMachine={wm}
                                            />
                                        ))}
                                </Stack>

                                <Stack spacing={0} direction="row" alignItems="center" justifyContent="center">
                                    {warMachines
                                        .filter((wm) => wm.factionID != factionID)
                                        .map((wm) => (
                                            <WarMachineItem
                                                key={`${wm.participantID} - ${wm.tokenID}`}
                                                warMachine={wm}
                                            />
                                        ))}
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>
        </Stack>
    )
}
