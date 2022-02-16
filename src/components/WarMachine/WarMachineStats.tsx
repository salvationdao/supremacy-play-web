import { Box, Slide, Stack } from '@mui/material'
import { colors } from '../../theme/theme'
import { WarMachineItem } from './WarMachineItem'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useAuth, useGame } from '../../containers'
import { ReactElement } from 'react'
import { BoxSlanted } from '..'

const ScrollContainer = ({ children }: { children: ReactElement }) => {
    const theme = useTheme<Theme>()

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: 'hidden',
                overflowX: 'auto',
                direction: 'ltr',
                scrollbarWidth: 'none',
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
            <Box sx={{ direction: 'ltr' }}>{children}</Box>
        </Box>
    )
}

export const WarMachineStats = () => {
    const { factionID } = useAuth()
    const { warMachines } = useGame()
    const theme = useTheme<Theme>()

    if (!warMachines || warMachines.length <= 0) return null

    const factionMechs = warMachines.filter((wm) => wm.factionID == factionID)
    const otherMechs = warMachines.filter((wm) => wm.factionID != factionID)
    const haveFactionMechs = factionMechs.length > 0

    return (
        <Slide in={true} direction="up">
            <Stack
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 13,
                    overflow: 'hidden',
                    filter: 'drop-shadow(0 3px 3px #00000020)',
                }}
            >
                {haveFactionMechs && (
                    <BoxSlanted
                        clipSize="9px"
                        clipSlantSize="26px"
                        skipLeft
                        sx={{ px: 5, pt: 2.5, pb: 2, backgroundColor: `${theme.factionTheme.background}95` }}
                    >
                        <ScrollContainer>
                            <Stack spacing={3.2} direction="row" alignItems="center" justifyContent="center">
                                {factionMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.tokenID}`}
                                        warMachine={wm}
                                        scale={1}
                                    />
                                ))}
                            </Stack>
                        </ScrollContainer>
                    </BoxSlanted>
                )}

                {otherMechs.length > 0 && (
                    <Box sx={{ mb: 0.6, pr: 2, pl: haveFactionMechs ? 0 : 2, overflow: 'hidden' }}>
                        <ScrollContainer>
                            <Stack
                                spacing={haveFactionMechs ? -3.2 : -2.5}
                                direction="row"
                                alignItems="center"
                                sx={{ flex: 1, ml: haveFactionMechs ? -1.4 : 0, pb: haveFactionMechs ? 0 : 0.6 }}
                            >
                                {otherMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.tokenID}`}
                                        warMachine={wm}
                                        scale={haveFactionMechs ? 0.8 : 0.8}
                                    />
                                ))}
                            </Stack>
                        </ScrollContainer>
                    </Box>
                )}
            </Stack>
        </Slide>
    )
}
