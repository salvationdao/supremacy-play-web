import { Box, Slide, Stack } from '@mui/material'
import { colors } from '../../theme/theme'
import { WarMachineItem } from './WarMachineItem'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useAuth, useDimension, useGame } from '../../containers'
import { ReactElement, useMemo } from 'react'
import { BoxSlanted } from '..'

const WIDTH_MECH_ITEM_FACTION_EXPANDED = 370
const WIDTH_MECH_ITEM_OTHER_EXPANDED = 260
const WIDTH_MECH_ITEM_OTHER_COLLAPSED = 120

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
    const {
        streamDimensions: { width },
    } = useDimension()

    // Determine whether the mech items should be expanded out or collapsed
    const shouldBeExpanded = useMemo(() => {
        let shouldBeExpandedFaction = true
        let shouldBeExpandedOthers = true

        if (!warMachines || warMachines.length <= 0)
            return {
                shouldBeExpandedFaction,
                shouldBeExpandedOthers,
            }

        const factionMechs = warMachines.filter((wm) => wm.factionID == factionID)
        const otherMechs = warMachines.filter((wm) => wm.factionID != factionID)

        if (
            factionMechs.length * WIDTH_MECH_ITEM_FACTION_EXPANDED +
                otherMechs.length * WIDTH_MECH_ITEM_OTHER_EXPANDED >
            width
        ) {
            if (
                factionMechs.length * WIDTH_MECH_ITEM_FACTION_EXPANDED +
                    otherMechs.length * WIDTH_MECH_ITEM_OTHER_COLLAPSED >
                width
            ) {
                shouldBeExpandedFaction = false
                shouldBeExpandedOthers = false
            } else {
                shouldBeExpandedOthers = false
            }
        }

        return { shouldBeExpandedFaction, shouldBeExpandedOthers }
    }, [width])

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
                        sx={{ pl: 5, pr: 7, pt: 2.5, pb: 2, backgroundColor: `${theme.factionTheme.background}95` }}
                    >
                        <ScrollContainer>
                            <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="center">
                                {factionMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.tokenID}`}
                                        warMachine={wm}
                                        scale={1}
                                        shouldBeExpanded={shouldBeExpanded.shouldBeExpandedFaction}
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
                                        shouldBeExpanded={shouldBeExpanded.shouldBeExpandedOthers}
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
