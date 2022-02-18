import { Slide, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useMemo, useState } from 'react'
import {
    SectionBottom,
    SectionMostFrequentAbilityExecutor,
    SectionTopSups,
    SectionTopSupsFaction,
    SectionWinner,
} from '..'
import { useWebsocket, useLeftSideBar } from '../../containers'
import HubKey from '../../keys'
import { sampleBattleEndDetail } from '../../samepleData'
import { colors } from '../../theme/theme'
import { BattleEndDetail } from '../../types'

const SPAWN_TEST_DATA = true

export const BOTTOM_BUTTONS_HEIGHT = 50

export const BattleEndScreen = () => {
    const { state, subscribe } = useWebsocket()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen } = useLeftSideBar()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()

    // Subscribe on battle end information
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<BattleEndDetail>(
            HubKey.SubBattleEndDetailUpdated,
            (payload) => {
                if (!payload) {
                    toggleIsEndBattleDetailOpen(false)
                    return
                }
                setBattleEndDetail(payload)
                toggleIsEndBattleDetailOpen(true)
            },
            null,
        )
    }, [state, subscribe])

    useEffect(() => {
        if (SPAWN_TEST_DATA) setBattleEndDetail(sampleBattleEndDetail)
        toggleIsEndBattleDetailOpen(true)
    }, [])

    const backgroundColor = useMemo(
        () => ({
            background: `linear-gradient(65deg, ${colors.darkNavyBlue} 3%, ${colors.darkNavyBlue}92 50%, ${colors.darkNavy}90)`,
        }),
        [],
    )

    if (!battleEndDetail || !battleEndDetail.winningFaction) return null

    return (
        <Slide in={isEndBattleDetailOpen} direction="right">
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    boxShadow: 20,
                    zIndex: 999,
                    maxWidth: 616,
                    ...backgroundColor,
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        pl: 4.3,
                        pr: 1,
                        pt: 3,
                        pb: 1.5,
                        ...backgroundColor,
                    }}
                >
                    <Stack
                        spacing={5}
                        sx={{
                            height: `calc(100% - ${BOTTOM_BUTTONS_HEIGHT}px)`,
                            pr: 3.6,
                            overflowY: 'auto',
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            '::-webkit-scrollbar': {
                                width: 4,
                                height: 4,
                            },
                            '::-webkit-scrollbar-track': {
                                backgroundColor: colors.darkNavyBlue,
                                borderRadius: 3,
                            },
                            '::-webkit-scrollbar-thumb': {
                                background: colors.darkNeonBlue,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <SectionWinner battleEndDetail={battleEndDetail} />
                        <SectionTopSups battleEndDetail={battleEndDetail} />
                        <SectionMostFrequentAbilityExecutor battleEndDetail={battleEndDetail} />
                        <SectionTopSupsFaction battleEndDetail={battleEndDetail} />
                    </Stack>

                    <SectionBottom battleEndDetail={battleEndDetail} />

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: -1,
                            ...backgroundColor,
                        }}
                    />
                </Box>
            </Box>
        </Slide>
    )
}
