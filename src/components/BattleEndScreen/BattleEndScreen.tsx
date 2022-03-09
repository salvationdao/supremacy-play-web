import { Slide, Stack } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useMemo, useState } from "react"
import {
    SectionBottom,
    SectionMostFrequentAbilityExecutor,
    SectionMultipliers,
    SectionTopSups,
    SectionTopSupsFaction,
    SectionWinner,
} from ".."
import { useGameServerWebsocket, useOverlayToggles } from "../../containers"
import { shadeColor } from "../../helpers"
import { GameServerKeys } from "../../keys"
import { sampleBattleEndDetail } from "../../samepleData"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

const SPAWN_TEST_DATA = true

export const BOTTOM_BUTTONS_HEIGHT = 50

export const BattleEndScreen = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, toggleIsEndBattleDetailEnabled } = useOverlayToggles()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()

    // Subscribe on battle end information
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<BattleEndDetail>(
            GameServerKeys.SubBattleEndDetailUpdated,
            (payload) => {
                if (!payload) {
                    toggleIsEndBattleDetailOpen(false)
                    return
                }
                setBattleEndDetail(payload)
                toggleIsEndBattleDetailEnabled(true)
                toggleIsEndBattleDetailOpen(true)
            },
            null,
        )
    }, [state, subscribe])

    useEffect(() => {
        if (SPAWN_TEST_DATA) {
            setBattleEndDetail(sampleBattleEndDetail)
            toggleIsEndBattleDetailEnabled(true)
            toggleIsEndBattleDetailOpen(true)
        }
    }, [])

    const primaryColor =
        battleEndDetail && battleEndDetail.winning_faction
            ? battleEndDetail.winning_faction.theme.primary
            : colors.neonBlue
    const backgroundColor =
        battleEndDetail && battleEndDetail.winning_faction
            ? shadeColor(battleEndDetail.winning_faction.theme.primary, -96)
            : colors.darkNavyBlue

    const backgroundColorGradient = useMemo(
        () => ({
            background: `linear-gradient(65deg, ${backgroundColor} 3%, ${backgroundColor}98 50%, ${backgroundColor}95)`,
        }),
        [backgroundColor],
    )

    if (!battleEndDetail || !battleEndDetail.winning_faction) return null

    return (
        <Slide key={battleEndDetail.battle_id} in={isEndBattleDetailOpen} direction="right">
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    boxShadow: 20,
                    zIndex: 999,
                    maxWidth: 616,
                    ...backgroundColorGradient,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        pl: 4.3,
                        pr: 1,
                        pt: 3,
                        pb: 1.5,
                        ...backgroundColorGradient,
                    }}
                >
                    <Stack
                        spacing={4}
                        sx={{
                            height: `calc(100% - ${BOTTOM_BUTTONS_HEIGHT}px)`,
                            pr: 3.6,
                            pb: 4,
                            overflowY: "auto",
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: 4,
                                height: 4,
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: primaryColor,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <SectionMultipliers battleEndDetail={battleEndDetail} />
                        <SectionWinner battleEndDetail={battleEndDetail} />
                        <SectionTopSups battleEndDetail={battleEndDetail} />
                        <SectionMostFrequentAbilityExecutor battleEndDetail={battleEndDetail} />
                        <SectionTopSupsFaction battleEndDetail={battleEndDetail} />
                    </Stack>

                    <SectionBottom battleEndDetail={battleEndDetail} />

                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: -1,
                            ...backgroundColorGradient,
                        }}
                    />
                </Box>
            </Box>
        </Slide>
    )
}
